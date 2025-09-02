/**
 * CSVParserMCP - Model Context Protocol implementation for CSV parsing and analysis
 *
 * Provides intelligent CSV parsing, data analysis, and form generation capabilities.
 * This MCP can analyze CSV structure, detect data patterns, and generate form configurations.
 */

import { MCPResult, MCPError } from '../protocols/types'
import { MCPLogger } from './logger'
import { FormField, FieldType } from '@/types'

export interface CSVData {
	headers: string[]
	rows: string[][]
	totalRows: number
	totalColumns: number
}

export interface CSVAnalysis {
	dataTypes: DataTypeAnalysis[]
	patterns: PatternAnalysis[]
	recommendations: FieldRecommendation[]
	quality: DataQualityMetrics
}

export interface DataTypeAnalysis {
	columnIndex: number
	header: string
	detectedType:
		| 'text'
		| 'number'
		| 'date'
		| 'email'
		| 'phone'
		| 'url'
		| 'boolean'
		| 'mixed'
	confidence: number
	sampleValues: string[]
	uniqueValues: number
	nullCount: number
	format?: string
}

export interface PatternAnalysis {
	columnIndex: number
	header: string
	pattern: string
	patternType:
		| 'email'
		| 'phone'
		| 'date'
		| 'url'
		| 'currency'
		| 'zipcode'
		| 'ssn'
		| 'custom'
	confidence: number
	examples: string[]
}

export interface FieldRecommendation {
	columnIndex: number
	header: string
	recommendedFieldType: FieldType
	confidence: number
	reasoning: string
	suggestedOptions?: string[]
	validationRules?: ValidationRule[]
}

export interface ValidationRule {
	type: 'required' | 'pattern' | 'min' | 'max' | 'minLength' | 'maxLength'
	value?: unknown
	message: string
}

export interface DataQualityMetrics {
	completeness: number // Percentage of non-null values
	consistency: number // How consistent the data format is
	uniqueness: number // Percentage of unique values
	validity: number // How many values match expected patterns
}

export interface CSVParseOptions {
	delimiter?: string
	hasHeader?: boolean
	skipEmptyRows?: boolean
	maxRows?: number
	encoding?: string
}

export class CSVParserMCP {
	/**
	 * Parse CSV content into structured data
	 */
	static parseCSV(
		content: string,
		options: CSVParseOptions = {}
	): MCPResult<CSVData> {
		const tracker = MCPLogger.createPerformanceTracker('parseCSV')

		try {
			const {
				delimiter = ',',
				hasHeader = true,
				skipEmptyRows = true,
				maxRows = 1000,
				encoding = 'utf-8', // eslint-disable-line @typescript-eslint/no-unused-vars
			} = options

			// Split content into lines
			const lines = content
				.split('\n')
				.filter(line => !skipEmptyRows || line.trim().length > 0)

			if (lines.length === 0) {
				return {
					success: false,
					errors: [
						{
							code: 'CSV_ERROR',
							message: 'CSV file is empty',
							timestamp: new Date(),
						},
					],
				}
			}

			// Parse CSV rows
			const rows: string[][] = []
			const startIndex = hasHeader ? 1 : 0
			const endIndex = Math.min(lines.length, startIndex + maxRows)

			for (let i = startIndex; i < endIndex; i++) {
				const row = this.parseCSVRow(lines[i], delimiter)
				if (row.length > 0) {
					rows.push(row)
				}
			}

			// Extract headers
			const headers = hasHeader
				? this.parseCSVRow(lines[0], delimiter)
				: rows[0]?.map((_, index) => `Column ${index + 1}`) || []

			const result: MCPResult<CSVData> = {
				success: true,
				data: {
					headers,
					rows,
					totalRows: rows.length,
					totalColumns: headers.length,
				},
				metadata: {
					executionTime: tracker.end(),
					operation: 'parseCSV',
					timestamp: new Date(),
				},
			}

			MCPLogger.log(
				'parseCSV',
				{
					rows: rows.length,
					columns: headers.length,
					hasHeader,
				},
				result
			)

			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'CSV_ERROR',
				message: 'Failed to parse CSV content',
				details: { actual: error as Error },
				timestamp: new Date(),
			}

			const result: MCPResult<CSVData> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'parseCSV',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('parseCSV', mcpError)
			return result
		}
	}

	/**
	 * Analyze CSV data to detect patterns and recommend field types
	 */
	static analyzeCSV(csvData: CSVData): MCPResult<CSVAnalysis> {
		const tracker = MCPLogger.createPerformanceTracker('analyzeCSV')

		try {
			const dataTypes = this.analyzeDataTypes(csvData)
			const patterns = this.detectPatterns(csvData)
			const recommendations = this.generateFieldRecommendations(
				csvData,
				dataTypes,
				patterns
			)
			const quality = this.calculateDataQuality(csvData, dataTypes)

			const result: MCPResult<CSVAnalysis> = {
				success: true,
				data: {
					dataTypes,
					patterns,
					recommendations,
					quality,
				},
				metadata: {
					executionTime: tracker.end(),
					operation: 'analyzeCSV',
					timestamp: new Date(),
				},
			}

			MCPLogger.log(
				'analyzeCSV',
				{
					columns: csvData.totalColumns,
					recommendations: recommendations.length,
				},
				result
			)

			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'ANALYSIS_ERROR',
				message: 'Failed to analyze CSV data',
				details: { actual: error as Error },
				timestamp: new Date(),
			}

			const result: MCPResult<CSVAnalysis> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'analyzeCSV',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('analyzeCSV', mcpError)
			return result
		}
	}

	/**
	 * Generate form fields from CSV analysis
	 */
	static generateFormFields(
		csvData: CSVData,
		analysis: CSVAnalysis,
		overrides: FieldOverride[] = []
	): MCPResult<FormField[]> {
		const tracker = MCPLogger.createPerformanceTracker('generateFormFields')

		try {
			const fields: FormField[] = []

			for (let i = 0; i < csvData.headers.length; i++) {
				const header = csvData.headers[i]
				const recommendation = analysis.recommendations.find(
					r => r.columnIndex === i
				)
				const override = overrides.find(o => o.columnIndex === i)

				if (!recommendation) continue

				const fieldType =
					override?.fieldType || recommendation.recommendedFieldType
				const field: FormField = {
					id: `field_${Date.now()}_${i}`,
					label: header,
					type: fieldType,
					required: override?.required ?? analysis.quality.completeness > 0.8,
					placeholder: this.generatePlaceholder(fieldType, header),
					options: override?.options || recommendation.suggestedOptions,
					validation:
						override?.validation ||
						this.generateValidationRules(
							fieldType,
							recommendation.validationRules
						),
				}

				fields.push(field)
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
				},
				result
			)

			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'GENERATION_ERROR',
				message: 'Failed to generate form fields',
				details: { actual: error as Error },
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

	// Private helper methods

	private static parseCSVRow(line: string, delimiter: string): string[] {
		const result: string[] = []
		let current = ''
		let inQuotes = false
		let i = 0

		while (i < line.length) {
			const char = line[i]
			const nextChar = line[i + 1]

			if (char === '"') {
				if (inQuotes && nextChar === '"') {
					current += '"'
					i += 2
					continue
				}
				inQuotes = !inQuotes
			} else if (char === delimiter && !inQuotes) {
				result.push(current.trim())
				current = ''
			} else {
				current += char
			}
			i++
		}

		result.push(current.trim())
		return result
	}

	private static analyzeDataTypes(csvData: CSVData): DataTypeAnalysis[] {
		const analyses: DataTypeAnalysis[] = []

		for (let col = 0; col < csvData.totalColumns; col++) {
			const values = csvData.rows
				.map(row => row[col])
				.filter(val => val && val.trim())
			const uniqueValues = new Set(values)
			const nullCount = csvData.rows.length - values.length

			const analysis: DataTypeAnalysis = {
				columnIndex: col,
				header: csvData.headers[col],
				detectedType: this.detectDataType(values),
				confidence: this.calculateTypeConfidence(values),
				sampleValues: values.slice(0, 5),
				uniqueValues: uniqueValues.size,
				nullCount,
			}

			analyses.push(analysis)
		}

		return analyses
	}

	private static detectDataType(
		values: string[]
	): DataTypeAnalysis['detectedType'] {
		if (values.length === 0) return 'text'

		const typeScores = {
			number: 0,
			date: 0,
			email: 0,
			phone: 0,
			url: 0,
			boolean: 0,
			text: 0,
		}

		for (const value of values) {
			// Number detection
			if (/^-?\d+(\.\d+)?$/.test(value)) {
				typeScores.number += 1
			}
			// Date detection
			else if (this.isDate(value)) {
				typeScores.date += 1
			}
			// Email detection
			else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
				typeScores.email += 1
			}
			// Phone detection
			else if (/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/.test(value)) {
				typeScores.phone += 1
			}
			// URL detection
			else if (/^https?:\/\/.+/.test(value)) {
				typeScores.url += 1
			}
			// Boolean detection
			else if (/^(true|false|yes|no|y|n|1|0)$/i.test(value)) {
				typeScores.boolean += 1
			} else {
				typeScores.text += 1
			}
		}

		const maxScore = Math.max(...Object.values(typeScores))
		const detectedType = Object.entries(typeScores).find(
			([, score]) => score === maxScore
		)?.[0] as DataTypeAnalysis['detectedType']

		return detectedType || 'text'
	}

	private static isDate(value: string): boolean {
		const datePatterns = [
			/^\d{4}-\d{2}-\d{2}$/,
			/^\d{2}\/\d{2}\/\d{4}$/,
			/^\d{2}-\d{2}-\d{4}$/,
			/^\d{1,2}\/\d{1,2}\/\d{4}$/,
			/^\d{4}\/\d{2}\/\d{2}$/,
		]

		return (
			datePatterns.some(pattern => pattern.test(value)) &&
			!isNaN(Date.parse(value))
		)
	}

	private static calculateTypeConfidence(values: string[]): number {
		if (values.length === 0) return 0

		const typeScores = {
			number: 0,
			date: 0,
			email: 0,
			phone: 0,
			url: 0,
			boolean: 0,
			text: 0,
		}

		for (const value of values) {
			if (/^-?\d+(\.\d+)?$/.test(value)) typeScores.number += 1
			else if (this.isDate(value)) typeScores.date += 1
			else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) typeScores.email += 1
			else if (/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/.test(value))
				typeScores.phone += 1
			else if (/^https?:\/\/.+/.test(value)) typeScores.url += 1
			else if (/^(true|false|yes|no|y|n|1|0)$/i.test(value))
				typeScores.boolean += 1
			else typeScores.text += 1
		}

		const maxScore = Math.max(...Object.values(typeScores))
		return maxScore / values.length
	}

	private static detectPatterns(csvData: CSVData): PatternAnalysis[] {
		const patterns: PatternAnalysis[] = []

		for (let col = 0; col < csvData.totalColumns; col++) {
			const values = csvData.rows
				.map(row => row[col])
				.filter(val => val && val.trim())

			// Check for common patterns
			const patternChecks = [
				{
					type: 'email' as const,
					regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
					confidence: 0.9,
				},
				{
					type: 'phone' as const,
					regex: /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/,
					confidence: 0.8,
				},
				{
					type: 'date' as const,
					regex: /^\d{4}-\d{2}-\d{2}$/,
					confidence: 0.9,
				},
				{ type: 'url' as const, regex: /^https?:\/\/.+/, confidence: 0.9 },
				{
					type: 'currency' as const,
					regex: /^\$?[\d,]+(\.\d{2})?$/,
					confidence: 0.8,
				},
				{
					type: 'zipcode' as const,
					regex: /^\d{5}(-\d{4})?$/,
					confidence: 0.9,
				},
			]

			for (const check of patternChecks) {
				const matches = values.filter(val => check.regex.test(val))
				if (matches.length / values.length > 0.7) {
					patterns.push({
						columnIndex: col,
						header: csvData.headers[col],
						pattern: check.regex.source,
						patternType: check.type,
						confidence: check.confidence * (matches.length / values.length),
						examples: matches.slice(0, 3),
					})
					break
				}
			}
		}

		return patterns
	}

	private static generateFieldRecommendations(
		csvData: CSVData,
		dataTypes: DataTypeAnalysis[],
		patterns: PatternAnalysis[]
	): FieldRecommendation[] {
		const recommendations: FieldRecommendation[] = []

		for (const dataType of dataTypes) {
			const pattern = patterns.find(p => p.columnIndex === dataType.columnIndex)
			const values = csvData.rows
				.map(row => row[dataType.columnIndex])
				.filter(val => val && val.trim())
			const uniqueValues = new Set(values)

			let recommendedFieldType: FieldType = 'text'
			let reasoning = ''
			let suggestedOptions: string[] | undefined
			const validationRules: ValidationRule[] = []

			// Determine field type based on data analysis
			if (pattern) {
				switch (pattern.patternType) {
					case 'email':
						recommendedFieldType = 'email'
						reasoning = 'Email pattern detected in data'
						validationRules.push({
							type: 'pattern',
							value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							message: 'Please enter a valid email address',
						})
						break
					case 'phone':
						recommendedFieldType = 'phone'
						reasoning = 'Phone number pattern detected'
						break
					case 'date':
						recommendedFieldType = 'date'
						reasoning = 'Date pattern detected in data'
						break
					case 'url':
						recommendedFieldType = 'url'
						reasoning = 'URL pattern detected in data'
						break
					case 'currency':
						recommendedFieldType = 'money'
						reasoning = 'Currency pattern detected'
						break
					case 'zipcode':
						recommendedFieldType = 'zipcode'
						reasoning = 'ZIP code pattern detected'
						break
				}
			} else {
				switch (dataType.detectedType) {
					case 'number':
						recommendedFieldType = 'number'
						reasoning = 'Numeric data detected'
						break
					case 'date':
						recommendedFieldType = 'date'
						reasoning = 'Date data detected'
						break
					case 'boolean':
						recommendedFieldType = 'yesno'
						reasoning = 'Boolean data detected'
						suggestedOptions = ['Yes', 'No']
						break
					default:
						// Check if it's a limited set of values (good for select/dropdown)
						if (uniqueValues.size <= 10 && uniqueValues.size > 1) {
							recommendedFieldType = 'select'
							reasoning = `Limited set of values detected (${uniqueValues.size} unique values)`
							suggestedOptions = Array.from(uniqueValues)
						} else {
							recommendedFieldType = 'text'
							reasoning = 'Text data detected'
						}
				}
			}

			// Add required validation if data is mostly complete
			if (dataType.nullCount / csvData.totalRows < 0.2) {
				validationRules.push({
					type: 'required',
					message: `${dataType.header} is required`,
				})
			}

			recommendations.push({
				columnIndex: dataType.columnIndex,
				header: dataType.header,
				recommendedFieldType,
				confidence: dataType.confidence,
				reasoning,
				suggestedOptions,
				validationRules,
			})
		}

		return recommendations
	}

	private static calculateDataQuality(
		csvData: CSVData,
		dataTypes: DataTypeAnalysis[]
	): DataQualityMetrics {
		const totalCells = csvData.totalRows * csvData.totalColumns
		const nullCells = dataTypes.reduce((sum, dt) => sum + dt.nullCount, 0)
		const completeness = (totalCells - nullCells) / totalCells

		const consistency =
			dataTypes.reduce((sum, dt) => sum + dt.confidence, 0) / dataTypes.length
		const uniqueness =
			dataTypes.reduce(
				(sum, dt) => sum + dt.uniqueValues / csvData.totalRows,
				0
			) / dataTypes.length
		const validity = consistency // Simplified - could be more sophisticated

		return {
			completeness,
			consistency,
			uniqueness,
			validity,
		}
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

	private static generateValidationRules(
		fieldType: FieldType,
		recommendedRules: ValidationRule[] = []
	): FormField['validation'] {
		const validation: FormField['validation'] = {}

		for (const rule of recommendedRules) {
			switch (rule.type) {
				case 'required':
					// Handled by required property
					break
				case 'pattern':
					validation.pattern = rule.value?.source || rule.value
					break
				case 'min':
					validation.min = rule.value
					break
				case 'max':
					validation.max = rule.value
					break
				case 'minLength':
					validation.minLength = rule.value
					break
				case 'maxLength':
					validation.maxLength = rule.value
					break
			}
		}

		return Object.keys(validation).length > 0 ? validation : undefined
	}
}

export interface FieldOverride {
	columnIndex: number
	fieldType?: FieldType
	required?: boolean
	options?: string[]
	validation?: FormField['validation']
}
