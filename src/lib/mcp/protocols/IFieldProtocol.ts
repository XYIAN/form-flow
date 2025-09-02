/**
 * IFieldProtocol - Interface for Field-related MCP operations
 *
 * Defines the contract for field rendering, validation, and management operations
 * within the MCP system.
 */

import { MCPResult, FieldRenderProps } from './types'
import { FormField, FieldType } from '@/types'

export interface IFieldProtocol {
	/**
	 * Renders a field component based on its type
	 */
	render(props: FieldRenderProps): MCPResult<React.ReactNode>

	/**
	 * Validates a field configuration
	 */
	validateField(field: FormField): MCPResult<boolean>

	/**
	 * Validates field value against field configuration
	 */
	validateFieldValue(field: FormField, value: unknown): MCPResult<boolean>

	/**
	 * Gets the appropriate component for a field type
	 */
	getComponent(fieldType: FieldType): React.ComponentType<unknown>

	/**
	 * Gets component props for a field type
	 */
	getComponentProps(
		field: FormField,
		control: unknown,
		errors: unknown
	): Record<string, unknown>

	/**
	 * Sanitizes field data for storage
	 */
	sanitizeFieldData(field: FormField): FormField

	/**
	 * Generates default options for field types that need them
	 */
	generateDefaultOptions(fieldType: FieldType): string[] | undefined

	/**
	 * Gets validation rules for a field type
	 */
	getValidationRules(field: FormField): Record<string, unknown>

	/**
	 * Transforms field value for display
	 */
	transformValueForDisplay(field: FormField, value: unknown): string

	/**
	 * Transforms field value for storage
	 */
	transformValueForStorage(field: FormField, value: unknown): unknown
}
