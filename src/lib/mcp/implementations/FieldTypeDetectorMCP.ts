/**
 * FieldTypeDetectorMCP - Model Context Protocol implementation for intelligent field type detection
 *
 * Provides advanced field type detection using machine learning-like heuristics,
 * pattern recognition, and semantic analysis to determine the most appropriate
 * field types for form generation.
 */

import { MCPResult, MCPError } from '../protocols/types'
import { MCPLogger } from './logger'
import { FieldType } from '@/types'

export interface FieldTypeDetectionResult {
	fieldType: FieldType
	confidence: number
	reasoning: string
	alternativeTypes: AlternativeFieldType[]
	validationSuggestions: ValidationSuggestion[]
	uiHints: UIHint[]
}

export interface AlternativeFieldType {
	fieldType: FieldType
	confidence: number
	reasoning: string
}

export interface ValidationSuggestion {
	type:
		| 'required'
		| 'pattern'
		| 'min'
		| 'max'
		| 'minLength'
		| 'maxLength'
		| 'custom'
	value?: unknown
	message: string
	confidence: number
}

export interface UIHint {
	type: 'placeholder' | 'options' | 'format' | 'constraints'
	value: unknown
	description: string
}

export interface DetectionContext {
	columnName: string
	sampleValues: string[]
	allValues: string[]
	uniqueCount: number
	totalCount: number
	nullCount: number
	contextualHints?: string[]
}

export class FieldTypeDetectorMCP {
	/**
	 * Detect the most appropriate field type for a given column
	 */
	static detectFieldType(
		context: DetectionContext
	): MCPResult<FieldTypeDetectionResult> {
		const tracker = MCPLogger.createPerformanceTracker('detectFieldType')

		try {
			// Run multiple detection strategies
			const strategies = [
				this.detectByPattern(context),
				this.detectBySemantic(context),
				this.detectByStatistical(context),
				this.detectByContextual(context),
			]

			// Combine results using weighted scoring
			const combinedResult = this.combineDetectionResults(strategies, context)

			const result: MCPResult<FieldTypeDetectionResult> = {
				success: true,
				data: combinedResult,
				metadata: {
					executionTime: tracker.end(),
					operation: 'detectFieldType',
					timestamp: new Date(),
				},
			}

			MCPLogger.log(
				'detectFieldType',
				{
					columnName: context.columnName,
					detectedType: combinedResult.fieldType,
					confidence: combinedResult.confidence,
				},
				result
			)

			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'DETECTION_ERROR',
				message: 'Failed to detect field type',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<FieldTypeDetectionResult> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'detectFieldType',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('detectFieldType', mcpError)
			return result
		}
	}

	/**
	 * Batch detect field types for multiple columns
	 */
	static batchDetectFieldTypes(
		contexts: DetectionContext[]
	): MCPResult<FieldTypeDetectionResult[]> {
		const tracker = MCPLogger.createPerformanceTracker('batchDetectFieldTypes')

		try {
			const results: FieldTypeDetectionResult[] = []

			for (const context of contexts) {
				const detection = this.detectFieldType(context)
				if (detection.success && detection.data) {
					results.push(detection.data)
				}
			}

			const result: MCPResult<FieldTypeDetectionResult[]> = {
				success: true,
				data: results,
				metadata: {
					executionTime: tracker.end(),
					operation: 'batchDetectFieldTypes',
					timestamp: new Date(),
				},
			}

			MCPLogger.log(
				'batchDetectFieldTypes',
				{
					contextsProcessed: contexts.length,
					resultsGenerated: results.length,
				},
				result
			)

			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'BATCH_DETECTION_ERROR',
				message: 'Failed to batch detect field types',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<FieldTypeDetectionResult[]> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'batchDetectFieldTypes',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('batchDetectFieldTypes', mcpError)
			return result
		}
	}

	// Private detection strategies

	private static detectByPattern(
		context: DetectionContext
	): FieldTypeDetectionResult {
		const patterns = [
			// Email patterns
			{
				regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
				fieldType: 'email' as FieldType,
				confidence: 0.95,
				reasoning: 'Email pattern detected',
			},
			// Phone patterns
			{
				regex: /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/,
				fieldType: 'phone' as FieldType,
				confidence: 0.9,
				reasoning: 'Phone number pattern detected',
			},
			// URL patterns
			{
				regex: /^https?:\/\/.+/,
				fieldType: 'url' as FieldType,
				confidence: 0.95,
				reasoning: 'URL pattern detected',
			},
			// Date patterns
			{
				regex: /^\d{4}-\d{2}-\d{2}$/,
				fieldType: 'date' as FieldType,
				confidence: 0.9,
				reasoning: 'ISO date pattern detected',
			},
			{
				regex: /^\d{2}\/\d{2}\/\d{4}$/,
				fieldType: 'date' as FieldType,
				confidence: 0.85,
				reasoning: 'MM/DD/YYYY date pattern detected',
			},
			// Currency patterns
			{
				regex: /^\$?[\d,]+(\.\d{2})?$/,
				fieldType: 'money' as FieldType,
				confidence: 0.9,
				reasoning: 'Currency pattern detected',
			},
			// ZIP code patterns
			{
				regex: /^\d{5}(-\d{4})?$/,
				fieldType: 'zipcode' as FieldType,
				confidence: 0.95,
				reasoning: 'ZIP code pattern detected',
			},
			// Percentage patterns
			{
				regex: /^\d+(\.\d+)?%?$/,
				fieldType: 'percentage' as FieldType,
				confidence: 0.8,
				reasoning: 'Percentage pattern detected',
			},
			// Number patterns
			{
				regex: /^-?\d+(\.\d+)?$/,
				fieldType: 'number' as FieldType,
				confidence: 0.85,
				reasoning: 'Numeric pattern detected',
			},
		]

		let bestMatch = {
			fieldType: 'text' as FieldType,
			confidence: 0.1,
			reasoning: 'No specific pattern detected',
		}

		for (const pattern of patterns) {
			const matches = context.sampleValues.filter(val =>
				pattern.regex.test(val)
			)
			const matchRatio = matches.length / context.sampleValues.length

			if (matchRatio > 0.7 && pattern.confidence > bestMatch.confidence) {
				bestMatch = {
					fieldType: pattern.fieldType,
					confidence: pattern.confidence * matchRatio,
					reasoning: pattern.reasoning,
				}
			}
		}

		return {
			fieldType: bestMatch.fieldType,
			confidence: bestMatch.confidence,
			reasoning: bestMatch.reasoning,
			alternativeTypes: [],
			validationSuggestions: this.generateValidationSuggestions(
				bestMatch.fieldType,
				context
			),
			uiHints: this.generateUIHints(bestMatch.fieldType, context),
		}
	}

	private static detectBySemantic(
		context: DetectionContext
	): FieldTypeDetectionResult {
		const columnName = context.columnName.toLowerCase()

		// Semantic keyword mapping
		const semanticMap: Record<
			string,
			{ fieldType: FieldType; confidence: number; reasoning: string }
		> = {
			// Contact information
			email: {
				fieldType: 'email',
				confidence: 0.95,
				reasoning: 'Column name suggests email field',
			},
			phone: {
				fieldType: 'phone',
				confidence: 0.9,
				reasoning: 'Column name suggests phone field',
			},
			address: {
				fieldType: 'address',
				confidence: 0.9,
				reasoning: 'Column name suggests address field',
			},
			zip: {
				fieldType: 'zipcode',
				confidence: 0.9,
				reasoning: 'Column name suggests ZIP code field',
			},
			country: {
				fieldType: 'country',
				confidence: 0.9,
				reasoning: 'Column name suggests country field',
			},
			state: {
				fieldType: 'state',
				confidence: 0.9,
				reasoning: 'Column name suggests state field',
			},

			// Financial
			price: {
				fieldType: 'money',
				confidence: 0.9,
				reasoning: 'Column name suggests price field',
			},
			cost: {
				fieldType: 'money',
				confidence: 0.9,
				reasoning: 'Column name suggests cost field',
			},
			amount: {
				fieldType: 'money',
				confidence: 0.85,
				reasoning: 'Column name suggests amount field',
			},
			percentage: {
				fieldType: 'percentage',
				confidence: 0.9,
				reasoning: 'Column name suggests percentage field',
			},

			// Dates and times
			date: {
				fieldType: 'date',
				confidence: 0.9,
				reasoning: 'Column name suggests date field',
			},
			time: {
				fieldType: 'time',
				confidence: 0.9,
				reasoning: 'Column name suggests time field',
			},
			created: {
				fieldType: 'datetime',
				confidence: 0.85,
				reasoning: 'Column name suggests creation timestamp',
			},
			updated: {
				fieldType: 'datetime',
				confidence: 0.85,
				reasoning: 'Column name suggests update timestamp',
			},

			// URLs and links
			url: {
				fieldType: 'url',
				confidence: 0.95,
				reasoning: 'Column name suggests URL field',
			},
			link: {
				fieldType: 'url',
				confidence: 0.9,
				reasoning: 'Column name suggests link field',
			},
			website: {
				fieldType: 'url',
				confidence: 0.9,
				reasoning: 'Column name suggests website field',
			},

			// Text content
			description: {
				fieldType: 'textarea',
				confidence: 0.8,
				reasoning: 'Column name suggests description field',
			},
			comment: {
				fieldType: 'textarea',
				confidence: 0.8,
				reasoning: 'Column name suggests comment field',
			},
			note: {
				fieldType: 'textarea',
				confidence: 0.8,
				reasoning: 'Column name suggests note field',
			},
			message: {
				fieldType: 'textarea',
				confidence: 0.8,
				reasoning: 'Column name suggests message field',
			},

			// Boolean/Choice fields
			active: {
				fieldType: 'yesno',
				confidence: 0.8,
				reasoning: 'Column name suggests boolean field',
			},
			enabled: {
				fieldType: 'yesno',
				confidence: 0.8,
				reasoning: 'Column name suggests boolean field',
			},
			status: {
				fieldType: 'select',
				confidence: 0.7,
				reasoning: 'Column name suggests status selection',
			},
			type: {
				fieldType: 'select',
				confidence: 0.7,
				reasoning: 'Column name suggests type selection',
			},
			category: {
				fieldType: 'select',
				confidence: 0.7,
				reasoning: 'Column name suggests category selection',
			},

			// Rating/Scale fields
			rating: {
				fieldType: 'rating',
				confidence: 0.9,
				reasoning: 'Column name suggests rating field',
			},
			score: {
				fieldType: 'rating',
				confidence: 0.8,
				reasoning: 'Column name suggests score field',
			},
			priority: {
				fieldType: 'slider',
				confidence: 0.7,
				reasoning: 'Column name suggests priority scale',
			},

			// File/Media fields
			image: {
				fieldType: 'image',
				confidence: 0.9,
				reasoning: 'Column name suggests image field',
			},
			photo: {
				fieldType: 'image',
				confidence: 0.9,
				reasoning: 'Column name suggests photo field',
			},
			file: {
				fieldType: 'file',
				confidence: 0.9,
				reasoning: 'Column name suggests file field',
			},
			document: {
				fieldType: 'file',
				confidence: 0.9,
				reasoning: 'Column name suggests document field',
			},
			signature: {
				fieldType: 'signature',
				confidence: 0.95,
				reasoning: 'Column name suggests signature field',
			},
		}

		// Check for exact matches first
		if (semanticMap[columnName]) {
			const match = semanticMap[columnName]
			return {
				fieldType: match.fieldType,
				confidence: match.confidence,
				reasoning: match.reasoning,
				alternativeTypes: [],
				validationSuggestions: this.generateValidationSuggestions(
					match.fieldType,
					context
				),
				uiHints: this.generateUIHints(match.fieldType, context),
			}
		}

		// Check for partial matches
		for (const [keyword, config] of Object.entries(semanticMap)) {
			if (columnName.includes(keyword)) {
				return {
					fieldType: config.fieldType,
					confidence: config.confidence * 0.8, // Reduce confidence for partial matches
					reasoning: `${config.reasoning} (partial match)`,
					alternativeTypes: [],
					validationSuggestions: this.generateValidationSuggestions(
						config.fieldType,
						context
					),
					uiHints: this.generateUIHints(config.fieldType, context),
				}
			}
		}

		return {
			fieldType: 'text',
			confidence: 0.1,
			reasoning: 'No semantic hints found in column name',
			alternativeTypes: [],
			validationSuggestions: [],
			uiHints: [],
		}
	}

	private static detectByStatistical(
		context: DetectionContext
	): FieldTypeDetectionResult {
		const uniqueRatio = context.uniqueCount / context.totalCount
		const nullRatio = context.nullCount / context.totalCount
		const avgLength =
			context.sampleValues.reduce((sum, val) => sum + val.length, 0) /
			context.sampleValues.length

		// High uniqueness suggests ID or select field
		if (uniqueRatio > 0.9) {
			if (context.sampleValues.every(val => /^\d+$/.test(val))) {
				return {
					fieldType: 'number',
					confidence: 0.8,
					reasoning: 'High uniqueness with numeric values suggests ID field',
					alternativeTypes: [
						{
							fieldType: 'text',
							confidence: 0.6,
							reasoning: 'Could be text ID',
						},
					],
					validationSuggestions: this.generateValidationSuggestions(
						'number',
						context
					),
					uiHints: this.generateUIHints('number', context),
				}
			}
		}

		// Low uniqueness suggests select field
		if (uniqueRatio < 0.1 && context.uniqueCount <= 10) {
			return {
				fieldType: 'select',
				confidence: 0.8,
				reasoning: `Low uniqueness (${context.uniqueCount} unique values) suggests selection field`,
				alternativeTypes: [
					{
						fieldType: 'radio',
						confidence: 0.7,
						reasoning: 'Could be radio buttons',
					},
					{
						fieldType: 'checkbox',
						confidence: 0.5,
						reasoning: 'Could be checkbox group',
					},
				],
				validationSuggestions: this.generateValidationSuggestions(
					'select',
					context
				),
				uiHints: this.generateUIHints('select', context),
			}
		}

		// Long text suggests textarea
		if (avgLength > 100) {
			return {
				fieldType: 'textarea',
				confidence: 0.7,
				reasoning: `Long text content (avg ${Math.round(
					avgLength
				)} chars) suggests textarea`,
				alternativeTypes: [
					{
						fieldType: 'rich-text',
						confidence: 0.6,
						reasoning: 'Could be rich text',
					},
				],
				validationSuggestions: this.generateValidationSuggestions(
					'textarea',
					context
				),
				uiHints: this.generateUIHints('textarea', context),
			}
		}

		// High null ratio suggests optional field
		if (nullRatio > 0.3) {
			return {
				fieldType: 'text',
				confidence: 0.6,
				reasoning: 'High null ratio suggests optional text field',
				alternativeTypes: [],
				validationSuggestions: this.generateValidationSuggestions(
					'text',
					context
				),
				uiHints: this.generateUIHints('text', context),
			}
		}

		return {
			fieldType: 'text',
			confidence: 0.5,
			reasoning: 'Statistical analysis inconclusive',
			alternativeTypes: [],
			validationSuggestions: [],
			uiHints: [],
		}
	}

	private static detectByContextual(
		// eslint-disable-line @typescript-eslint/no-unused-vars
		_context: DetectionContext
	): FieldTypeDetectionResult {
		// This would use contextual hints from the user or surrounding data
		// For now, return a neutral result
		return {
			fieldType: 'text',
			confidence: 0.3,
			reasoning: 'Contextual analysis not available',
			alternativeTypes: [],
			validationSuggestions: [],
			uiHints: [],
		}
	}

	private static combineDetectionResults(
		results: FieldTypeDetectionResult[],
		context: DetectionContext
	): FieldTypeDetectionResult {
		// Weight the different detection strategies
		const weights = [0.4, 0.3, 0.2, 0.1] // Pattern, Semantic, Statistical, Contextual

		const typeScores: Record<FieldType, number> = {} as Record<
			FieldType,
			number
		>
		const typeReasons: Record<FieldType, string[]> = {} as Record<
			FieldType,
			string[]
		>

		// Aggregate scores
		results.forEach((result, index) => {
			const weight = weights[index]
			const score = result.confidence * weight

			if (!typeScores[result.fieldType]) {
				typeScores[result.fieldType] = 0
				typeReasons[result.fieldType] = []
			}

			typeScores[result.fieldType] += score
			typeReasons[result.fieldType].push(result.reasoning)
		})

		// Find the best type
		const bestType = Object.entries(typeScores).reduce(
			(best, [type, score]) =>
				score > best.score ? { type: type as FieldType, score } : best,
			{ type: 'text' as FieldType, score: 0 }
		)

		// Generate alternatives
		const alternatives = Object.entries(typeScores)
			.filter(([type, score]) => type !== bestType.type && score > 0.1)
			.map(([type, score]) => ({
				fieldType: type as FieldType,
				confidence: score,
				reasoning:
					typeReasons[type as FieldType]?.join('; ') || 'Alternative detection',
			}))
			.sort((a, b) => b.confidence - a.confidence)
			.slice(0, 3)

		return {
			fieldType: bestType.type,
			confidence: Math.min(bestType.score, 1.0),
			reasoning:
				typeReasons[bestType.type]?.join('; ') || 'Combined detection result',
			alternativeTypes: alternatives,
			validationSuggestions: this.generateValidationSuggestions(
				bestType.type,
				context
			),
			uiHints: this.generateUIHints(bestType.type, context),
		}
	}

	private static generateValidationSuggestions(
		fieldType: FieldType,
		context: DetectionContext
	): ValidationSuggestion[] {
		const suggestions: ValidationSuggestion[] = []

		// Required validation based on null ratio
		const nullRatio = context.nullCount / context.totalCount
		if (nullRatio < 0.2) {
			suggestions.push({
				type: 'required',
				message: `${context.columnName} is required`,
				confidence: 0.9,
			})
		}

		// Type-specific validations
		switch (fieldType) {
			case 'email':
				suggestions.push({
					type: 'pattern',
					value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
					message: 'Please enter a valid email address',
					confidence: 0.95,
				})
				break
			case 'phone':
				suggestions.push({
					type: 'pattern',
					value: /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/,
					message: 'Please enter a valid phone number',
					confidence: 0.9,
				})
				break
			case 'url':
				suggestions.push({
					type: 'pattern',
					value: /^https?:\/\/.+/,
					message: 'Please enter a valid URL',
					confidence: 0.95,
				})
				break
			case 'number':
				suggestions.push({
					type: 'pattern',
					value: /^-?\d+(\.\d+)?$/,
					message: 'Please enter a valid number',
					confidence: 0.9,
				})
				break
		}

		// Length validations based on data
		const avgLength =
			context.sampleValues.reduce((sum, val) => sum + val.length, 0) /
			context.sampleValues.length
		if (avgLength > 0) {
			suggestions.push({
				type: 'maxLength',
				value: Math.max(avgLength * 2, 255),
				message: `Maximum length is ${Math.max(avgLength * 2, 255)} characters`,
				confidence: 0.7,
			})
		}

		return suggestions
	}

	private static generateUIHints(
		fieldType: FieldType,
		context: DetectionContext
	): UIHint[] {
		const hints: UIHint[] = []

		// Generate placeholder
		const placeholder = this.generatePlaceholder(fieldType, context.columnName)
		hints.push({
			type: 'placeholder',
			value: placeholder,
			description: 'Suggested placeholder text',
		})

		// Generate options for select fields
		if (['select', 'radio', 'checkbox', 'multiselect'].includes(fieldType)) {
			const uniqueValues = [...new Set(context.sampleValues)]
			if (uniqueValues.length <= 20) {
				hints.push({
					type: 'options',
					value: uniqueValues,
					description: 'Suggested options based on data',
				})
			}
		}

		// Generate format hints
		if (fieldType === 'date') {
			hints.push({
				type: 'format',
				value: 'mm/dd/yyyy',
				description: 'Suggested date format',
			})
		}

		return hints
	}

	private static generatePlaceholder(
		fieldType: FieldType,
		columnName: string
	): string {
		const placeholders: Record<FieldType, string> = {
			text: `Enter ${columnName.toLowerCase()}...`,
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
			textarea: `Enter ${columnName.toLowerCase()}...`,
			'rich-text': `Enter ${columnName.toLowerCase()}...`,
			markdown: `Enter ${columnName.toLowerCase()}...`,
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

		return placeholders[fieldType] || `Enter ${columnName.toLowerCase()}...`
	}
}
