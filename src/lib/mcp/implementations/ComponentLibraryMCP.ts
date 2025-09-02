import { IComponentLibraryProtocol } from '../protocols/IComponentLibraryProtocol'
import { MCPResult, MCPError } from '../protocols/types'
import { MCPLogger } from './logger'
import {
	ComponentLibrary,
	FormComponent,
	ComponentCategory,
	ComponentProps,
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
				error: {
					code: 'INITIALIZATION_ERROR',
					message: 'Failed to initialize component library system',
					details: { error: (error as Error).message },
					timestamp: new Date(),
				},
			}
		}
	}

	/**
	 * Get all available component libraries
	 */
	static getLibraries(): MCPResult<ComponentLibrary[]> {
		const startTime = performance.now()

		try {
			MCPLogger.debug(
				'ComponentLibraryMCP.getLibraries',
				'Retrieving all component libraries'
			)

			const executionTime = performance.now() - startTime
			MCPLogger.debug(
				'ComponentLibraryMCP.getLibraries',
				'Libraries retrieved successfully',
				{
					count: this.libraries.length,
				},
				executionTime
			)

			return {
				success: true,
				data: [...this.libraries],
				metadata: { executionTime },
			}
		} catch (error) {
			const executionTime = performance.now() - startTime
			MCPLogger.error('ComponentLibraryMCP.getLibraries', error as Error, {
				executionTime,
			})

			return {
				success: false,
				error: {
					code: 'LIBRARY_RETRIEVAL_ERROR',
					message: 'Failed to retrieve component libraries',
					details: { error: (error as Error).message },
					timestamp: new Date(),
				},
			}
		}
	}

	/**
	 * Get a specific component library by ID
	 */
	static getLibrary(libraryId: string): MCPResult<ComponentLibrary> {
		const startTime = performance.now()

		try {
			MCPLogger.debug(
				'ComponentLibraryMCP.getLibrary',
				'Retrieving component library',
				{ libraryId }
			)

			const library = this.libraries.find(lib => lib.id === libraryId)
			if (!library) {
				const executionTime = performance.now() - startTime
				MCPLogger.warn(
					'ComponentLibraryMCP.getLibrary',
					'Library not found',
					{ libraryId },
					executionTime
				)

				return {
					success: false,
					error: {
						code: 'LIBRARY_NOT_FOUND',
						message: `Component library with ID '${libraryId}' not found`,
						details: { libraryId },
						timestamp: new Date(),
					},
				}
			}

			const executionTime = performance.now() - startTime
			MCPLogger.debug(
				'ComponentLibraryMCP.getLibrary',
				'Library retrieved successfully',
				{
					libraryId,
					componentsCount: library.components.length,
				},
				executionTime
			)

			return {
				success: true,
				data: { ...library },
				metadata: { executionTime },
			}
		} catch (error) {
			const executionTime = performance.now() - startTime
			MCPLogger.error('ComponentLibraryMCP.getLibrary', error as Error, {
				libraryId,
				executionTime,
			})

			return {
				success: false,
				error: {
					code: 'LIBRARY_RETRIEVAL_ERROR',
					message: 'Failed to retrieve component library',
					details: { libraryId, error: (error as Error).message },
					timestamp: new Date(),
				},
			}
		}
	}

	/**
	 * Get components by category
	 */
	static getComponentsByCategory(
		category: ComponentCategory
	): MCPResult<FormComponent[]> {
		const startTime = performance.now()

		try {
			MCPLogger.debug(
				'ComponentLibraryMCP.getComponentsByCategory',
				'Retrieving components by category',
				{ category }
			)

			const components = this.components.filter(
				comp => comp.category === category
			)

			const executionTime = performance.now() - startTime
			MCPLogger.debug(
				'ComponentLibraryMCP.getComponentsByCategory',
				'Components retrieved successfully',
				{
					category,
					count: components.length,
				},
				executionTime
			)

			return {
				success: true,
				data: [...components],
				metadata: { executionTime },
			}
		} catch (error) {
			const executionTime = performance.now() - startTime
			MCPLogger.error(
				'ComponentLibraryMCP.getComponentsByCategory',
				error as Error,
				{ category, executionTime }
			)

			return {
				success: false,
				error: {
					code: 'COMPONENT_RETRIEVAL_ERROR',
					message: 'Failed to retrieve components by category',
					details: { category, error: (error as Error).message },
					timestamp: new Date(),
				},
			}
		}
	}

	/**
	 * Get a specific component by ID
	 */
	static getComponent(componentId: string): MCPResult<FormComponent> {
		const startTime = performance.now()

		try {
			MCPLogger.debug(
				'ComponentLibraryMCP.getComponent',
				'Retrieving component',
				{ componentId }
			)

			const component = this.components.find(comp => comp.id === componentId)
			if (!component) {
				const executionTime = performance.now() - startTime
				MCPLogger.warn(
					'ComponentLibraryMCP.getComponent',
					'Component not found',
					{ componentId },
					executionTime
				)

				return {
					success: false,
					error: {
						code: 'COMPONENT_NOT_FOUND',
						message: `Component with ID '${componentId}' not found`,
						details: { componentId },
						timestamp: new Date(),
					},
				}
			}

			const executionTime = performance.now() - startTime
			MCPLogger.debug(
				'ComponentLibraryMCP.getComponent',
				'Component retrieved successfully',
				{ componentId },
				executionTime
			)

			return {
				success: true,
				data: { ...component },
				metadata: { executionTime },
			}
		} catch (error) {
			const executionTime = performance.now() - startTime
			MCPLogger.error('ComponentLibraryMCP.getComponent', error as Error, {
				componentId,
				executionTime,
			})

			return {
				success: false,
				error: {
					code: 'COMPONENT_RETRIEVAL_ERROR',
					message: 'Failed to retrieve component',
					details: { componentId, error: (error as Error).message },
					timestamp: new Date(),
				},
			}
		}
	}

	/**
	 * Search components by name, description, or tags
	 */
	static searchComponents(query: string): MCPResult<FormComponent[]> {
		const startTime = performance.now()

		try {
			MCPLogger.debug(
				'ComponentLibraryMCP.searchComponents',
				'Searching components',
				{ query }
			)

			const searchTerm = query.toLowerCase()
			const results = this.components.filter(
				comp =>
					comp.name.toLowerCase().includes(searchTerm) ||
					comp.description.toLowerCase().includes(searchTerm) ||
					comp.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm))
			)

			const executionTime = performance.now() - startTime
			MCPLogger.debug(
				'ComponentLibraryMCP.searchComponents',
				'Search completed successfully',
				{
					query,
					resultsCount: results.length,
				},
				executionTime
			)

			return {
				success: true,
				data: [...results],
				metadata: { executionTime },
			}
		} catch (error) {
			const executionTime = performance.now() - startTime
			MCPLogger.error('ComponentLibraryMCP.searchComponents', error as Error, {
				query,
				executionTime,
			})

			return {
				success: false,
				error: {
					code: 'SEARCH_ERROR',
					message: 'Failed to search components',
					details: { query, error: (error as Error).message },
					timestamp: new Date(),
				},
			}
		}
	}

	/**
	 * Validate component configuration
	 */
	static validateComponent(component: FormComponent): MCPResult<boolean> {
		const startTime = performance.now()
		const errors: MCPError[] = []

		try {
			MCPLogger.debug(
				'ComponentLibraryMCP.validateComponent',
				'Validating component',
				{ componentId: component.id }
			)

			// Validate required fields
			if (!component.id) {
				errors.push({
					code: 'COMPONENT_ERROR',
					message: 'Component ID is required',
					field: 'id',
					timestamp: new Date(),
				})
			}

			if (!component.name?.trim()) {
				errors.push({
					code: 'COMPONENT_ERROR',
					message: 'Component name is required',
					field: 'name',
					timestamp: new Date(),
				})
			}

			if (!component.type) {
				errors.push({
					code: 'COMPONENT_ERROR',
					message: 'Component type is required',
					field: 'type',
					timestamp: new Date(),
				})
			}

			if (!component.category) {
				errors.push({
					code: 'COMPONENT_ERROR',
					message: 'Component category is required',
					field: 'category',
					timestamp: new Date(),
				})
			}

			// Validate component props
			if (component.props) {
				const propsValidation = this.validateComponentProps(
					component.id,
					component.props
				)
				if (!propsValidation.success && propsValidation.error) {
					errors.push(propsValidation.error)
				}
			}

			const executionTime = performance.now() - startTime

			if (errors.length > 0) {
				MCPLogger.warn(
					'ComponentLibraryMCP.validateComponent',
					'Component validation failed',
					{
						componentId: component.id,
						errorsCount: errors.length,
					},
					executionTime
				)

				return {
					success: false,
					errors,
					metadata: { executionTime },
				}
			}

			MCPLogger.debug(
				'ComponentLibraryMCP.validateComponent',
				'Component validation successful',
				{
					componentId: component.id,
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
			MCPLogger.error('ComponentLibraryMCP.validateComponent', error as Error, {
				componentId: component.id,
				executionTime,
			})

			return {
				success: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: 'Failed to validate component',
					details: {
						componentId: component.id,
						error: (error as Error).message,
					},
					timestamp: new Date(),
				},
			}
		}
	}

	/**
	 * Validate component props
	 */
	static validateComponentProps(
		componentId: string,
		props: ComponentProps
	): MCPResult<boolean> {
		const startTime = performance.now()
		const errors: MCPError[] = []

		try {
			MCPLogger.debug(
				'ComponentLibraryMCP.validateComponentProps',
				'Validating component props',
				{ componentId }
			)

			// Validate required props
			if (props.required === undefined) {
				errors.push({
					code: 'PROPS_ERROR',
					message: 'Required property is mandatory',
					field: 'required',
					timestamp: new Date(),
				})
			}

			// Validate options if provided
			if (props.options && props.options.length === 0) {
				errors.push({
					code: 'PROPS_ERROR',
					message: 'Options array cannot be empty',
					field: 'options',
					timestamp: new Date(),
				})
			}

			const executionTime = performance.now() - startTime

			if (errors.length > 0) {
				MCPLogger.warn(
					'ComponentLibraryMCP.validateComponentProps',
					'Props validation failed',
					{
						componentId,
						errorsCount: errors.length,
					},
					executionTime
				)

				return {
					success: false,
					errors,
					metadata: { executionTime },
				}
			}

			MCPLogger.debug(
				'ComponentLibraryMCP.validateComponentProps',
				'Props validation successful',
				{
					componentId,
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
			MCPLogger.error(
				'ComponentLibraryMCP.validateComponentProps',
				error as Error,
				{
					componentId,
					executionTime,
				}
			)

			return {
				success: false,
				error: {
					code: 'PROPS_VALIDATION_ERROR',
					message: 'Failed to validate component props',
					details: { componentId, error: (error as Error).message },
					timestamp: new Date(),
				},
			}
		}
	}

	/**
	 * Create default components for the library
	 */
	private static createDefaultComponents(): FormComponent[] {
		return [
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
					examples: [
						{
							title: 'Basic Text Input',
							description: 'Simple text input with placeholder',
							props: { placeholder: 'Enter your name' },
							code: '<TextInput placeholder="Enter your name" />',
						},
					],
				},
			},
			{
				id: 'email-input',
				name: 'Email Input',
				description: 'Email address input with validation',
				category: 'basic',
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
					tags: ['input', 'email', 'validation'],
					documentation: 'Email input component with built-in email validation',
					examples: [
						{
							title: 'Email Input',
							description: 'Email input with validation',
							props: { placeholder: 'Enter your email' },
							code: '<EmailInput placeholder="Enter your email" required />',
						},
					],
				},
			},
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
					validation: {
						rules: [{ type: 'number', message: 'Please enter a valid amount' }],
						messages: {
							required: 'Amount is required',
							invalid: 'Please enter a valid amount',
						},
					},
				},
				validation: {
					rules: [{ type: 'number', message: 'Please enter a valid amount' }],
					messages: {
						required: 'Amount is required',
						invalid: 'Please enter a valid amount',
					},
				},
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['input', 'money', 'currency', 'financial'],
					documentation:
						'Money input component with currency formatting and validation',
					examples: [
						{
							title: 'Money Input',
							description: 'Currency input with dollar formatting',
							props: { placeholder: '$0.00', currency: 'USD' },
							code: '<MoneyInput placeholder="$0.00" currency="USD" />',
						},
					],
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
					tags: ['input', 'phone', 'contact', 'formatting'],
					documentation:
						'Phone input component with automatic formatting and validation',
					examples: [
						{
							title: 'Phone Input',
							description: 'Phone input with US formatting',
							props: { placeholder: '(555) 123-4567' },
							code: '<PhoneInput placeholder="(555) 123-4567" />',
						},
					],
				},
			},
		]
	}
}
