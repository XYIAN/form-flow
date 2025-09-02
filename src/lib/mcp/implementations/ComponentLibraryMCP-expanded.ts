import { IComponentLibraryProtocol } from '../protocols/IComponentLibraryProtocol'
import { MCPResult } from '../protocols/types'
import { MCPLogger } from './logger'
import { CSVParserMCP, CSVData } from './CSVParserMCP'
import { FieldTypeDetectorMCP } from './FieldTypeDetectorMCP'
import {
	ComponentLibrary,
	FormComponent,
	ComponentCategory,
	ComponentProps,
	CSVComponentMapping,
	FieldType,
} from '@/types'

export class ComponentLibraryMCP implements IComponentLibraryProtocol {
	private static libraries: ComponentLibrary[] = []
	private static components: FormComponent[] = []

	/**
	 * Initialize the component library with default components
	 */
	static initialize(): MCPResult<boolean> {
		const startTime = performance.now()

		try {
			MCPLogger.info(
				'ComponentLibraryMCP.initialize',
				'Initializing component library system'
			)

			// Create default component library
			const defaultLibrary: ComponentLibrary = {
				id: 'default-library',
				name: 'Default Component Library',
				description: 'Built-in form components for common use cases',
				version: '1.0.0',
				category: 'basic',
				components: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			// Create default components
			const defaultComponents = this.createDefaultComponents()
			defaultLibrary.components = defaultComponents
			this.components = defaultComponents

			this.libraries = [defaultLibrary]

			const executionTime = performance.now() - startTime
			MCPLogger.info(
				'ComponentLibraryMCP.initialize',
				'Component library initialized successfully',
				{
					librariesCount: this.libraries.length,
					componentsCount: this.components.length,
				},
				executionTime
			)

			return {
				success: true,
				data: true,
				metadata: { executionTime },
			}
		} catch (error) {
			const executionTime = performance.now() - startTime
			MCPLogger.error('ComponentLibraryMCP.initialize', error as Error, {
				executionTime,
			})

			return {
				success: false,
				errors: [
					{
						code: 'INITIALIZATION_ERROR',
						message: 'Failed to initialize component library system',
						details: { error: (error as Error).message },
						timestamp: new Date(),
					},
				],
				metadata: { executionTime },
			}
		}
	}

	/**
	 * Create default components for the library
	 */
	private static createDefaultComponents(): FormComponent[] {
		return [
			// Basic Components
			{
				id: 'text-input',
				name: 'Text Input',
				description: 'Single-line text input field',
				category: 'basic',
				type: 'text',
				icon: 'pi pi-pencil',
				preview: 'Text Input Field',
				props: {
					required: false,
					placeholder: 'Enter text...',
					validation: {
						rules: [{ type: 'required', message: 'This field is required' }],
						messages: {
							required: 'This field is required',
							invalid: 'Please enter valid text',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'This field is required' }],
					messages: {
						required: 'This field is required',
						invalid: 'Please enter valid text',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['input', 'text', 'basic'],
					documentation:
						'Basic text input component for single-line text entry',
				},
			},
			{
				id: 'textarea',
				name: 'Textarea',
				description: 'Multi-line text input field',
				category: 'basic',
				type: 'textarea',
				icon: 'pi pi-align-left',
				preview: 'Textarea Field',
				props: {
					required: false,
					placeholder: 'Enter your message...',
					rows: 4,
					validation: {
						rules: [{ type: 'required', message: 'This field is required' }],
						messages: {
							required: 'This field is required',
							invalid: 'Please enter valid text',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'This field is required' }],
					messages: {
						required: 'This field is required',
						invalid: 'Please enter valid text',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['textarea', 'text', 'basic'],
					documentation: 'Multi-line text input for longer content',
				},
			},
			{
				id: 'number-input',
				name: 'Number Input',
				description: 'Numeric input field with validation',
				category: 'basic',
				type: 'number',
				icon: 'pi pi-hashtag',
				preview: 'Number Input Field',
				props: {
					required: false,
					placeholder: 'Enter number...',
					min: 0,
					max: 1000,
					step: 1,
					validation: {
						rules: [
							{ type: 'number', message: 'Please enter a valid number' },
							{ type: 'min', value: 0, message: 'Value must be at least 0' },
						],
						messages: {
							required: 'This field is required',
							invalid: 'Please enter a valid number',
						},
					},
				},
				validation: {
					rules: [
						{ type: 'number', message: 'Please enter a valid number' },
						{ type: 'min', value: 0, message: 'Value must be at least 0' },
					],
					messages: {
						required: 'This field is required',
						invalid: 'Please enter a valid number',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['number', 'numeric', 'basic'],
					documentation: 'Numeric input with min/max validation',
				},
			},
			{
				id: 'password-input',
				name: 'Password Input',
				description: 'Secure password input field',
				category: 'basic',
				type: 'password',
				icon: 'pi pi-lock',
				preview: 'Password Input Field',
				props: {
					required: false,
					placeholder: 'Enter password...',
					showPassword: false,
					validation: {
						rules: [
							{ type: 'required', message: 'Password is required' },
							{
								type: 'minLength',
								value: 8,
								message: 'Password must be at least 8 characters',
							},
						],
						messages: {
							required: 'Password is required',
							invalid: 'Password must be at least 8 characters',
						},
					},
				},
				validation: {
					rules: [
						{ type: 'required', message: 'Password is required' },
						{
							type: 'minLength',
							value: 8,
							message: 'Password must be at least 8 characters',
						},
					],
					messages: {
						required: 'Password is required',
						invalid: 'Password must be at least 8 characters',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['password', 'security', 'basic'],
					documentation: 'Secure password input with strength validation',
				},
			},

			// Contact Components
			{
				id: 'email-input',
				name: 'Email Input',
				description: 'Email address input with validation',
				category: 'contact',
				type: 'email',
				icon: 'pi pi-envelope',
				preview: 'Email Input Field',
				props: {
					required: false,
					placeholder: 'Enter email address...',
					validation: {
						rules: [
							{ type: 'email', message: 'Please enter a valid email address' },
						],
						messages: {
							required: 'Email is required',
							invalid: 'Please enter a valid email address',
						},
					},
				},
				validation: {
					rules: [
						{ type: 'email', message: 'Please enter a valid email address' },
					],
					messages: {
						required: 'Email is required',
						invalid: 'Please enter a valid email address',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['email', 'contact', 'validation'],
					documentation: 'Email input with built-in email validation',
				},
			},
			{
				id: 'phone-input',
				name: 'Phone Input',
				description: 'Phone number input with formatting',
				category: 'contact',
				type: 'phone',
				icon: 'pi pi-phone',
				preview: 'Phone Input Field',
				props: {
					required: false,
					placeholder: '(555) 123-4567',
					format: 'US',
					validation: {
						rules: [
							{
								type: 'pattern',
								value: '^[\\d\\s\\-\\(\\)\\+]+$',
								message: 'Please enter a valid phone number',
							},
						],
						messages: {
							required: 'Phone number is required',
							invalid: 'Please enter a valid phone number',
						},
					},
				},
				validation: {
					rules: [
						{
							type: 'pattern',
							value: '^[\\d\\s\\-\\(\\)\\+]+$',
							message: 'Please enter a valid phone number',
						},
					],
					messages: {
						required: 'Phone number is required',
						invalid: 'Please enter a valid phone number',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['phone', 'contact', 'formatting'],
					documentation: 'Phone input with automatic formatting',
				},
			},
			{
				id: 'address-input',
				name: 'Address Input',
				description: 'Complete address input with multiple fields',
				category: 'contact',
				type: 'address',
				icon: 'pi pi-map-marker',
				preview: 'Address Input Field',
				props: {
					required: false,
					placeholder: 'Enter address...',
					includeCountry: true,
					validation: {
						rules: [{ type: 'required', message: 'Address is required' }],
						messages: {
							required: 'Address is required',
							invalid: 'Please enter a valid address',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'Address is required' }],
					messages: {
						required: 'Address is required',
						invalid: 'Please enter a valid address',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['address', 'contact', 'location'],
					documentation: 'Complete address input with street, city, state, zip',
				},
			},
			{
				id: 'url-input',
				name: 'URL Input',
				description: 'Website URL input with validation',
				category: 'contact',
				type: 'url',
				icon: 'pi pi-link',
				preview: 'URL Input Field',
				props: {
					required: false,
					placeholder: 'https://example.com',
					validation: {
						rules: [{ type: 'url', message: 'Please enter a valid URL' }],
						messages: {
							required: 'URL is required',
							invalid: 'Please enter a valid URL',
						},
					},
				},
				validation: {
					rules: [{ type: 'url', message: 'Please enter a valid URL' }],
					messages: {
						required: 'URL is required',
						invalid: 'Please enter a valid URL',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['url', 'website', 'contact'],
					documentation: 'URL input with protocol validation',
				},
			},

			// Date/Time Components
			{
				id: 'date-picker',
				name: 'Date Picker',
				description: 'Date selection with calendar widget',
				category: 'datetime',
				type: 'date',
				icon: 'pi pi-calendar',
				preview: 'Date Picker Field',
				props: {
					required: false,
					placeholder: 'Select date...',
					minDate: null,
					maxDate: null,
					showTime: false,
					validation: {
						rules: [{ type: 'required', message: 'Date is required' }],
						messages: {
							required: 'Date is required',
							invalid: 'Please select a valid date',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'Date is required' }],
					messages: {
						required: 'Date is required',
						invalid: 'Please select a valid date',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['date', 'calendar', 'datetime'],
					documentation: 'Date picker with calendar interface',
				},
			},
			{
				id: 'time-picker',
				name: 'Time Picker',
				description: 'Time selection with clock widget',
				category: 'datetime',
				type: 'time',
				icon: 'pi pi-clock',
				preview: 'Time Picker Field',
				props: {
					required: false,
					placeholder: 'Select time...',
					format: '12h',
					validation: {
						rules: [{ type: 'required', message: 'Time is required' }],
						messages: {
							required: 'Time is required',
							invalid: 'Please select a valid time',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'Time is required' }],
					messages: {
						required: 'Time is required',
						invalid: 'Please select a valid time',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['time', 'clock', 'datetime'],
					documentation: 'Time picker with 12/24 hour format',
				},
			},
			{
				id: 'datetime-picker',
				name: 'Date & Time Picker',
				description: 'Combined date and time selection',
				category: 'datetime',
				type: 'datetime',
				icon: 'pi pi-calendar-plus',
				preview: 'Date & Time Picker Field',
				props: {
					required: false,
					placeholder: 'Select date and time...',
					format: 'MM/dd/yyyy HH:mm',
					validation: {
						rules: [
							{ type: 'required', message: 'Date and time are required' },
						],
						messages: {
							required: 'Date and time are required',
							invalid: 'Please select valid date and time',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'Date and time are required' }],
					messages: {
						required: 'Date and time are required',
						invalid: 'Please select valid date and time',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['datetime', 'calendar', 'time'],
					documentation: 'Combined date and time picker',
				},
			},

			// Choice Components
			{
				id: 'select-dropdown',
				name: 'Select Dropdown',
				description: 'Single selection dropdown menu',
				category: 'choice',
				type: 'select',
				icon: 'pi pi-chevron-down',
				preview: 'Select Dropdown Field',
				props: {
					required: false,
					placeholder: 'Select an option...',
					options: [
						{ label: 'Option 1', value: 'option1' },
						{ label: 'Option 2', value: 'option2' },
						{ label: 'Option 3', value: 'option3' },
					],
					searchable: true,
					validation: {
						rules: [{ type: 'required', message: 'Please select an option' }],
						messages: {
							required: 'Please select an option',
							invalid: 'Please select a valid option',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'Please select an option' }],
					messages: {
						required: 'Please select an option',
						invalid: 'Please select a valid option',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['select', 'dropdown', 'choice'],
					documentation: 'Single selection dropdown with search',
				},
			},
			{
				id: 'multiselect-dropdown',
				name: 'Multi-Select Dropdown',
				description: 'Multiple selection dropdown menu',
				category: 'choice',
				type: 'multiselect',
				icon: 'pi pi-th-large',
				preview: 'Multi-Select Dropdown Field',
				props: {
					required: false,
					placeholder: 'Select multiple options...',
					options: [
						{ label: 'Option 1', value: 'option1' },
						{ label: 'Option 2', value: 'option2' },
						{ label: 'Option 3', value: 'option3' },
					],
					searchable: true,
					maxSelections: 5,
					validation: {
						rules: [
							{
								type: 'required',
								message: 'Please select at least one option',
							},
						],
						messages: {
							required: 'Please select at least one option',
							invalid: 'Please select valid options',
						},
					},
				},
				validation: {
					rules: [
						{ type: 'required', message: 'Please select at least one option' },
					],
					messages: {
						required: 'Please select at least one option',
						invalid: 'Please select valid options',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['multiselect', 'multiple', 'choice'],
					documentation: 'Multiple selection dropdown with search',
				},
			},
			{
				id: 'radio-group',
				name: 'Radio Group',
				description: 'Single selection radio button group',
				category: 'choice',
				type: 'radio',
				icon: 'pi pi-circle',
				preview: 'Radio Group Field',
				props: {
					required: false,
					options: [
						{ label: 'Option 1', value: 'option1' },
						{ label: 'Option 2', value: 'option2' },
						{ label: 'Option 3', value: 'option3' },
					],
					orientation: 'vertical',
					validation: {
						rules: [{ type: 'required', message: 'Please select an option' }],
						messages: {
							required: 'Please select an option',
							invalid: 'Please select a valid option',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'Please select an option' }],
					messages: {
						required: 'Please select an option',
						invalid: 'Please select a valid option',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['radio', 'single', 'choice'],
					documentation: 'Radio button group for single selection',
				},
			},
			{
				id: 'checkbox-group',
				name: 'Checkbox Group',
				description: 'Multiple selection checkbox group',
				category: 'choice',
				type: 'checkbox',
				icon: 'pi pi-check-square',
				preview: 'Checkbox Group Field',
				props: {
					required: false,
					options: [
						{ label: 'Option 1', value: 'option1' },
						{ label: 'Option 2', value: 'option2' },
						{ label: 'Option 3', value: 'option3' },
					],
					orientation: 'vertical',
					validation: {
						rules: [
							{
								type: 'required',
								message: 'Please select at least one option',
							},
						],
						messages: {
							required: 'Please select at least one option',
							invalid: 'Please select valid options',
						},
					},
				},
				validation: {
					rules: [
						{ type: 'required', message: 'Please select at least one option' },
					],
					messages: {
						required: 'Please select at least one option',
						invalid: 'Please select valid options',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['checkbox', 'multiple', 'choice'],
					documentation: 'Checkbox group for multiple selections',
				},
			},
			{
				id: 'tags-input',
				name: 'Tags Input',
				description: 'Tag-based input with autocomplete',
				category: 'choice',
				type: 'tags',
				icon: 'pi pi-tags',
				preview: 'Tags Input Field',
				props: {
					required: false,
					placeholder: 'Add tags...',
					suggestions: ['tag1', 'tag2', 'tag3'],
					maxTags: 10,
					allowCustom: true,
					validation: {
						rules: [
							{ type: 'required', message: 'Please add at least one tag' },
						],
						messages: {
							required: 'Please add at least one tag',
							invalid: 'Please add valid tags',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'Please add at least one tag' }],
					messages: {
						required: 'Please add at least one tag',
						invalid: 'Please add valid tags',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['tags', 'autocomplete', 'choice'],
					documentation: 'Tag input with suggestions and custom tags',
				},
			},

			// Financial Components
			{
				id: 'money-input',
				name: 'Money Input',
				description: 'Currency input with formatting',
				category: 'financial',
				type: 'money',
				icon: 'pi pi-dollar',
				preview: 'Money Input Field',
				props: {
					required: false,
					placeholder: '$0.00',
					currency: 'USD',
					min: 0,
					max: 1000000,
					validation: {
						rules: [
							{ type: 'number', message: 'Please enter a valid amount' },
							{ type: 'min', value: 0, message: 'Amount must be positive' },
						],
						messages: {
							required: 'Amount is required',
							invalid: 'Please enter a valid amount',
						},
					},
				},
				validation: {
					rules: [
						{ type: 'number', message: 'Please enter a valid amount' },
						{ type: 'min', value: 0, message: 'Amount must be positive' },
					],
					messages: {
						required: 'Amount is required',
						invalid: 'Please enter a valid amount',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['money', 'currency', 'financial'],
					documentation: 'Currency input with automatic formatting',
				},
			},
			{
				id: 'percentage-input',
				name: 'Percentage Input',
				description: 'Percentage input with validation',
				category: 'financial',
				type: 'percentage',
				icon: 'pi pi-percentage',
				preview: 'Percentage Input Field',
				props: {
					required: false,
					placeholder: '0%',
					min: 0,
					max: 100,
					step: 0.1,
					validation: {
						rules: [
							{ type: 'number', message: 'Please enter a valid percentage' },
							{
								type: 'min',
								value: 0,
								message: 'Percentage must be at least 0%',
							},
							{
								type: 'max',
								value: 100,
								message: 'Percentage must be at most 100%',
							},
						],
						messages: {
							required: 'Percentage is required',
							invalid: 'Please enter a valid percentage',
						},
					},
				},
				validation: {
					rules: [
						{ type: 'number', message: 'Please enter a valid percentage' },
						{
							type: 'min',
							value: 0,
							message: 'Percentage must be at least 0%',
						},
						{
							type: 'max',
							value: 100,
							message: 'Percentage must be at most 100%',
						},
					],
					messages: {
						required: 'Percentage is required',
						invalid: 'Please enter a valid percentage',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['percentage', 'numeric', 'financial'],
					documentation: 'Percentage input with 0-100% validation',
				},
			},

			// File/Media Components
			{
				id: 'file-upload',
				name: 'File Upload',
				description: 'File upload with drag and drop',
				category: 'media',
				type: 'file',
				icon: 'pi pi-file',
				preview: 'File Upload Field',
				props: {
					required: false,
					placeholder: 'Choose file or drag and drop...',
					accept: '*/*',
					maxSize: '10MB',
					multiple: false,
					validation: {
						rules: [{ type: 'required', message: 'Please select a file' }],
						messages: {
							required: 'Please select a file',
							invalid: 'Please select a valid file',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'Please select a file' }],
					messages: {
						required: 'Please select a file',
						invalid: 'Please select a valid file',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['file', 'upload', 'media'],
					documentation: 'File upload with drag and drop support',
				},
			},
			{
				id: 'image-upload',
				name: 'Image Upload',
				description: 'Image upload with preview',
				category: 'media',
				type: 'image',
				icon: 'pi pi-image',
				preview: 'Image Upload Field',
				props: {
					required: false,
					placeholder: 'Choose image or drag and drop...',
					accept: 'image/*',
					maxSize: '5MB',
					multiple: false,
					showPreview: true,
					validation: {
						rules: [{ type: 'required', message: 'Please select an image' }],
						messages: {
							required: 'Please select an image',
							invalid: 'Please select a valid image',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'Please select an image' }],
					messages: {
						required: 'Please select an image',
						invalid: 'Please select a valid image',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['image', 'upload', 'media'],
					documentation: 'Image upload with preview and validation',
				},
			},

			// Rating/Scale Components
			{
				id: 'rating-input',
				name: 'Rating Input',
				description: 'Star rating input',
				category: 'rating',
				type: 'rating',
				icon: 'pi pi-star',
				preview: 'Rating Input Field',
				props: {
					required: false,
					max: 5,
					allowHalf: false,
					showLabels: true,
					labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
					validation: {
						rules: [{ type: 'required', message: 'Please provide a rating' }],
						messages: {
							required: 'Please provide a rating',
							invalid: 'Please provide a valid rating',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'Please provide a rating' }],
					messages: {
						required: 'Please provide a rating',
						invalid: 'Please provide a valid rating',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['rating', 'stars', 'scale'],
					documentation: 'Star rating input with customizable labels',
				},
			},
			{
				id: 'slider-input',
				name: 'Slider Input',
				description: 'Range slider input',
				category: 'rating',
				type: 'slider',
				icon: 'pi pi-sliders-h',
				preview: 'Slider Input Field',
				props: {
					required: false,
					min: 0,
					max: 100,
					step: 1,
					showValue: true,
					showRange: true,
					validation: {
						rules: [{ type: 'required', message: 'Please select a value' }],
						messages: {
							required: 'Please select a value',
							invalid: 'Please select a valid value',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'Please select a value' }],
					messages: {
						required: 'Please select a value',
						invalid: 'Please select a valid value',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['slider', 'range', 'scale'],
					documentation: 'Range slider with value display',
				},
			},

			// Specialized Components
			{
				id: 'color-picker',
				name: 'Color Picker',
				description: 'Color selection with palette',
				category: 'specialized',
				type: 'color',
				icon: 'pi pi-palette',
				preview: 'Color Picker Field',
				props: {
					required: false,
					placeholder: 'Select color...',
					format: 'hex',
					showPresets: true,
					validation: {
						rules: [{ type: 'required', message: 'Please select a color' }],
						messages: {
							required: 'Please select a color',
							invalid: 'Please select a valid color',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'Please select a color' }],
					messages: {
						required: 'Please select a color',
						invalid: 'Please select a valid color',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['color', 'picker', 'specialized'],
					documentation: 'Color picker with hex/rgb format support',
				},
			},
			{
				id: 'switch-input',
				name: 'Switch Input',
				description: 'Toggle switch input',
				category: 'specialized',
				type: 'switch',
				icon: 'pi pi-toggle-on',
				preview: 'Switch Input Field',
				props: {
					required: false,
					defaultValue: false,
					showLabel: true,
					validation: {
						rules: [{ type: 'required', message: 'Please make a selection' }],
						messages: {
							required: 'Please make a selection',
							invalid: 'Please make a valid selection',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'Please make a selection' }],
					messages: {
						required: 'Please make a selection',
						invalid: 'Please make a valid selection',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['switch', 'toggle', 'specialized'],
					documentation: 'Toggle switch for boolean values',
				},
			},
			{
				id: 'search-input',
				name: 'Search Input',
				description: 'Search input with suggestions',
				category: 'specialized',
				type: 'search',
				icon: 'pi pi-search',
				preview: 'Search Input Field',
				props: {
					required: false,
					placeholder: 'Search...',
					suggestions: ['suggestion1', 'suggestion2', 'suggestion3'],
					debounce: 300,
					validation: {
						rules: [{ type: 'required', message: 'Please enter search terms' }],
						messages: {
							required: 'Please enter search terms',
							invalid: 'Please enter valid search terms',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'Please enter search terms' }],
					messages: {
						required: 'Please enter search terms',
						invalid: 'Please enter valid search terms',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['search', 'suggestions', 'specialized'],
					documentation: 'Search input with autocomplete suggestions',
				},
			},
			{
				id: 'chips-input',
				name: 'Chips Input',
				description: 'Chip-based input for multiple values',
				category: 'specialized',
				type: 'chips',
				icon: 'pi pi-plus-circle',
				preview: 'Chips Input Field',
				props: {
					required: false,
					placeholder: 'Add chips...',
					suggestions: ['chip1', 'chip2', 'chip3'],
					maxChips: 10,
					allowCustom: true,
					validation: {
						rules: [
							{ type: 'required', message: 'Please add at least one chip' },
						],
						messages: {
							required: 'Please add at least one chip',
							invalid: 'Please add valid chips',
						},
					},
				},
				validation: {
					rules: [
						{ type: 'required', message: 'Please add at least one chip' },
					],
					messages: {
						required: 'Please add at least one chip',
						invalid: 'Please add valid chips',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['chips', 'multiple', 'specialized'],
					documentation: 'Chip input for multiple values with suggestions',
				},
			},
			{
				id: 'knob-input',
				name: 'Knob Input',
				description: 'Circular knob input for numeric values',
				category: 'specialized',
				type: 'knob',
				icon: 'pi pi-circle',
				preview: 'Knob Input Field',
				props: {
					required: false,
					min: 0,
					max: 100,
					step: 1,
					showValue: true,
					validation: {
						rules: [{ type: 'required', message: 'Please select a value' }],
						messages: {
							required: 'Please select a value',
							invalid: 'Please select a valid value',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'Please select a value' }],
					messages: {
						required: 'Please select a value',
						invalid: 'Please select a valid value',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['knob', 'circular', 'specialized'],
					documentation: 'Circular knob input for precise numeric selection',
				},
			},
			{
				id: 'listbox-input',
				name: 'Listbox Input',
				description: 'Listbox for single selection',
				category: 'specialized',
				type: 'listbox',
				icon: 'pi pi-bars',
				preview: 'Listbox Input Field',
				props: {
					required: false,
					placeholder: 'Select an option...',
					options: [
						{ label: 'Option 1', value: 'option1' },
						{ label: 'Option 2', value: 'option2' },
						{ label: 'Option 3', value: 'option3' },
					],
					multiple: false,
					validation: {
						rules: [{ type: 'required', message: 'Please select an option' }],
						messages: {
							required: 'Please select an option',
							invalid: 'Please select a valid option',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'Please select an option' }],
					messages: {
						required: 'Please select an option',
						invalid: 'Please select a valid option',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['listbox', 'list', 'specialized'],
					documentation: 'Listbox for single or multiple selection',
				},
			},
			{
				id: 'mask-input',
				name: 'Mask Input',
				description: 'Input with formatting mask',
				category: 'specialized',
				type: 'mask',
				icon: 'pi pi-shield',
				preview: 'Mask Input Field',
				props: {
					required: false,
					placeholder: 'Enter formatted text...',
					mask: '999-999-9999',
					unmask: false,
					validation: {
						rules: [
							{ type: 'required', message: 'Please enter formatted text' },
						],
						messages: {
							required: 'Please enter formatted text',
							invalid: 'Please enter valid formatted text',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'Please enter formatted text' }],
					messages: {
						required: 'Please enter formatted text',
						invalid: 'Please enter valid formatted text',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['mask', 'format', 'specialized'],
					documentation: 'Input with custom formatting mask',
				},
			},
			{
				id: 'editor-input',
				name: 'Rich Text Editor',
				description: 'Rich text editor with formatting',
				category: 'specialized',
				type: 'editor',
				icon: 'pi pi-pencil',
				preview: 'Rich Text Editor Field',
				props: {
					required: false,
					placeholder: 'Enter rich text...',
					toolbar: 'full',
					height: '200px',
					validation: {
						rules: [{ type: 'required', message: 'Please enter text' }],
						messages: {
							required: 'Please enter text',
							invalid: 'Please enter valid text',
						},
					},
				},
				validation: {
					rules: [{ type: 'required', message: 'Please enter text' }],
					messages: {
						required: 'Please enter text',
						invalid: 'Please enter valid text',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['editor', 'rich-text', 'specialized'],
					documentation: 'Rich text editor with formatting toolbar',
				},
			},
		]
	}

	// ... rest of the methods remain the same
}
