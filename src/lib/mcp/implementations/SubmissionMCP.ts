/**
 * SubmissionMCP - Model Context Protocol implementation for Form Submission operations
 *
 * Handles all form submission-related operations including validation,
 * processing, and data transformation.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import {
	MCPResult,
	SubmissionValidationResult,
	FormValidationContext,
	MCPError,
} from '../protocols/types'
import { MCPLogger } from './logger'
import { Form, FormField, FormSubmission } from '@/types'
import { generateId } from '@/utils'

export class SubmissionMCP {
	/**
	 * Validates form submission data against form configuration
	 */
	static validateSubmission(
		context: FormValidationContext
	): MCPResult<SubmissionValidationResult> {
		const tracker = MCPLogger.createPerformanceTracker('validateSubmission')

		try {
			const errors: MCPError[] = []
			const fieldErrors: Record<string, string[]> = {}
			const warnings: string[] = []

			// Validate required fields
			const requiredValidation = SubmissionMCP.validateRequiredFields(
				context.form,
				context.submissionData
			)
			if (!requiredValidation.success) {
				errors.push(...requiredValidation.errors!)
			}

			// Validate field types
			const typeValidation = SubmissionMCP.validateFieldTypes(
				context.form,
				context.submissionData
			)
			if (!typeValidation.success) {
				errors.push(...typeValidation.errors!)
			}

			// Validate individual fields
			context.form.fields.forEach(field => {
				const value = context.submissionData[field.id]
				const fieldValidation = SubmissionMCP.validateFieldSubmission(
					field,
					value
				)

				if (!fieldValidation.success) {
					errors.push(...fieldValidation.errors!)
					fieldErrors[field.id] = fieldValidation.errors!.map(e => e.message)
				}
			})

			// Check for extra fields not in form
			const formFieldIds = context.form.fields.map(f => f.id)
			const submissionFieldIds = Object.keys(context.submissionData)
			const extraFields = submissionFieldIds.filter(
				id => !formFieldIds.includes(id)
			)

			if (extraFields.length > 0) {
				warnings.push(
					`Extra fields found in submission: ${extraFields.join(', ')}`
				)
			}

			const result: SubmissionValidationResult = {
				isValid: errors.length === 0,
				errors,
				fieldErrors,
				warnings: warnings.length > 0 ? warnings : undefined,
			}

			const mcpResult: MCPResult<SubmissionValidationResult> = {
				success: true,
				data: result,
				metadata: {
					executionTime: tracker.end(),
					operation: 'validateSubmission',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('validateSubmission', context, mcpResult)
			return mcpResult
		} catch (error) {
			const mcpError: MCPError = {
				code: 'SUBMISSION_ERROR',
				message: 'Unexpected error validating submission',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<SubmissionValidationResult> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'validateSubmission',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('validateSubmission', mcpError)
			return result
		}
	}

	/**
	 * Validates individual field submission
	 */
	static validateFieldSubmission(
		field: FormField,
		value: any
	): MCPResult<boolean> {
		const errors: MCPError[] = []

		// Required field validation
		if (
			field.required &&
			(value === null || value === undefined || value === '')
		) {
			errors.push({
				code: 'VALIDATION_ERROR',
				message: `${field.label} is required`,
				field: field.id,
				timestamp: new Date(),
			})
		}

		// Skip validation if value is empty and field is not required
		if (
			!field.required &&
			(value === null || value === undefined || value === '')
		) {
			return { success: true, data: true }
		}

		// Type-specific validation
		switch (field.type) {
			case 'email':
				if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
					errors.push({
						code: 'VALIDATION_ERROR',
						message: 'Please enter a valid email address',
						field: field.id,
						timestamp: new Date(),
					})
				}
				break

			case 'number':
				if (value && isNaN(Number(value))) {
					errors.push({
						code: 'VALIDATION_ERROR',
						message: 'Please enter a valid number',
						field: field.id,
						timestamp: new Date(),
					})
				}
				break

			case 'phone':
				if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\D/g, ''))) {
					errors.push({
						code: 'VALIDATION_ERROR',
						message: 'Please enter a valid phone number',
						field: field.id,
						timestamp: new Date(),
					})
				}
				break

			case 'money':
				if (value && !/^\$?[\d,]+(\.\d{2})?$/.test(value)) {
					errors.push({
						code: 'VALIDATION_ERROR',
						message: 'Please enter a valid monetary amount',
						field: field.id,
						timestamp: new Date(),
					})
				}
				break

			case 'date':
				if (value && !(value instanceof Date) && isNaN(Date.parse(value))) {
					errors.push({
						code: 'VALIDATION_ERROR',
						message: 'Please enter a valid date',
						field: field.id,
						timestamp: new Date(),
					})
				}
				break

			case 'select':
			case 'radio':
				if (value && field.options && !field.options.includes(value)) {
					errors.push({
						code: 'VALIDATION_ERROR',
						message: 'Please select a valid option',
						field: field.id,
						timestamp: new Date(),
					})
				}
				break

			case 'checkbox':
				if (value && Array.isArray(value)) {
					const invalidOptions = value.filter(
						opt => !field.options?.includes(opt)
					)
					if (invalidOptions.length > 0) {
						errors.push({
							code: 'VALIDATION_ERROR',
							message: `Invalid options selected: ${invalidOptions.join(', ')}`,
							field: field.id,
							timestamp: new Date(),
						})
					}
				}
				break

			case 'yesno':
				if (value && !['Yes', 'No'].includes(value)) {
					errors.push({
						code: 'VALIDATION_ERROR',
						message: 'Please select Yes or No',
						field: field.id,
						timestamp: new Date(),
					})
				}
				break
		}

		return {
			success: errors.length === 0,
			data: errors.length === 0,
			errors: errors.length > 0 ? errors : undefined,
		}
	}

	/**
	 * Processes form submission data
	 */
	static processSubmission(
		form: Form,
		data: Record<string, any>
	): MCPResult<FormSubmission> {
		const tracker = MCPLogger.createPerformanceTracker('processSubmission')

		try {
			// Sanitize submission data
			const sanitizedData = SubmissionMCP.sanitizeSubmissionData(data)

			// Transform submission data
			const transformedData = SubmissionMCP.transformSubmissionData(
				form,
				sanitizedData
			)

			// Generate submission metadata
			const metadata = SubmissionMCP.generateSubmissionMetadata()

			// Create submission object
			const submission: FormSubmission = {
				id: metadata.id!,
				submittedAt: metadata.submittedAt!,
				formId: form.id,
				data: transformedData,
			}

			const result: MCPResult<FormSubmission> = {
				success: true,
				data: submission,
				metadata: {
					executionTime: tracker.end(),
					operation: 'processSubmission',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('processSubmission', { form, data }, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'SUBMISSION_ERROR',
				message: 'Unexpected error processing submission',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<FormSubmission> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'processSubmission',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('processSubmission', mcpError)
			return result
		}
	}

	/**
	 * Sanitizes submission data
	 */
	static sanitizeSubmissionData(
		data: Record<string, any>
	): Record<string, any> {
		const sanitized: Record<string, any> = {}

		for (const [key, value] of Object.entries(data)) {
			if (value === null || value === undefined) {
				sanitized[key] = null
			} else if (typeof value === 'string') {
				sanitized[key] = value.trim()
			} else if (Array.isArray(value)) {
				sanitized[key] = value
					.map(item => (typeof item === 'string' ? item.trim() : item))
					.filter(item => item !== '')
			} else {
				sanitized[key] = value
			}
		}

		return sanitized
	}

	/**
	 * Transforms submission data for storage
	 */
	static transformSubmissionData(
		form: Form,
		data: Record<string, any>
	): Record<string, any> {
		const transformed: Record<string, any> = {}

		form.fields.forEach(field => {
			const value = data[field.id]

			switch (field.type) {
				case 'number':
					transformed[field.id] = value ? Number(value) : null
					break
				case 'date':
					transformed[field.id] =
						value instanceof Date ? value : value ? new Date(value) : null
					break
				case 'checkbox':
					transformed[field.id] = Array.isArray(value)
						? value
						: value
						? [value]
						: []
					break
				case 'money':
					transformed[field.id] = value ? value.replace(/[$,]/g, '') : null
					break
				case 'phone':
					transformed[field.id] = value ? value.replace(/\D/g, '') : null
					break
				default:
					transformed[field.id] = value
			}
		})

		return transformed
	}

	/**
	 * Validates required fields
	 */
	static validateRequiredFields(
		form: Form,
		data: Record<string, any>
	): MCPResult<boolean> {
		const errors: MCPError[] = []

		form.fields.forEach(field => {
			if (field.required) {
				const value = data[field.id]
				if (value === null || value === undefined || value === '') {
					errors.push({
						code: 'VALIDATION_ERROR',
						message: `${field.label} is required`,
						field: field.id,
						timestamp: new Date(),
					})
				}
			}
		})

		return {
			success: errors.length === 0,
			data: errors.length === 0,
			errors: errors.length > 0 ? errors : undefined,
		}
	}

	/**
	 * Validates field types and formats
	 */
	static validateFieldTypes(
		form: Form,
		data: Record<string, any>
	): MCPResult<boolean> {
		const errors: MCPError[] = []

		form.fields.forEach(field => {
			const value = data[field.id]
			if (value === null || value === undefined || value === '') return

			const fieldValidation = SubmissionMCP.validateFieldSubmission(
				field,
				value
			)
			if (!fieldValidation.success) {
				errors.push(...fieldValidation.errors!)
			}
		})

		return {
			success: errors.length === 0,
			data: errors.length === 0,
			errors: errors.length > 0 ? errors : undefined,
		}
	}

	/**
	 * Generates submission metadata
	 */
	static generateSubmissionMetadata(): Partial<FormSubmission> {
		return {
			id: generateId(),
			submittedAt: new Date(),
		}
	}

	/**
	 * Formats submission data for display
	 */
	static formatSubmissionForDisplay(
		form: Form,
		submission: FormSubmission
	): Record<string, string> {
		const formatted: Record<string, string> = {}

		form.fields.forEach(field => {
			const value = submission.data[field.id]

			if (value === null || value === undefined) {
				formatted[field.id] = 'No value provided'
			} else if (Array.isArray(value)) {
				formatted[field.id] = value.join(', ')
			} else if (value && typeof value === 'object' && value instanceof Date) {
				formatted[field.id] = value.toLocaleDateString()
			} else {
				formatted[field.id] = String(value)
			}
		})

		return formatted
	}
}
