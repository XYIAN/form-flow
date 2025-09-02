/**
 * ISubmissionProtocol - Interface for Form Submission MCP operations
 * 
 * Defines the contract for form submission validation, processing, and management
 * within the MCP system.
 */

import { MCPResult, SubmissionValidationResult, FormValidationContext } from './types';
import { Form, FormField, FormSubmission } from '@/types';

export interface ISubmissionProtocol {
	/**
	 * Validates form submission data against form configuration
	 */
	validateSubmission(context: FormValidationContext): MCPResult<SubmissionValidationResult>;

	/**
	 * Validates individual field submission
	 */
	validateFieldSubmission(field: FormField, value: any): MCPResult<boolean>;

	/**
	 * Processes form submission data
	 */
	processSubmission(form: Form, data: Record<string, any>): MCPResult<FormSubmission>;

	/**
	 * Sanitizes submission data
	 */
	sanitizeSubmissionData(data: Record<string, any>): Record<string, any>;

	/**
	 * Transforms submission data for storage
	 */
	transformSubmissionData(form: Form, data: Record<string, any>): Record<string, any>;

	/**
	 * Validates required fields
	 */
	validateRequiredFields(form: Form, data: Record<string, any>): MCPResult<boolean>;

	/**
	 * Validates field types and formats
	 */
	validateFieldTypes(form: Form, data: Record<string, any>): MCPResult<boolean>;

	/**
	 * Generates submission metadata
	 */
	generateSubmissionMetadata(formId: string): Partial<FormSubmission>;

	/**
	 * Formats submission data for display
	 */
	formatSubmissionForDisplay(form: Form, submission: FormSubmission): Record<string, string>;
}
