import { MCPResult } from './types'
import {
	ComponentLibrary,
	FormComponent,
	ComponentCategory,
	ComponentProps,
	ComponentValidation,
	ComponentStyle,
	ComponentBehavior,
} from '@/types'

export interface IComponentLibraryProtocol {
	/**
	 * Get all available component libraries
	 */
	getLibraries(): MCPResult<ComponentLibrary[]>

	/**
	 * Get a specific component library by ID
	 */
	getLibrary(libraryId: string): MCPResult<ComponentLibrary>

	/**
	 * Get components by category
	 */
	getComponentsByCategory(
		category: ComponentCategory
	): MCPResult<FormComponent[]>

	/**
	 * Get a specific component by ID
	 */
	getComponent(componentId: string): MCPResult<FormComponent>

	/**
	 * Search components by name, description, or tags
	 */
	searchComponents(query: string): MCPResult<FormComponent[]>

	/**
	 * Create a new component library
	 */
	createLibrary(
		library: Omit<ComponentLibrary, 'id' | 'createdAt' | 'updatedAt'>
	): MCPResult<ComponentLibrary>

	/**
	 * Update an existing component library
	 */
	updateLibrary(
		libraryId: string,
		updates: Partial<ComponentLibrary>
	): MCPResult<ComponentLibrary>

	/**
	 * Delete a component library
	 */
	deleteLibrary(libraryId: string): MCPResult<boolean>

	/**
	 * Add a component to a library
	 */
	addComponent(
		libraryId: string,
		component: Omit<FormComponent, 'id'>
	): MCPResult<FormComponent>

	/**
	 * Update a component in a library
	 */
	updateComponent(
		componentId: string,
		updates: Partial<FormComponent>
	): MCPResult<FormComponent>

	/**
	 * Remove a component from a library
	 */
	removeComponent(componentId: string): MCPResult<boolean>

	/**
	 * Validate component configuration
	 */
	validateComponent(component: FormComponent): MCPResult<boolean>

	/**
	 * Get component preview data
	 */
	getComponentPreview(
		componentId: string,
		props?: ComponentProps
	): MCPResult<string>

	/**
	 * Get component examples
	 */
	getComponentExamples(componentId: string): MCPResult<ComponentExample[]>

	/**
	 * Clone a component with modifications
	 */
	cloneComponent(
		componentId: string,
		modifications: Partial<FormComponent>
	): MCPResult<FormComponent>

	/**
	 * Get component dependencies
	 */
	getComponentDependencies(componentId: string): MCPResult<string[]>

	/**
	 * Validate component props
	 */
	validateComponentProps(
		componentId: string,
		props: ComponentProps
	): MCPResult<boolean>

	/**
	 * Get component validation rules
	 */
	getComponentValidation(componentId: string): MCPResult<ComponentValidation>

	/**
	 * Get component style options
	 */
	getComponentStyleOptions(componentId: string): MCPResult<ComponentStyle>

	/**
	 * Get component behavior options
	 */
	getComponentBehaviorOptions(componentId: string): MCPResult<ComponentBehavior>

	/**
	 * Export component library
	 */
	exportLibrary(libraryId: string, format: 'json' | 'yaml'): MCPResult<string>

	/**
	 * Import component library
	 */
	importLibrary(
		data: string,
		format: 'json' | 'yaml'
	): MCPResult<ComponentLibrary>
}

interface ComponentExample {
	title: string
	description: string
	props: Record<string, unknown>
	code: string
}
