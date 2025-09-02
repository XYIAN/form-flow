/**
 * FormGeneratorMCP - Model Context Protocol implementation for intelligent form generation
 *
 * Orchestrates the CSV-to-Form generation process by coordinating CSVParserMCP,
 * FieldTypeDetectorMCP, and other MCPs to create comprehensive form configurations
 * from CSV data with intelligent field type detection and validation.
 */

import { MCPResult, MCPError } from '../protocols/types'
import { MCPLogger } from './logger'
import { FormField, FieldType, Form } from '@/types'
import {
	CSVParserMCP,
	CSVData,
	CSVAnalysis,
	FieldOverride,
} from './CSVParserMCP'
import {
	FieldTypeDetectorMCP,
	DetectionContext,
	FieldTypeDetectionResult,
} from './FieldTypeDetectorMCP'

export interface FormGenerationOptions {
	formTitle?: string
	formDescription?: string
	fieldOverrides?: FieldOverride[]
	detectionStrategy?: 'auto' | 'conservative' | 'aggressive'
	includePreview?: boolean
	validationLevel?: 'basic' | 'comprehensive' | 'strict'
}

export interface FormGenerationResult {
	form: Form
	fields: FormField[]
	analysis: CSVAnalysis
	detectionResults: FieldTypeDetectionResult[]
	generationMetadata: GenerationMetadata
	preview?: FormPreview
}

export interface GenerationMetadata {
	totalFields: number
	detectedTypes: Record<FieldType, number>
	confidenceScores: number[]
	averageConfidence: number
	processingTime: number
	warnings: string[]
	recommendations: string[]
}

export interface FormPreview {
	estimatedFields: number
	complexityScore: number
	userInteractionRequired: boolean
	suggestedImprovements: string[]
}

export interface FormGenerationProgress {
	stage:
		| 'parsing'
		| 'analysis'
		| 'detection'
		| 'generation'
		| 'validation'
		| 'complete'
	progress: number
	message: string
	details?: unknown
}

export class FormGeneratorMCP {
	/**
	 * Generate a complete form from CSV content
	 */
	static generateFormFromCSV(
		csvContent: string,
		options: FormGenerationOptions = {}
	): MCPResult<FormGenerationResult> {
		const tracker = MCPLogger.createPerformanceTracker('generateFormFromCSV')

		try {
			const {
				formTitle = 'Generated Form',
				formDescription = 'Form generated from CSV data',
				fieldOverrides = [],
				detectionStrategy = 'auto',
				includePreview = true,
				validationLevel = 'comprehensive', // eslint-disable-line @typescript-eslint/no-unused-vars
			} = options

			// Stage 1: Parse CSV
			const parseResult = CSVParserMCP.parseCSV(csvContent)
			if (!parseResult.success || !parseResult.data) {
				return {
					success: false,
					errors: parseResult.errors,
					metadata: {
						executionTime: tracker.end(),
						operation: 'generateFormFromCSV',
						timestamp: new Date(),
					},
				}
			}

			const csvData = parseResult.data

			// Stage 2: Analyze CSV data
			const analysisResult = CSVParserMCP.analyzeCSV(csvData)
			if (!analysisResult.success || !analysisResult.data) {
				return {
					success: false,
					errors: analysisResult.errors,
					metadata: {
						executionTime: tracker.end(),
						operation: 'generateFormFromCSV',
						timestamp: new Date(),
					},
				}
			}

			const analysis = analysisResult.data

			// Stage 3: Detect field types
			const detectionContexts = this.createDetectionContexts(csvData, analysis)
			const detectionResult =
				FieldTypeDetectorMCP.batchDetectFieldTypes(detectionContexts)
			if (!detectionResult.success || !detectionResult.data) {
				return {
					success: false,
					errors: detectionResult.errors,
					metadata: {
						executionTime: tracker.end(),
						operation: 'generateFormFromCSV',
						timestamp: new Date(),
					},
				}
			}

			const detectionResults = detectionResult.data

			// Stage 4: Generate form fields
			const fieldsResult = this.generateFormFields(
				csvData,
				analysis,
				detectionResults,
				fieldOverrides,
				detectionStrategy
			)
			if (!fieldsResult.success || !fieldsResult.data) {
				return {
					success: false,
					errors: fieldsResult.errors,
					metadata: {
						executionTime: tracker.end(),
						operation: 'generateFormFromCSV',
						timestamp: new Date(),
					},
				}
			}

			const fields = fieldsResult.data

			// Stage 5: Create form object
			const form: Form = {
				id: `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				userId: 'system', // Will be set by the calling context
				title: formTitle,
				description: formDescription,
				fields,
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			// Stage 6: Generate metadata
			const metadata = this.generateMetadata(
				fields,
				detectionResults,
				tracker.end()
			)

			// Stage 7: Generate preview if requested
			const preview = includePreview
				? this.generatePreview(fields, analysis)
				: undefined

			const result: MCPResult<FormGenerationResult> = {
				success: true,
				data: {
					form,
					fields,
					analysis,
					detectionResults,
					generationMetadata: metadata,
					preview,
				},
				metadata: {
					executionTime: tracker.end(),
					operation: 'generateFormFromCSV',
					timestamp: new Date(),
				},
			}

			MCPLogger.log(
				'generateFormFromCSV',
				{
					fieldsGenerated: fields.length,
					averageConfidence: metadata.averageConfidence,
					processingTime: metadata.processingTime,
				},
				result
			)

			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'GENERATION_ERROR',
				message: 'Failed to generate form from CSV',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<FormGenerationResult> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'generateFormFromCSV',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('generateFormFromCSV', mcpError)
			return result
		}
	}

	/**
	 * Generate form fields with intelligent type detection
	 */
	static generateFormFields(
		csvData: CSVData,
		analysis: CSVAnalysis,
		detectionResults: FieldTypeDetectionResult[],
		overrides: FieldOverride[] = [],
		strategy: 'auto' | 'conservative' | 'aggressive' = 'auto'
	): MCPResult<FormField[]> {
		const tracker = MCPLogger.createPerformanceTracker('generateFormFields')

		try {
			const fields: FormField[] = []
			const warnings: string[] = []
			const recommendations: string[] = []

			for (let i = 0; i < csvData.headers.length; i++) {
				const header = csvData.headers[i]
				const detection = detectionResults[i]
				const override = overrides.find(o => o.columnIndex === i)
				const dataType = analysis.dataTypes[i]

				if (!detection || !dataType) {
					warnings.push(
						`Skipping column ${i}: ${header} - insufficient data for analysis`
					)
					continue
				}

				// Determine field type based on strategy
				let fieldType: FieldType
				let confidence: number

				if (override?.fieldType) {
					fieldType = override.fieldType
					confidence = 1.0
				} else {
					fieldType = this.selectFieldType(detection, strategy)
					confidence = detection.confidence
				}

				// Generate field configuration
				const field: FormField = {
					id: `field_${Date.now()}_${i}`,
					label: header,
					type: fieldType,
					required:
						override?.required ?? this.determineRequired(dataType, confidence),
					placeholder: this.generatePlaceholder(fieldType, header),
					options:
						override?.options ||
						this.generateOptions(fieldType, detection, csvData, i),
					validation:
						override?.validation ||
						this.generateValidation(fieldType, detection, dataType),
				}

				// Add field-specific properties
				this.addFieldSpecificProperties(field, detection, dataType)

				fields.push(field)

				// Generate recommendations
				if (confidence < 0.7) {
					recommendations.push(
						`Consider reviewing field "${header}" - low confidence detection (${Math.round(
							confidence * 100
						)}%)`
					)
				}

				if (detection.alternativeTypes.length > 0) {
					const alternatives = detection.alternativeTypes
						.slice(0, 2)
						.map(alt => alt.fieldType)
						.join(', ')
					recommendations.push(
						`Field "${header}" could also be: ${alternatives}`
					)
				}
			}

			const result: MCPResult<FormField[]> = {
				success: true,
				data: fields,
				metadata: {
					executionTime: tracker.end(),
					operation: 'generateFormFields',
					timestamp: new Date(),
				},
			}

			MCPLogger.log(
				'generateFormFields',
				{
					fieldsGenerated: fields.length,
					warnings: warnings.length,
					recommendations: recommendations.length,
				},
				result
			)

			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'FIELD_GENERATION_ERROR',
				message: 'Failed to generate form fields',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<FormField[]> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'generateFormFields',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('generateFormFields', mcpError)
			return result
		}
	}

	/**
	 * Preview form generation without creating the actual form
	 */
	static previewFormGeneration(
		csvContent: string,
		// eslint-disable-line @typescript-eslint/no-unused-vars
		_options: FormGenerationOptions = {}
	): MCPResult<FormPreview> {
		const tracker = MCPLogger.createPerformanceTracker('previewFormGeneration')

		try {
			// Parse CSV
			const parseResult = CSVParserMCP.parseCSV(csvContent, { maxRows: 10 })
			if (!parseResult.success || !parseResult.data) {
				return {
					success: false,
					errors: parseResult.errors,
					metadata: {
						executionTime: tracker.end(),
						operation: 'previewFormGeneration',
						timestamp: new Date(),
					},
				}
			}

			const csvData = parseResult.data

			// Quick analysis
			const analysisResult = CSVParserMCP.analyzeCSV(csvData)
			if (!analysisResult.success || !analysisResult.data) {
				return {
					success: false,
					errors: analysisResult.errors,
					metadata: {
						executionTime: tracker.end(),
						operation: 'previewFormGeneration',
						timestamp: new Date(),
					},
				}
			}

			const analysis = analysisResult.data

			// Generate preview
			const preview = this.generatePreview([], analysis)

			const result: MCPResult<FormPreview> = {
				success: true,
				data: preview,
				metadata: {
					executionTime: tracker.end(),
					operation: 'previewFormGeneration',
					timestamp: new Date(),
				},
			}

			MCPLogger.log(
				'previewFormGeneration',
				{
					estimatedFields: preview.estimatedFields,
					complexityScore: preview.complexityScore,
				},
				result
			)

			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'PREVIEW_ERROR',
				message: 'Failed to preview form generation',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<FormPreview> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'previewFormGeneration',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('previewFormGeneration', mcpError)
			return result
		}
	}

	// Private helper methods

	private static createDetectionContexts(
		csvData: CSVData,
		analysis: CSVAnalysis
	): DetectionContext[] {
		return csvData.headers.map((header, index) => {
			const values = csvData.rows
				.map(row => row[index])
				.filter(val => val && val.trim())
			const dataType = analysis.dataTypes[index]

			return {
				columnName: header,
				sampleValues: values.slice(0, 10), // Use first 10 values for detection
				allValues: values,
				uniqueCount: dataType?.uniqueValues || 0,
				totalCount: csvData.totalRows,
				nullCount: dataType?.nullCount || 0,
			}
		})
	}

	private static selectFieldType(
		detection: FieldTypeDetectionResult,
		strategy: 'auto' | 'conservative' | 'aggressive'
	): FieldType {
		switch (strategy) {
			case 'conservative':
				// Prefer simpler field types
				if (detection.confidence < 0.8) {
					return 'text'
				}
				break
			case 'aggressive':
				// Use detected type even with lower confidence
				if (detection.confidence > 0.5) {
					return detection.fieldType
				}
				break
			case 'auto':
			default:
				// Balanced approach
				if (detection.confidence > 0.6) {
					return detection.fieldType
				}
				break
		}

		// Fallback to text
		return 'text'
	}

	private static determineRequired(
		// eslint-disable-line @typescript-eslint/no-unused-vars
		_dataType: unknown, 
		confidence: number
	): boolean {
		// Consider field required if:
		// 1. Low null count (most values are present)
		// 2. High confidence detection
		// 3. Not a high-cardinality field
		const nullRatio =
			dataType.nullCount / (dataType.nullCount + dataType.uniqueValues)
		return nullRatio < 0.2 && confidence > 0.7
	}

	private static generatePlaceholder(
		fieldType: FieldType,
		header: string
	): string {
		const placeholders: Record<FieldType, string> = {
			text: `Enter ${header.toLowerCase()}...`,
			email: 'Enter email address...',
			password: 'Enter password...',
			number: 'Enter number...',
			url: 'https://example.com',
			search: 'Search...',
			date: 'Select date...',
			datetime: 'Select date and time...',
			time: 'Select time...',
			month: 'Select month...',
			week: 'Select week...',
			year: 'Select year...',
			textarea: `Enter ${header.toLowerCase()}...`,
			'rich-text': `Enter ${header.toLowerCase()}...`,
			markdown: `Enter ${header.toLowerCase()}...`,
			select: 'Select an option...',
			multiselect: 'Select options...',
			checkbox: 'Select options...',
			radio: 'Select an option...',
			yesno: 'Select Yes or No',
			toggle: 'Toggle on/off',
			money: '$0.00',
			percentage: '0%',
			currency: '$0.00',
			phone: '(555) 123-4567',
			address: 'Enter address...',
			country: 'Select country...',
			state: 'Select state...',
			zipcode: '12345',
			file: 'Choose file...',
			image: 'Choose image...',
			signature: 'Type your name...',
			audio: 'Choose audio file...',
			video: 'Choose video file...',
			rating: 'Rate from 1-5',
			slider: 'Adjust slider',
			range: 'Select range',
			likert: 'Select option',
			color: '#000000',
			tags: 'Add tags...',
			autocomplete: 'Start typing...',
			location: 'Enter location...',
			matrix: 'Select options...',
		}

		return placeholders[fieldType] || `Enter ${header.toLowerCase()}...`
	}

	private static generateOptions(
		fieldType: FieldType,
		detection: FieldTypeDetectionResult,
		csvData: CSVData,
		columnIndex: number
	): string[] | undefined {
		// Only generate options for selection fields
		if (!['select', 'radio', 'checkbox', 'multiselect'].includes(fieldType)) {
			return undefined
		}

		// Get unique values from the column
		const values = csvData.rows
			.map(row => row[columnIndex])
			.filter(val => val && val.trim())
		const uniqueValues = [...new Set(values)]

		// Limit to reasonable number of options
		if (uniqueValues.length > 20) {
			return undefined
		}

		return uniqueValues
	}

	private static generateValidation(
		fieldType: FieldType,
		detection: FieldTypeDetectionResult,
		dataType: any
	): FormField['validation'] {
		const validation: FormField['validation'] = {}

		// Add validation suggestions from detection
		for (const suggestion of detection.validationSuggestions) {
			if (suggestion.confidence > 0.7) {
				switch (suggestion.type) {
					case 'pattern':
						validation.pattern = suggestion.value?.source || suggestion.value
						break
					case 'min':
						validation.min = suggestion.value
						break
					case 'max':
						validation.max = suggestion.value
						break
					case 'minLength':
						validation.minLength = suggestion.value
						break
					case 'maxLength':
						validation.maxLength = suggestion.value
						break
				}
			}
		}

		return Object.keys(validation).length > 0 ? validation : undefined
	}

	private static addFieldSpecificProperties(
		field: FormField,
		// eslint-disable-line @typescript-eslint/no-unused-vars
		_detection: FieldTypeDetectionResult,
		// eslint-disable-line @typescript-eslint/no-unused-vars
		_dataType: unknown
	): void {
		// Add field-specific properties based on type and detection
		switch (field.type) {
			case 'rating':
				field.ratingMax = 5
				break
			case 'slider':
				field.sliderMin = 0
				field.sliderMax = 100
				field.sliderStep = 1
				break
			case 'textarea':
				field.textareaRows = 4
				break
			case 'money':
			case 'currency':
				field.currency = 'USD'
				break
			case 'percentage':
				field.percentageDecimals = 2
				break
		}
	}

	private static generateMetadata(
		fields: FormField[],
		detectionResults: FieldTypeDetectionResult[],
		processingTime: number
	): GenerationMetadata {
		const detectedTypes: Record<FieldType, number> = {} as Record<
			FieldType,
			number
		>
		const confidenceScores: number[] = []

		// Count field types
		fields.forEach(field => {
			detectedTypes[field.type] = (detectedTypes[field.type] || 0) + 1
		})

		// Collect confidence scores
		detectionResults.forEach(result => {
			confidenceScores.push(result.confidence)
		})

		const averageConfidence =
			confidenceScores.length > 0
				? confidenceScores.reduce((sum, score) => sum + score, 0) /
				  confidenceScores.length
				: 0

		return {
			totalFields: fields.length,
			detectedTypes,
			confidenceScores,
			averageConfidence,
			processingTime,
			warnings: [],
			recommendations: [],
		}
	}

	private static generatePreview(
		fields: FormField[],
		analysis: CSVAnalysis
	): FormPreview {
		const estimatedFields = analysis.dataTypes.length
		const complexityScore = this.calculateComplexityScore(analysis)
		const userInteractionRequired =
			complexityScore > 0.7 || analysis.quality.completeness < 0.8

		const suggestedImprovements: string[] = []
		if (analysis.quality.completeness < 0.8) {
			suggestedImprovements.push(
				'Consider cleaning up missing data for better form generation'
			)
		}
		if (complexityScore > 0.7) {
			suggestedImprovements.push(
				'Complex data detected - manual review recommended'
			)
		}
		if (analysis.dataTypes.some(dt => dt.confidence < 0.6)) {
			suggestedImprovements.push(
				'Some fields have low confidence detection - review recommended'
			)
		}

		return {
			estimatedFields,
			complexityScore,
			userInteractionRequired,
			suggestedImprovements,
		}
	}

	private static calculateComplexityScore(analysis: CSVAnalysis): number {
		let score = 0

		// Data quality factors
		score += (1 - analysis.quality.completeness) * 0.3
		score += (1 - analysis.quality.consistency) * 0.3
		score += (1 - analysis.quality.validity) * 0.2

		// Pattern complexity
		score += analysis.patterns.length * 0.1

		// Data type diversity
		const uniqueTypes = new Set(analysis.dataTypes.map(dt => dt.detectedType))
			.size
		score += Math.min(uniqueTypes / 10, 0.2)

		return Math.min(score, 1.0)
	}
}
