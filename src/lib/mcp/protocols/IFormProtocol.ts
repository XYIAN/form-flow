/**
 * IFormProtocol - Interface for Form-related MCP operations
 * 
 * Defines the contract for form creation, validation, and management operations
 * within the MCP system.
 */

import { MCPResult, ValidationResult } from './types';
import { Form, CreateFormData, FormField } from '@/types';

export interface IFormProtocol {
	/**
	 * Creates a new form with validation and business logic
	 */
	createForm(data: CreateFormData): MCPResult<Form>;

	/**
	 * Validates form data before creation or update
	 */
	validateFormData(data: CreateFormData): ValidationResult;

	/**
	 * Validates an existing form structure
	 */
	validateForm(form: Form): ValidationResult;

	/**
	 * Updates an existing form with new data
	 */
	updateForm(form: Form, updates: Partial<CreateFormData>): MCPResult<Form>;

	/**
	 * Validates form fields configuration
	 */
	validateFields(fields: FormField[]): ValidationResult;

	/**
	 * Generates form metadata (ID, timestamps, etc.)
	 */
	generateFormMetadata(data: CreateFormData): Partial<Form>;

	/**
	 * Sanitizes form data for storage
	 */
	sanitizeFormData(data: CreateFormData): CreateFormData;
}
