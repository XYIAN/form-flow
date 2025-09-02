/**
 * InputLibraryMCP - Model Context Protocol implementation for Input Library management
 *
 * Provides comprehensive input type definitions, configurations, and utilities
 * for the form builder. This MCP manages all available input types, their
 * properties, validation rules, and UI configurations following the established
 * MCP architecture patterns.
 */

import { MCPResult, MCPError } from '../protocols/types'
import { MCPLogger } from './logger'
import { FieldType, FormField } from '@/types'

export interface InputTypeConfig {
	id: FieldType
	name: string
	description: string
	category: InputCategory
	icon: string
	component: string
	requiresOptions: boolean
	hasValidation: boolean
	hasFileUpload: boolean
	hasCustomProps: boolean
	defaultProps: Partial<FormField>
	validationRules: ValidationRule[]
	uiConfig: UIConfig
}

export interface ValidationRule {
	type:
		| 'required'
		| 'pattern'
		| 'min'
		| 'max'
		| 'minLength'
		| 'maxLength'
		| 'custom'
	value?: any
	message: string
	condition?: (field: FormField) => boolean
}

export interface UIConfig {
	showPlaceholder: boolean
	showOptions: boolean
	showValidation: boolean
	showFileSettings: boolean
	showCustomProps: boolean
	customProps?: CustomProp[]
}

export interface CustomProp {
	key: string
	label: string
	type: 'text' | 'number' | 'select' | 'boolean' | 'array'
	options?: string[]
	defaultValue?: any
	description?: string
}

export type InputCategory =
	| 'basic'
	| 'date-time'
	| 'text-advanced'
	| 'selection'
	| 'financial'
	| 'contact'
	| 'file-media'
	| 'rating-scale'
	| 'specialized'

export class InputLibraryMCP {
	private static inputTypes: Map<FieldType, InputTypeConfig> = new Map()
	private static initialized = false

	/**
	 * Initialize the input library with all available input types
	 */
	static initialize(): MCPResult<boolean> {
		const tracker = MCPLogger.createPerformanceTracker('initialize')

		try {
			if (this.initialized) {
				return {
					success: true,
					data: true,
					metadata: {
						executionTime: tracker.end(),
						operation: 'initialize',
						timestamp: new Date(),
					},
				}
			}

			// Basic Input Types
			this.registerInputType({
				id: 'text',
				name: 'Text Input',
				description: 'Single-line text input field',
				category: 'basic',
				icon: 'pi pi-font',
				component: 'InputText',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: false,
				defaultProps: { placeholder: 'Enter text...' },
				validationRules: [
					{ type: 'required', message: 'This field is required' },
					{
						type: 'minLength',
						value: 1,
						message: 'Minimum length is 1 character',
					},
					{
						type: 'maxLength',
						value: 255,
						message: 'Maximum length is 255 characters',
					},
				],
				uiConfig: {
					showPlaceholder: true,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: false,
				},
			})

			this.registerInputType({
				id: 'email',
				name: 'Email',
				description: 'Email address input with validation',
				category: 'basic',
				icon: 'pi pi-envelope',
				component: 'InputText',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: false,
				defaultProps: { placeholder: 'Enter email address...' },
				validationRules: [
					{ type: 'required', message: 'Email is required' },
					{
						type: 'pattern',
						value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
						message: 'Please enter a valid email address',
					},
				],
				uiConfig: {
					showPlaceholder: true,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: false,
				},
			})

			this.registerInputType({
				id: 'password',
				name: 'Password',
				description: 'Password input field with masking',
				category: 'basic',
				icon: 'pi pi-lock',
				component: 'InputText',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: false,
				defaultProps: { placeholder: 'Enter password...' },
				validationRules: [
					{ type: 'required', message: 'Password is required' },
					{
						type: 'minLength',
						value: 8,
						message: 'Password must be at least 8 characters',
					},
				],
				uiConfig: {
					showPlaceholder: true,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: false,
				},
			})

			this.registerInputType({
				id: 'number',
				name: 'Number',
				description: 'Numeric input field',
				category: 'basic',
				icon: 'pi pi-hashtag',
				component: 'InputText',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: true,
				defaultProps: { placeholder: 'Enter number...' },
				validationRules: [
					{ type: 'required', message: 'Number is required' },
					{ type: 'min', value: 0, message: 'Minimum value is 0' },
					{ type: 'max', value: 999999, message: 'Maximum value is 999,999' },
				],
				uiConfig: {
					showPlaceholder: true,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: true,
					customProps: [
						{
							key: 'validation.min',
							label: 'Minimum Value',
							type: 'number',
							defaultValue: 0,
						},
						{
							key: 'validation.max',
							label: 'Maximum Value',
							type: 'number',
							defaultValue: 999999,
						},
						{
							key: 'validation.step',
							label: 'Step Value',
							type: 'number',
							defaultValue: 1,
						},
					],
				},
			})

			this.registerInputType({
				id: 'url',
				name: 'URL',
				description: 'URL input field with validation',
				category: 'basic',
				icon: 'pi pi-link',
				component: 'InputText',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: true,
				defaultProps: { placeholder: 'https://example.com' },
				validationRules: [
					{ type: 'required', message: 'URL is required' },
					{
						type: 'pattern',
						value: /^https?:\/\/.+/,
						message:
							'Please enter a valid URL starting with http:// or https://',
					},
				],
				uiConfig: {
					showPlaceholder: true,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: true,
					customProps: [
						{
							key: 'urlProtocols',
							label: 'Allowed Protocols',
							type: 'array',
							defaultValue: ['http', 'https'],
						},
					],
				},
			})

			this.registerInputType({
				id: 'search',
				name: 'Search',
				description: 'Search input field with suggestions',
				category: 'basic',
				icon: 'pi pi-search',
				component: 'InputText',
				requiresOptions: false,
				hasValidation: false,
				hasFileUpload: false,
				hasCustomProps: false,
				defaultProps: { placeholder: 'Search...' },
				validationRules: [],
				uiConfig: {
					showPlaceholder: true,
					showOptions: false,
					showValidation: false,
					showFileSettings: false,
					showCustomProps: false,
				},
			})

			// Date & Time Types
			this.registerInputType({
				id: 'date',
				name: 'Date',
				description: 'Date picker with calendar',
				category: 'date-time',
				icon: 'pi pi-calendar',
				component: 'Calendar',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: true,
				defaultProps: {},
				validationRules: [{ type: 'required', message: 'Date is required' }],
				uiConfig: {
					showPlaceholder: false,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: true,
					customProps: [
						{
							key: 'dateFormat',
							label: 'Date Format',
							type: 'select',
							options: ['mm/dd/yy', 'dd/mm/yy', 'yy-mm-dd'],
							defaultValue: 'mm/dd/yy',
						},
					],
				},
			})

			this.registerInputType({
				id: 'datetime',
				name: 'Date & Time',
				description: 'Date and time picker',
				category: 'date-time',
				icon: 'pi pi-clock',
				component: 'Calendar',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: true,
				defaultProps: {},
				validationRules: [
					{ type: 'required', message: 'Date and time is required' },
				],
				uiConfig: {
					showPlaceholder: false,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: true,
					customProps: [
						{
							key: 'dateFormat',
							label: 'Date Format',
							type: 'select',
							options: ['mm/dd/yy', 'dd/mm/yy', 'yy-mm-dd'],
							defaultValue: 'mm/dd/yy',
						},
						{
							key: 'timeFormat',
							label: 'Time Format',
							type: 'select',
							options: ['12h', '24h'],
							defaultValue: '12h',
						},
					],
				},
			})

			this.registerInputType({
				id: 'time',
				name: 'Time',
				description: 'Time picker',
				category: 'date-time',
				icon: 'pi pi-clock',
				component: 'Calendar',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: true,
				defaultProps: {},
				validationRules: [{ type: 'required', message: 'Time is required' }],
				uiConfig: {
					showPlaceholder: false,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: true,
					customProps: [
						{
							key: 'timeFormat',
							label: 'Time Format',
							type: 'select',
							options: ['12h', '24h'],
							defaultValue: '12h',
						},
					],
				},
			})

			// Text Area Types
			this.registerInputType({
				id: 'textarea',
				name: 'Text Area',
				description: 'Multi-line text input',
				category: 'text-advanced',
				icon: 'pi pi-align-left',
				component: 'InputTextarea',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: true,
				defaultProps: { placeholder: 'Enter text...', textareaRows: 4 },
				validationRules: [
					{ type: 'required', message: 'Text is required' },
					{
						type: 'minLength',
						value: 1,
						message: 'Minimum length is 1 character',
					},
					{
						type: 'maxLength',
						value: 1000,
						message: 'Maximum length is 1000 characters',
					},
				],
				uiConfig: {
					showPlaceholder: true,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: true,
					customProps: [
						{
							key: 'textareaRows',
							label: 'Number of Rows',
							type: 'number',
							defaultValue: 4,
						},
						{
							key: 'textareaMaxLength',
							label: 'Maximum Length',
							type: 'number',
							defaultValue: 1000,
						},
					],
				},
			})

			// Selection Types
			this.registerInputType({
				id: 'select',
				name: 'Dropdown',
				description: 'Single selection dropdown',
				category: 'selection',
				icon: 'pi pi-list',
				component: 'Dropdown',
				requiresOptions: true,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: false,
				defaultProps: { placeholder: 'Select an option...' },
				validationRules: [
					{ type: 'required', message: 'Please select an option' },
				],
				uiConfig: {
					showPlaceholder: true,
					showOptions: true,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: false,
				},
			})

			this.registerInputType({
				id: 'multiselect',
				name: 'Multi-Select',
				description: 'Multiple selection dropdown',
				category: 'selection',
				icon: 'pi pi-list',
				component: 'Dropdown',
				requiresOptions: true,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: false,
				defaultProps: { placeholder: 'Select options...' },
				validationRules: [
					{ type: 'required', message: 'Please select at least one option' },
				],
				uiConfig: {
					showPlaceholder: true,
					showOptions: true,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: false,
				},
			})

			this.registerInputType({
				id: 'checkbox',
				name: 'Checkbox Group',
				description: 'Multiple selection checkboxes',
				category: 'selection',
				icon: 'pi pi-check-square',
				component: 'Checkbox',
				requiresOptions: true,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: false,
				defaultProps: {},
				validationRules: [
					{ type: 'required', message: 'Please select at least one option' },
				],
				uiConfig: {
					showPlaceholder: false,
					showOptions: true,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: false,
				},
			})

			this.registerInputType({
				id: 'radio',
				name: 'Radio Buttons',
				description: 'Single selection radio buttons',
				category: 'selection',
				icon: 'pi pi-circle-fill',
				component: 'RadioButton',
				requiresOptions: true,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: false,
				defaultProps: {},
				validationRules: [
					{ type: 'required', message: 'Please select an option' },
				],
				uiConfig: {
					showPlaceholder: false,
					showOptions: true,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: false,
				},
			})

			this.registerInputType({
				id: 'yesno',
				name: 'Yes/No',
				description: 'Yes or No question',
				category: 'selection',
				icon: 'pi pi-question-circle',
				component: 'RadioButton',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: false,
				defaultProps: { options: ['Yes', 'No'] },
				validationRules: [
					{ type: 'required', message: 'Please select Yes or No' },
				],
				uiConfig: {
					showPlaceholder: false,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: false,
				},
			})

			// Financial Types
			this.registerInputType({
				id: 'money',
				name: 'Money/Currency',
				description: 'Currency input with formatting',
				category: 'financial',
				icon: 'pi pi-dollar',
				component: 'InputMask',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: true,
				defaultProps: { placeholder: '$0.00', currency: 'USD' },
				validationRules: [
					{ type: 'required', message: 'Amount is required' },
					{ type: 'min', value: 0, message: 'Amount must be positive' },
				],
				uiConfig: {
					showPlaceholder: true,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: true,
					customProps: [
						{
							key: 'currency',
							label: 'Currency Symbol',
							type: 'text',
							defaultValue: 'USD',
						},
						{
							key: 'currencyCode',
							label: 'Currency Code',
							type: 'text',
							defaultValue: 'USD',
						},
					],
				},
			})

			this.registerInputType({
				id: 'percentage',
				name: 'Percentage',
				description: 'Percentage input with validation',
				category: 'financial',
				icon: 'pi pi-percentage',
				component: 'InputText',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: true,
				defaultProps: { placeholder: '0%' },
				validationRules: [
					{ type: 'required', message: 'Percentage is required' },
					{ type: 'min', value: 0, message: 'Percentage must be at least 0%' },
					{ type: 'max', value: 100, message: 'Percentage cannot exceed 100%' },
				],
				uiConfig: {
					showPlaceholder: true,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: true,
					customProps: [
						{
							key: 'percentageDecimals',
							label: 'Decimal Places',
							type: 'number',
							defaultValue: 2,
						},
					],
				},
			})

			// Contact Types
			this.registerInputType({
				id: 'phone',
				name: 'Phone Number',
				description: 'Phone number with formatting',
				category: 'contact',
				icon: 'pi pi-phone',
				component: 'InputMask',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: false,
				defaultProps: { placeholder: '(555) 123-4567' },
				validationRules: [
					{ type: 'required', message: 'Phone number is required' },
					{
						type: 'pattern',
						value: /^\(\d{3}\) \d{3}-\d{4}$/,
						message: 'Please enter a valid phone number',
					},
				],
				uiConfig: {
					showPlaceholder: true,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: false,
				},
			})

			this.registerInputType({
				id: 'address',
				name: 'Address',
				description: 'Address input field',
				category: 'contact',
				icon: 'pi pi-map-marker',
				component: 'InputText',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: true,
				defaultProps: { placeholder: 'Enter address...' },
				validationRules: [{ type: 'required', message: 'Address is required' }],
				uiConfig: {
					showPlaceholder: true,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: true,
					customProps: [
						{
							key: 'addressType',
							label: 'Address Type',
							type: 'select',
							options: ['full', 'street', 'city', 'state', 'zip'],
							defaultValue: 'full',
						},
					],
				},
			})

			// File & Media Types
			this.registerInputType({
				id: 'file',
				name: 'File Upload',
				description: 'File upload with restrictions',
				category: 'file-media',
				icon: 'pi pi-upload',
				component: 'FileUpload',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: true,
				hasCustomProps: true,
				defaultProps: { maxFileSize: 1000000 },
				validationRules: [{ type: 'required', message: 'File is required' }],
				uiConfig: {
					showPlaceholder: false,
					showOptions: false,
					showValidation: true,
					showFileSettings: true,
					showCustomProps: true,
					customProps: [
						{
							key: 'maxFileSize',
							label: 'Max File Size (bytes)',
							type: 'number',
							defaultValue: 1000000,
						},
						{
							key: 'allowedExtensions',
							label: 'Allowed Extensions',
							type: 'array',
							defaultValue: [
								'.pdf',
								'.doc',
								'.docx',
								'.jpg',
								'.jpeg',
								'.png',
								'.txt',
							],
						},
					],
				},
			})

			this.registerInputType({
				id: 'image',
				name: 'Image Upload',
				description: 'Image file upload with preview',
				category: 'file-media',
				icon: 'pi pi-image',
				component: 'FileUpload',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: true,
				hasCustomProps: true,
				defaultProps: {
					maxFileSize: 5000000,
					allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
				},
				validationRules: [{ type: 'required', message: 'Image is required' }],
				uiConfig: {
					showPlaceholder: false,
					showOptions: false,
					showValidation: true,
					showFileSettings: true,
					showCustomProps: true,
					customProps: [
						{
							key: 'maxFileSize',
							label: 'Max File Size (bytes)',
							type: 'number',
							defaultValue: 5000000,
						},
						{
							key: 'allowedExtensions',
							label: 'Allowed Extensions',
							type: 'array',
							defaultValue: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
						},
					],
				},
			})

			this.registerInputType({
				id: 'signature',
				name: 'Signature',
				description: 'Digital signature capture',
				category: 'file-media',
				icon: 'pi pi-pencil',
				component: 'InputText',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: false,
				defaultProps: { placeholder: 'Type your name to sign...' },
				validationRules: [
					{ type: 'required', message: 'Signature is required' },
				],
				uiConfig: {
					showPlaceholder: true,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: false,
				},
			})

			// Rating & Scale Types
			this.registerInputType({
				id: 'rating',
				name: 'Rating',
				description: 'Star rating input',
				category: 'rating-scale',
				icon: 'pi pi-star',
				component: 'InputText',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: true,
				defaultProps: { ratingMax: 5 },
				validationRules: [
					{ type: 'required', message: 'Rating is required' },
					{ type: 'min', value: 1, message: 'Please provide a rating' },
				],
				uiConfig: {
					showPlaceholder: false,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: true,
					customProps: [
						{
							key: 'ratingMax',
							label: 'Maximum Rating',
							type: 'number',
							defaultValue: 5,
						},
						{
							key: 'ratingIcons',
							label: 'Icon Type',
							type: 'select',
							options: ['star', 'heart', 'thumbs-up'],
							defaultValue: 'star',
						},
					],
				},
			})

			this.registerInputType({
				id: 'slider',
				name: 'Slider',
				description: 'Range slider input',
				category: 'rating-scale',
				icon: 'pi pi-sliders-h',
				component: 'InputText',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: true,
				defaultProps: { sliderMin: 0, sliderMax: 100, sliderStep: 1 },
				validationRules: [{ type: 'required', message: 'Value is required' }],
				uiConfig: {
					showPlaceholder: false,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: true,
					customProps: [
						{
							key: 'sliderMin',
							label: 'Minimum Value',
							type: 'number',
							defaultValue: 0,
						},
						{
							key: 'sliderMax',
							label: 'Maximum Value',
							type: 'number',
							defaultValue: 100,
						},
						{
							key: 'sliderStep',
							label: 'Step Value',
							type: 'number',
							defaultValue: 1,
						},
					],
				},
			})

			// Specialized Types
			this.registerInputType({
				id: 'color',
				name: 'Color Picker',
				description: 'Color selection input',
				category: 'specialized',
				icon: 'pi pi-palette',
				component: 'InputText',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: true,
				defaultProps: {},
				validationRules: [{ type: 'required', message: 'Color is required' }],
				uiConfig: {
					showPlaceholder: false,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: true,
					customProps: [
						{
							key: 'colorFormat',
							label: 'Color Format',
							type: 'select',
							options: ['hex', 'rgb', 'hsl'],
							defaultValue: 'hex',
						},
					],
				},
			})

			this.registerInputType({
				id: 'tags',
				name: 'Tags',
				description: 'Tag input with suggestions',
				category: 'specialized',
				icon: 'pi pi-tags',
				component: 'InputText',
				requiresOptions: false,
				hasValidation: true,
				hasFileUpload: false,
				hasCustomProps: true,
				defaultProps: {},
				validationRules: [
					{ type: 'required', message: 'At least one tag is required' },
				],
				uiConfig: {
					showPlaceholder: false,
					showOptions: false,
					showValidation: true,
					showFileSettings: false,
					showCustomProps: true,
					customProps: [
						{
							key: 'tagSuggestions',
							label: 'Tag Suggestions',
							type: 'array',
							defaultValue: [],
						},
						{
							key: 'maxTags',
							label: 'Maximum Tags',
							type: 'number',
							defaultValue: 10,
						},
					],
				},
			})

			this.initialized = true

			const result: MCPResult<boolean> = {
				success: true,
				data: true,
				metadata: {
					executionTime: tracker.end(),
					operation: 'initialize',
					timestamp: new Date(),
				},
			}

			MCPLogger.log(
				'initialize',
				{ inputTypesCount: this.inputTypes.size },
				result
			)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'FORM_ERROR',
				message: 'Failed to initialize input library',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<boolean> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'initialize',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('initialize', mcpError)
			return result
		}
	}

	/**
	 * Register a new input type
	 */
	static registerInputType(config: InputTypeConfig): MCPResult<boolean> {
		try {
			this.inputTypes.set(config.id, config)
			return { success: true, data: true }
		} catch (error) {
			return {
				success: false,
				errors: [
					{
						code: 'FORM_ERROR',
						message: `Failed to register input type: ${config.id}`,
						details: { actual: error },
						timestamp: new Date(),
					},
				],
			}
		}
	}

	/**
	 * Get all input types
	 */
	static getAllInputTypes(): MCPResult<InputTypeConfig[]> {
		const tracker = MCPLogger.createPerformanceTracker('getAllInputTypes')

		try {
			if (!this.initialized) {
				this.initialize()
			}

			const inputTypes = Array.from(this.inputTypes.values())
			const result: MCPResult<InputTypeConfig[]> = {
				success: true,
				data: inputTypes,
				metadata: {
					executionTime: tracker.end(),
					operation: 'getAllInputTypes',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('getAllInputTypes', { count: inputTypes.length }, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'FORM_ERROR',
				message: 'Failed to get all input types',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<InputTypeConfig[]> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'getAllInputTypes',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('getAllInputTypes', mcpError)
			return result
		}
	}

	/**
	 * Get input types by category
	 */
	static getInputTypesByCategory(
		category: InputCategory
	): MCPResult<InputTypeConfig[]> {
		const tracker = MCPLogger.createPerformanceTracker(
			'getInputTypesByCategory'
		)

		try {
			if (!this.initialized) {
				this.initialize()
			}

			const inputTypes = Array.from(this.inputTypes.values()).filter(
				type => type.category === category
			)

			const result: MCPResult<InputTypeConfig[]> = {
				success: true,
				data: inputTypes,
				metadata: {
					executionTime: tracker.end(),
					operation: 'getInputTypesByCategory',
					timestamp: new Date(),
				},
			}

			MCPLogger.log(
				'getInputTypesByCategory',
				{ category, count: inputTypes.length },
				result
			)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'FORM_ERROR',
				message: `Failed to get input types for category: ${category}`,
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<InputTypeConfig[]> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'getInputTypesByCategory',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('getInputTypesByCategory', mcpError)
			return result
		}
	}

	/**
	 * Get input type configuration
	 */
	static getInputTypeConfig(
		fieldType: FieldType
	): MCPResult<InputTypeConfig | null> {
		const tracker = MCPLogger.createPerformanceTracker('getInputTypeConfig')

		try {
			if (!this.initialized) {
				this.initialize()
			}

			const config = this.inputTypes.get(fieldType) || null
			const result: MCPResult<InputTypeConfig | null> = {
				success: true,
				data: config,
				metadata: {
					executionTime: tracker.end(),
					operation: 'getInputTypeConfig',
					timestamp: new Date(),
				},
			}

			MCPLogger.log(
				'getInputTypeConfig',
				{ fieldType, found: !!config },
				result
			)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'FORM_ERROR',
				message: `Failed to get input type config: ${fieldType}`,
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<InputTypeConfig | null> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'getInputTypeConfig',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('getInputTypeConfig', mcpError)
			return result
		}
	}

	/**
	 * Get all categories
	 */
	static getCategories(): MCPResult<InputCategory[]> {
		const tracker = MCPLogger.createPerformanceTracker('getCategories')

		try {
			if (!this.initialized) {
				this.initialize()
			}

			const categories = Array.from(
				new Set(Array.from(this.inputTypes.values()).map(type => type.category))
			)

			const result: MCPResult<InputCategory[]> = {
				success: true,
				data: categories,
				metadata: {
					executionTime: tracker.end(),
					operation: 'getCategories',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('getCategories', { categories }, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'FORM_ERROR',
				message: 'Failed to get categories',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<InputCategory[]> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'getCategories',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('getCategories', mcpError)
			return result
		}
	}

	/**
	 * Create a field with default configuration
	 */
	static createFieldWithDefaults(
		fieldType: FieldType,
		label: string
	): MCPResult<FormField> {
		const tracker = MCPLogger.createPerformanceTracker(
			'createFieldWithDefaults'
		)

		try {
			if (!this.initialized) {
				this.initialize()
			}

			const configResult = this.getInputTypeConfig(fieldType)
			if (!configResult.success || !configResult.data) {
				return {
					success: false,
					errors: [
						{
							code: 'FIELD_ERROR',
							message: `Unknown field type: ${fieldType}`,
							timestamp: new Date(),
						},
					],
				}
			}

			const config = configResult.data
			const field: FormField = {
				id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				label,
				type: fieldType,
				required: false,
				...config.defaultProps,
			}

			const result: MCPResult<FormField> = {
				success: true,
				data: field,
				metadata: {
					executionTime: tracker.end(),
					operation: 'createFieldWithDefaults',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('createFieldWithDefaults', { fieldType, label }, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'FIELD_ERROR',
				message: `Failed to create field with defaults: ${fieldType}`,
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<FormField> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'createFieldWithDefaults',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('createFieldWithDefaults', mcpError)
			return result
		}
	}

	/**
	 * Get validation rules for a field type
	 */
	static getValidationRules(fieldType: FieldType): MCPResult<ValidationRule[]> {
		const tracker = MCPLogger.createPerformanceTracker('getValidationRules')

		try {
			if (!this.initialized) {
				this.initialize()
			}

			const configResult = this.getInputTypeConfig(fieldType)
			if (!configResult.success || !configResult.data) {
				return {
					success: false,
					errors: [
						{
							code: 'FIELD_ERROR',
							message: `Unknown field type: ${fieldType}`,
							timestamp: new Date(),
						},
					],
				}
			}

			const rules = configResult.data.validationRules
			const result: MCPResult<ValidationRule[]> = {
				success: true,
				data: rules,
				metadata: {
					executionTime: tracker.end(),
					operation: 'getValidationRules',
					timestamp: new Date(),
				},
			}

			MCPLogger.log(
				'getValidationRules',
				{ fieldType, rulesCount: rules.length },
				result
			)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'FIELD_ERROR',
				message: `Failed to get validation rules: ${fieldType}`,
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<ValidationRule[]> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'getValidationRules',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('getValidationRules', mcpError)
			return result
		}
	}
}
