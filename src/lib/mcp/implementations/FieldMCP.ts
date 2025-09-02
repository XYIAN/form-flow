/**
 * FieldMCP - Model Context Protocol implementation for Field operations
 *
 * Handles all field-related operations including rendering, validation,
 * and component management using PrimeReact components.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import React from 'react'

import { MCPResult, FieldRenderProps, MCPError } from '../protocols/types'
import { MCPLogger } from './logger'
import { FormField, FieldType } from '@/types'

// PrimeReact Components
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { Checkbox } from 'primereact/checkbox'
import { RadioButton } from 'primereact/radiobutton'
import { InputMask } from 'primereact/inputmask'
import { FileUpload } from 'primereact/fileupload'

export class FieldMCP {
	/**
	 * Renders a field component based on its type
	 * Returns the component class and props for React Hook Form integration
	 */
	static render(
		props: FieldRenderProps
	): MCPResult<{ Component: any; componentProps: any }> {
		const tracker = MCPLogger.createPerformanceTracker('render')

		try {
			// Validate field
			const fieldValidation = FieldMCP.validateField(props.field)
			if (!fieldValidation.success) {
				const result: MCPResult<{ Component: any; componentProps: any }> = {
					success: false,
					errors: fieldValidation.errors,
					metadata: {
						executionTime: tracker.end(),
						operation: 'render',
						timestamp: new Date(),
					},
				}

				MCPLogger.log('render', props.field, result)
				return result
			}

			// Get component and props
			const Component = FieldMCP.getComponent(props.field.type)
			const componentProps = FieldMCP.getComponentProps(
				props.field,
				props.control,
				props.errors
			)

			const result: MCPResult<{ Component: any; componentProps: any }> = {
				success: true,
				data: { Component, componentProps },
				metadata: {
					executionTime: tracker.end(),
					operation: 'render',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('render', props.field, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'RENDER_ERROR',
				message: `Failed to render field: ${props.field.label}`,
				field: props.field.id,
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<{ Component: any; componentProps: any }> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'render',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('render', mcpError)
			return result
		}
	}

	/**
	 * Validates a field configuration
	 */
	static validateField(field: FormField): MCPResult<boolean> {
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
			// Basic Input Types
			'text',
			'email',
			'password',
			'number',
			'url',
			'search',
			// Date & Time Types
			'date',
			'datetime',
			'time',
			'month',
			'week',
			'year',
			// Text Area Types
			'textarea',
			'rich-text',
			'markdown',
			// Selection Types
			'select',
			'multiselect',
			'checkbox',
			'radio',
			'yesno',
			'toggle',
			// Financial Types
			'money',
			'percentage',
			'currency',
			// Contact Types
			'phone',
			'address',
			'country',
			'state',
			'zipcode',
			// File & Media Types
			'file',
			'image',
			'signature',
			'audio',
			'video',
			// Rating & Scale Types
			'rating',
			'slider',
			'range',
			'likert',
			// Specialized Types
			'color',
			'tags',
			'autocomplete',
			'location',
			'matrix',
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
			success: errors.length === 0,
			data: errors.length === 0,
			errors: errors.length > 0 ? errors : undefined,
		}
	}

	/**
	 * Validates field value against field configuration
	 */
	static validateFieldValue(
		field: FormField,
		value: unknown
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

		// Type-specific validation
		switch (field.type) {
			case 'email':
				if (
					value &&
					typeof value === 'string' &&
					!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
				) {
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
				if (
					value &&
					typeof value === 'string' &&
					!/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\D/g, ''))
				) {
					errors.push({
						code: 'VALIDATION_ERROR',
						message: 'Please enter a valid phone number',
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
	 * Gets the appropriate component for a field type
	 */
	static getComponent(fieldType: FieldType): React.ComponentType<any> {
		const componentMap: Record<FieldType, React.ComponentType<any>> = {
			// Basic Input Types
			text: InputText,
			email: InputText,
			password: InputText,
			number: InputText,
			url: InputText,
			search: InputText,

			// Date & Time Types
			date: Calendar,
			datetime: Calendar,
			time: Calendar,
			month: Calendar,
			week: Calendar,
			year: Calendar,

			// Text Area Types
			textarea: InputTextarea,
			'rich-text': InputTextarea,
			markdown: InputTextarea,

			// Selection Types
			select: Dropdown,
			multiselect: Dropdown, // Will be handled with multiple prop
			checkbox: Checkbox,
			radio: RadioButton,
			yesno: RadioButton,
			toggle: RadioButton, // Will be handled with toggle styling

			// Financial Types
			money: InputMask,
			percentage: InputText,
			currency: InputMask,

			// Contact Types
			phone: InputMask,
			address: InputText,
			country: Dropdown,
			state: Dropdown,
			zipcode: InputText,

			// File & Media Types
			file: FileUpload,
			image: FileUpload,
			signature: InputText,
			audio: FileUpload,
			video: FileUpload,

			// Rating & Scale Types
			rating: InputText, // Will be handled with custom component
			slider: InputText, // Will be handled with custom component
			range: InputText, // Will be handled with custom component
			likert: RadioButton, // Will be handled with custom styling

			// Specialized Types
			color: InputText, // Will be handled with color picker
			tags: InputText, // Will be handled with chips component
			autocomplete: InputText, // Will be handled with autocomplete
			location: InputText, // Will be handled with location picker
			matrix: InputText, // Will be handled with matrix component
		}

		return componentMap[fieldType] || InputText
	}

	/**
	 * Gets component props for a field type
	 */
	static getComponentProps(
		field: FormField,
		control: unknown,
		errors: unknown
	): Record<string, unknown> {
		const errorsObj = errors as Record<string, unknown>
		const controlObj = control as Record<
			string,
			{ value: unknown; onChange: (value: unknown) => void; onBlur: () => void }
		>
		const baseProps = {
			placeholder: field.placeholder,
			className: `w-full ${errorsObj?.[field.id] ? 'p-invalid' : ''}`,
			disabled: false,
		}

		switch (field.type) {
			case 'text':
			case 'email':
			case 'password':
			case 'number':
			case 'url':
			case 'search':
				return {
					...baseProps,
					type: field.type,
					value: controlObj?.[field.id]?.value || '',
					onChange: (e: any) =>
						controlObj?.[field.id]?.onChange(e.target.value),
					onBlur: controlObj?.[field.id]?.onBlur,
				}

			case 'textarea':
				return {
					...baseProps,
					rows: 4,
					value: control?.[field.id]?.value || '',
					onChange: (e: any) => control?.[field.id]?.onChange(e.target.value),
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'date':
				return {
					...baseProps,
					showIcon: true,
					dateFormat: 'mm/dd/yy',
					value: control?.[field.id]?.value,
					onChange: control?.[field.id]?.onChange,
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'select':
				return {
					...baseProps,
					options: field.options || [],
					value: control?.[field.id]?.value,
					onChange: control?.[field.id]?.onChange,
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'checkbox':
				return {
					...baseProps,
					options: field.options || [],
					value: control?.[field.id]?.value || [],
					onChange: control?.[field.id]?.onChange,
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'radio':
			case 'yesno':
				return {
					...baseProps,
					options: field.type === 'yesno' ? ['Yes', 'No'] : field.options || [],
					value: control?.[field.id]?.value,
					onChange: control?.[field.id]?.onChange,
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'money':
				return {
					...baseProps,
					mask: '999,999,999.99',
					value: control?.[field.id]?.value || '',
					onChange: (e: any) => control?.[field.id]?.onChange(e.target.value),
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'phone':
				return {
					...baseProps,
					mask: '(999) 999-9999',
					value: control?.[field.id]?.value || '',
					onChange: (e: any) => control?.[field.id]?.onChange(e.target.value),
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'address':
				return {
					...baseProps,
					value: control?.[field.id]?.value || '',
					onChange: (e: any) => control?.[field.id]?.onChange(e.target.value),
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'file':
				return {
					...baseProps,
					mode: 'basic',
					accept:
						field.allowedExtensions?.join(',') ||
						'.pdf,.doc,.docx,.jpg,.jpeg,.png,.txt',
					maxFileSize: field.maxFileSize || 1000000,
					customUpload: true,
					uploadHandler: (event: any) => {
						control?.[field.id]?.onChange(event.files[0]?.name || '')
					},
					auto: true,
					chooseLabel: 'Choose File',
				}

			case 'signature':
				return {
					...baseProps,
					value: control?.[field.id]?.value || '',
					onChange: (e: any) => control?.[field.id]?.onChange(e.target.value),
					onBlur: control?.[field.id]?.onBlur,
				}

			default:
				return {
					...baseProps,
					value: control?.[field.id]?.value || '',
					onChange: (e: any) => control?.[field.id]?.onChange(e.target.value),
					onBlur: control?.[field.id]?.onBlur,
				}
		}
	}

	/**
	 * Sanitizes field data for storage
	 */
	static sanitizeFieldData(field: FormField): FormField {
		return {
			...field,
			label: field.label?.trim() || '',
			placeholder: field.placeholder?.trim() || undefined,
			options:
				field.options?.map(opt => opt.trim()).filter(opt => opt.length > 0) ||
				undefined,
		}
	}

	/**
	 * Generates default options for field types that need them
	 */
	static generateDefaultOptions(fieldType: FieldType): string[] | undefined {
		switch (fieldType) {
			case 'yesno':
				return ['Yes', 'No']
			default:
				return undefined
		}
	}

	/**
	 * Gets validation rules for a field type
	 */
	static getValidationRules(field: FormField): Record<string, unknown> {
		const rules: Record<string, any> = {}

		if (field.required) {
			rules.required = `${field.label} is required`
		}

		switch (field.type) {
			case 'email':
				rules.pattern = {
					value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
					message: 'Please enter a valid email address',
				}
				break

			case 'phone':
				rules.pattern = {
					value: /^[\+]?[1-9][\d]{0,15}$/,
					message: 'Please enter a valid phone number',
				}
				break

			case 'number':
				rules.pattern = {
					value: /^\d+$/,
					message: 'Please enter a valid number',
				}
				break
		}

		return rules
	}

	/**
	 * Transforms field value for display
	 */
	static transformValueForDisplay(field: FormField, value: unknown): string {
		if (value === null || value === undefined) return ''

		switch (field.type) {
			case 'date':
				return value instanceof Date
					? value.toLocaleDateString()
					: String(value)
			case 'checkbox':
				return Array.isArray(value) ? value.join(', ') : String(value)
			default:
				return String(value)
		}
	}

	/**
	 * Transforms field value for storage
	 */
	static transformValueForStorage(field: FormField, value: unknown): unknown {
		switch (field.type) {
			case 'number':
				return value ? Number(value) : null
			case 'date':
				return value instanceof Date ? value : value ? new Date(value) : null
			case 'checkbox':
				return Array.isArray(value) ? value : value ? [value] : []
			default:
				return value
		}
	}
}
