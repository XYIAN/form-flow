/**
 * FormMCP - Model Context Protocol implementation for Form operations
 *
 * Handles all form-related business logic including creation, validation,
 * updates, and metadata generation.
 */

import { MCPResult, ValidationResult, MCPError } from '../protocols/types'
import { MCPLogger } from './logger'
import { Form, CreateFormData, FormField, FieldType } from '@/types'
import { generateId } from '@/utils'

export class FormMCP {
	/**
	 * Creates a new form with validation and business logic
	 */
	static createForm(data: CreateFormData): MCPResult<Form> {
		const tracker = MCPLogger.createPerformanceTracker('createForm')

		try {
			// Validate input data
			const validation = FormMCP.validateFormData(data)
			if (!validation.isValid) {
				const result: MCPResult<Form> = {
					success: false,
					errors: validation.errors,
					metadata: {
						executionTime: tracker.end(),
						operation: 'createForm',
						timestamp: new Date(),
					},
				}

				MCPLogger.log('createForm', data, result)
				return result
			}

			// Sanitize input data
			const sanitizedData = FormMCP.sanitizeFormData(data)

			// Generate form metadata
			const metadata = FormMCP.generateFormMetadata()

			// Create form object
			const form: Form = {
				id: metadata.id!,
				userId: metadata.userId!,
				createdAt: metadata.createdAt!,
				updatedAt: metadata.updatedAt!,
				title: sanitizedData.title,
				description: sanitizedData.description,
				fields: sanitizedData.fields.map(field =>
					FormMCP.sanitizeFieldData(field)
				),
			}

			const result: MCPResult<Form> = {
				success: true,
				data: form,
				metadata: {
					executionTime: tracker.end(),
					operation: 'createForm',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('createForm', data, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'FORM_ERROR',
				message: 'Unexpected error creating form',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<Form> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'createForm',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('createForm', mcpError)
			return result
		}
	}

	/**
	 * Validates form data before creation or update
	 */
	static validateFormData(data: CreateFormData): ValidationResult {
		const errors: MCPError[] = []
		const warnings: string[] = []

		// Validate title
		if (!data.title?.trim()) {
			errors.push({
				code: 'VALIDATION_ERROR',
				message: 'Form title is required',
				field: 'title',
				timestamp: new Date(),
			})
		} else if (data.title.length > 200) {
			errors.push({
				code: 'VALIDATION_ERROR',
				message: 'Form title must be less than 200 characters',
				field: 'title',
				details: { actual: data.title.length, expected: 200 },
				timestamp: new Date(),
			})
		}

		// Validate description
		if (data.description && data.description.length > 1000) {
			errors.push({
				code: 'VALIDATION_ERROR',
				message: 'Form description must be less than 1000 characters',
				field: 'description',
				details: { actual: data.description.length, expected: 1000 },
				timestamp: new Date(),
			})
		}

		// Validate fields
		if (!data.fields?.length) {
			errors.push({
				code: 'VALIDATION_ERROR',
				message: 'At least one field is required',
				field: 'fields',
				timestamp: new Date(),
			})
		} else {
			// Validate individual fields
			const fieldValidation = FormMCP.validateFields(data.fields)
			if (!fieldValidation.isValid) {
				errors.push(...fieldValidation.errors)
			}
			if (fieldValidation.warnings) {
				warnings.push(...fieldValidation.warnings)
			}

			// Check for duplicate field labels
			const labels = data.fields.map(f => f.label.toLowerCase().trim())
			const duplicates = labels.filter(
				(label, index) => labels.indexOf(label) !== index
			)
			if (duplicates.length > 0) {
				warnings.push(
					`Duplicate field labels found: ${[...new Set(duplicates)].join(', ')}`
				)
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings: warnings.length > 0 ? warnings : undefined,
		}
	}

	/**
	 * Validates an existing form structure
	 */
	static validateForm(form: Form): ValidationResult {
		const errors: MCPError[] = []
		const warnings: string[] = []

		// Validate form structure
		if (!form.id) {
			errors.push({
				code: 'VALIDATION_ERROR',
				message: 'Form ID is required',
				field: 'id',
				timestamp: new Date(),
			})
		}

		if (!form.userId) {
			errors.push({
				code: 'VALIDATION_ERROR',
				message: 'User ID is required',
				field: 'userId',
				timestamp: new Date(),
			})
		}

		// Validate form data
		const formDataValidation = FormMCP.validateFormData({
			title: form.title,
			description: form.description,
			fields: form.fields,
		})

		if (!formDataValidation.isValid) {
			errors.push(...formDataValidation.errors)
		}
		if (formDataValidation.warnings) {
			warnings.push(...formDataValidation.warnings)
		}

		// Validate timestamps
		if (!form.createdAt || !form.updatedAt) {
			errors.push({
				code: 'VALIDATION_ERROR',
				message: 'Form timestamps are required',
				field: 'timestamps',
				timestamp: new Date(),
			})
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings: warnings.length > 0 ? warnings : undefined,
		}
	}

	/**
	 * Updates an existing form with new data
	 */
	static updateForm(
		form: Form,
		updates: Partial<CreateFormData>
	): MCPResult<Form> {
		const tracker = MCPLogger.createPerformanceTracker('updateForm')

		try {
			// Create updated form data
			const updatedData: CreateFormData = {
				title: updates.title ?? form.title,
				description: updates.description ?? form.description,
				fields: updates.fields ?? form.fields,
			}

			// Validate updated data
			const validation = FormMCP.validateFormData(updatedData)
			if (!validation.isValid) {
				const result: MCPResult<Form> = {
					success: false,
					errors: validation.errors,
					metadata: {
						executionTime: tracker.end(),
						operation: 'updateForm',
						timestamp: new Date(),
					},
				}

				MCPLogger.log('updateForm', { form, updates }, result)
				return result
			}

			// Create updated form
			const updatedForm: Form = {
				...form,
				title: updatedData.title,
				description: updatedData.description,
				fields: updatedData.fields.map(field =>
					FormMCP.sanitizeFieldData(field)
				),
				updatedAt: new Date(),
			}

			const result: MCPResult<Form> = {
				success: true,
				data: updatedForm,
				metadata: {
					executionTime: tracker.end(),
					operation: 'updateForm',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('updateForm', { form, updates }, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'FORM_ERROR',
				message: 'Unexpected error updating form',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<Form> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'updateForm',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('updateForm', mcpError)
			return result
		}
	}

	/**
	 * Validates form fields configuration
	 */
	static validateFields(fields: FormField[]): ValidationResult {
		const errors: MCPError[] = []
		const warnings: string[] = []

		if (!Array.isArray(fields)) {
			errors.push({
				code: 'VALIDATION_ERROR',
				message: 'Fields must be an array',
				field: 'fields',
				timestamp: new Date(),
			})
			return { isValid: false, errors }
		}

		// Validate each field
		fields.forEach((field, index) => {
			const fieldErrors = FormMCP.validateField(field)
			if (!fieldErrors.isValid) {
				errors.push(
					...fieldErrors.errors.map(error => ({
						...error,
						field: `fields[${index}].${error.field || 'unknown'}`,
					}))
				)
			}
		})

		// Check for maximum fields limit
		if (fields.length > 50) {
			warnings.push(
				'Forms with more than 50 fields may have performance issues'
			)
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings: warnings.length > 0 ? warnings : undefined,
		}
	}

	/**
	 * Validates individual field
	 */
	private static validateField(field: FormField): ValidationResult {
		const errors: MCPError[] = []

		// Validate required fields
		if (!field.id) {
			errors.push({
				code: 'FIELD_ERROR',
				message: 'Field ID is required',
				field: 'id',
				timestamp: new Date(),
			})
		}

		if (!field.label?.trim()) {
			errors.push({
				code: 'FIELD_ERROR',
				message: 'Field label is required',
				field: 'label',
				timestamp: new Date(),
			})
		}

		if (!field.type) {
			errors.push({
				code: 'FIELD_ERROR',
				message: 'Field type is required',
				field: 'type',
				timestamp: new Date(),
			})
		}

		// Validate field type
		const validTypes: FieldType[] = [
			'text',
			'email',
			'number',
			'date',
			'textarea',
			'select',
			'checkbox',
			'radio',
			'money',
			'phone',
			'address',
			'yesno',
			'file',
			'signature',
		]

		if (field.type && !validTypes.includes(field.type)) {
			errors.push({
				code: 'FIELD_ERROR',
				message: `Invalid field type: ${field.type}`,
				field: 'type',
				details: { actual: field.type, expected: validTypes },
				timestamp: new Date(),
			})
		}

		// Validate options for fields that require them
		const fieldsRequiringOptions: FieldType[] = ['select', 'radio', 'checkbox']
		if (
			fieldsRequiringOptions.includes(field.type) &&
			(!field.options || field.options.length === 0)
		) {
			errors.push({
				code: 'FIELD_ERROR',
				message: `Field type '${field.type}' requires options`,
				field: 'options',
				timestamp: new Date(),
			})
		}

		return {
			isValid: errors.length === 0,
			errors,
		}
	}

	/**
	 * Generates form metadata (ID, timestamps, etc.)
	 */
	static generateFormMetadata(): Partial<Form> {
		return {
			id: generateId(),
			userId: '', // Will be set by context
			createdAt: new Date(),
			updatedAt: new Date(),
		}
	}

	/**
	 * Sanitizes form data for storage
	 */
	static sanitizeFormData(data: CreateFormData): CreateFormData {
		return {
			title: data.title?.trim() || '',
			description: data.description?.trim() || undefined,
			fields: data.fields.map(field => FormMCP.sanitizeFieldData(field)),
		}
	}

	/**
	 * Sanitizes field data for storage
	 */
	private static sanitizeFieldData(field: FormField): FormField {
		return {
			...field,
			label: field.label?.trim() || '',
			placeholder: field.placeholder?.trim() || undefined,
			options:
				field.options?.map(opt => opt.trim()).filter(opt => opt.length > 0) ||
				undefined,
		}
	}
}
