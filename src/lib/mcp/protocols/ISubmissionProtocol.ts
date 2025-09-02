/**
 * ISubmissionProtocol - Interface for Form Submission MCP operations
 *
 * Defines the contract for form submission validation, processing, and management
 * within the MCP system.
 */

import {
	MCPResult,
	SubmissionValidationResult,
	FormValidationContext,
} from './types'
import { Form, FormField, FormSubmission } from '@/types'

export interface ISubmissionProtocol {
	/**
	 * Validates form submission data against form configuration
	 */
	validateSubmission(
		context: FormValidationContext
	): MCPResult<SubmissionValidationResult>

	/**
	 * Validates individual field submission
	 */
	validateFieldSubmission(field: FormField, value: unknown): MCPResult<boolean>

	/**
	 * Processes form submission data
	 */
	processSubmission(
		form: Form,
		data: Record<string, unknown>
	): MCPResult<FormSubmission>

	/**
	 * Sanitizes submission data
	 */
	sanitizeSubmissionData(data: Record<string, unknown>): Record<string, unknown>

	/**
	 * Transforms submission data for storage
	 */
	transformSubmissionData(
		form: Form,
		data: Record<string, unknown>
	): Record<string, unknown>

	/**
	 * Validates required fields
	 */
	validateRequiredFields(
		form: Form,
		data: Record<string, unknown>
	): MCPResult<boolean>

	/**
	 * Validates field types and formats
	 */
	validateFieldTypes(
		form: Form,
		data: Record<string, unknown>
	): MCPResult<boolean>

	/**
	 * Generates submission metadata
	 */
	generateSubmissionMetadata(formId: string): Partial<FormSubmission>

	/**
	 * Formats submission data for display
	 */
	formatSubmissionForDisplay(
		form: Form,
		submission: FormSubmission
	): Record<string, string>
}
