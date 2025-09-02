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
			console.log('🎨 FieldMCP: Starting field rendering...')
			console.log('🏷️ Field ID:', props.field.id)
			console.log('📝 Field label:', props.field.label)
			console.log('🔧 Field type:', props.field.type)
			console.log('✅ Required:', props.field.required)

			// Validate field
			console.log('🔍 Validating field configuration...')
			const fieldValidation = FieldMCP.validateField(props.field)
			if (!fieldValidation.success) {
				console.error('❌ Field validation failed:', fieldValidation.errors)
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
			console.log('✅ Field validation passed')

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
		const fieldsRequiringOptions: FieldType[] = [
			'select',
			'radio',
			'checkbox',
			'multiselect',
			'likert',
		]
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

			// Additional field types
			case 'datetime':
				return {
					...baseProps,
					showIcon: true,
					showTime: true,
					dateFormat: field.dateFormat || 'mm/dd/yy',
					value: control?.[field.id]?.value,
					onChange: control?.[field.id]?.onChange,
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'time':
				return {
					...baseProps,
					showIcon: true,
					timeOnly: true,
					dateFormat: field.timeFormat === '24h' ? 'HH:mm' : 'hh:mm tt',
					value: control?.[field.id]?.value,
					onChange: control?.[field.id]?.onChange,
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'month':
				return {
					...baseProps,
					showIcon: true,
					view: 'month',
					dateFormat: 'mm/yy',
					value: control?.[field.id]?.value,
					onChange: control?.[field.id]?.onChange,
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'week':
				return {
					...baseProps,
					showIcon: true,
					view: 'week',
					dateFormat: 'yy-W',
					value: control?.[field.id]?.value,
					onChange: control?.[field.id]?.onChange,
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'year':
				return {
					...baseProps,
					showIcon: true,
					view: 'year',
					dateFormat: 'yy',
					value: control?.[field.id]?.value,
					onChange: control?.[field.id]?.onChange,
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'rich-text':
			case 'markdown':
				return {
					...baseProps,
					rows: field.textareaRows || 6,
					value: control?.[field.id]?.value || '',
					onChange: (e: any) => control?.[field.id]?.onChange(e.target.value),
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'multiselect':
				return {
					...baseProps,
					options: field.options || [],
					multiple: true,
					value: control?.[field.id]?.value || [],
					onChange: control?.[field.id]?.onChange,
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'toggle':
				return {
					...baseProps,
					options: field.toggleLabels
						? [field.toggleLabels.on, field.toggleLabels.off]
						: ['On', 'Off'],
					value: control?.[field.id]?.value,
					onChange: control?.[field.id]?.onChange,
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'percentage':
				return {
					...baseProps,
					type: 'number',
					step: 0.01,
					suffix: '%',
					value: control?.[field.id]?.value || '',
					onChange: (e: any) => control?.[field.id]?.onChange(e.target.value),
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'currency':
				return {
					...baseProps,
					mask: '999,999,999.99',
					prefix: field.currency || '$',
					value: control?.[field.id]?.value || '',
					onChange: (e: any) => control?.[field.id]?.onChange(e.target.value),
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'country':
				return {
					...baseProps,
					options: [
						'United States',
						'Canada',
						'Mexico',
						'United Kingdom',
						'Germany',
						'France',
						'Australia',
						'Japan',
						'China',
						'India',
					],
					value: control?.[field.id]?.value,
					onChange: control?.[field.id]?.onChange,
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'state':
				return {
					...baseProps,
					options: [
						'Alabama',
						'Alaska',
						'Arizona',
						'Arkansas',
						'California',
						'Colorado',
						'Connecticut',
						'Delaware',
						'Florida',
						'Georgia',
					],
					value: control?.[field.id]?.value,
					onChange: control?.[field.id]?.onChange,
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'zipcode':
				return {
					...baseProps,
					mask: '99999',
					value: control?.[field.id]?.value || '',
					onChange: (e: any) => control?.[field.id]?.onChange(e.target.value),
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'image':
				return {
					...baseProps,
					mode: 'basic',
					accept:
						field.allowedExtensions?.join(',') || '.jpg,.jpeg,.png,.gif,.webp',
					maxFileSize: field.maxFileSize || 5000000,
					customUpload: true,
					uploadHandler: (event: any) => {
						control?.[field.id]?.onChange(event.files[0]?.name || '')
					},
					auto: true,
					chooseLabel: 'Choose Image',
				}

			case 'audio':
				return {
					...baseProps,
					mode: 'basic',
					accept: '.mp3,.wav,.ogg,.m4a',
					maxFileSize: field.maxFileSize || 10000000,
					customUpload: true,
					uploadHandler: (event: any) => {
						control?.[field.id]?.onChange(event.files[0]?.name || '')
					},
					auto: true,
					chooseLabel: 'Choose Audio File',
				}

			case 'video':
				return {
					...baseProps,
					mode: 'basic',
					accept: '.mp4,.avi,.mov,.wmv,.flv',
					maxFileSize: field.maxFileSize || 50000000,
					customUpload: true,
					uploadHandler: (event: any) => {
						control?.[field.id]?.onChange(event.files[0]?.name || '')
					},
					auto: true,
					chooseLabel: 'Choose Video File',
				}

			case 'rating':
				return {
					...baseProps,
					type: 'number',
					min: 1,
					max: field.ratingMax || 5,
					value: control?.[field.id]?.value || '',
					onChange: (e: any) => control?.[field.id]?.onChange(e.target.value),
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'slider':
				return {
					...baseProps,
					type: 'range',
					min: field.sliderMin || 0,
					max: field.sliderMax || 100,
					step: field.sliderStep || 1,
					value: control?.[field.id]?.value || '',
					onChange: (e: any) => control?.[field.id]?.onChange(e.target.value),
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'range':
				return {
					...baseProps,
					type: 'range',
					min: field.rangeMin || 0,
					max: field.rangeMax || 100,
					step: field.rangeStep || 1,
					value: control?.[field.id]?.value || '',
					onChange: (e: any) => control?.[field.id]?.onChange(e.target.value),
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'likert':
				return {
					...baseProps,
					options: field.likertScale || [
						'Strongly Disagree',
						'Disagree',
						'Neutral',
						'Agree',
						'Strongly Agree',
					],
					value: control?.[field.id]?.value,
					onChange: control?.[field.id]?.onChange,
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'color':
				return {
					...baseProps,
					type: 'color',
					value: control?.[field.id]?.value || '#000000',
					onChange: (e: any) => control?.[field.id]?.onChange(e.target.value),
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'tags':
				return {
					...baseProps,
					value: control?.[field.id]?.value || '',
					onChange: (e: any) => control?.[field.id]?.onChange(e.target.value),
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'autocomplete':
				return {
					...baseProps,
					value: control?.[field.id]?.value || '',
					onChange: (e: any) => control?.[field.id]?.onChange(e.target.value),
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'location':
				return {
					...baseProps,
					value: control?.[field.id]?.value || '',
					onChange: (e: any) => control?.[field.id]?.onChange(e.target.value),
					onBlur: control?.[field.id]?.onBlur,
				}

			case 'matrix':
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
			case 'likert':
				return [
					'Strongly Disagree',
					'Disagree',
					'Neutral',
					'Agree',
					'Strongly Agree',
				]
			case 'tags':
				return ['tag1', 'tag2', 'tag3']
			case 'select':
			case 'radio':
			case 'checkbox':
			case 'multiselect':
				return ['Option 1', 'Option 2', 'Option 3']
			case 'country':
				return [
					'United States',
					'Canada',
					'Mexico',
					'United Kingdom',
					'Germany',
					'France',
					'Australia',
					'Japan',
					'China',
					'India',
				]
			case 'state':
				return [
					'Alabama',
					'Alaska',
					'Arizona',
					'Arkansas',
					'California',
					'Colorado',
					'Connecticut',
					'Delaware',
					'Florida',
					'Georgia',
				]
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
			case 'percentage':
			case 'rating':
				rules.pattern = {
					value: /^\d+(\.\d+)?$/,
					message: 'Please enter a valid number',
				}
				if (field.validation?.min !== undefined) {
					rules.min = {
						value: field.validation.min,
						message: `Minimum value is ${field.validation.min}`,
					}
				}
				if (field.validation?.max !== undefined) {
					rules.max = {
						value: field.validation.max,
						message: `Maximum value is ${field.validation.max}`,
					}
				}
				break

			case 'url':
				rules.pattern = {
					value: /^https?:\/\/.+/,
					message: 'Please enter a valid URL starting with http:// or https://',
				}
				break

			case 'zipcode':
				rules.pattern = {
					value: /^\d{5}(-\d{4})?$/,
					message: 'Please enter a valid ZIP code',
				}
				break

			case 'money':
			case 'currency':
				rules.pattern = {
					value: /^\$?[\d,]+(\.\d{2})?$/,
					message: 'Please enter a valid monetary amount',
				}
				break

			case 'color':
				rules.pattern = {
					value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
					message: 'Please enter a valid color code (e.g., #FF0000)',
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
			case 'datetime':
			case 'time':
			case 'month':
			case 'week':
			case 'year':
				return value instanceof Date
					? value.toLocaleDateString()
					: String(value)
			case 'checkbox':
			case 'multiselect':
				return Array.isArray(value) ? value.join(', ') : String(value)
			case 'money':
			case 'currency':
				return typeof value === 'number'
					? `$${value.toFixed(2)}`
					: String(value)
			case 'percentage':
				return typeof value === 'number' ? `${value}%` : String(value)
			case 'color':
				return typeof value === 'string' && value.startsWith('#')
					? value
					: String(value)
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
			case 'percentage':
			case 'rating':
			case 'slider':
			case 'range':
				return value ? Number(value) : null
			case 'date':
			case 'datetime':
			case 'time':
			case 'month':
			case 'week':
			case 'year':
				return value instanceof Date ? value : value ? new Date(value) : null
			case 'checkbox':
			case 'multiselect':
				return Array.isArray(value) ? value : value ? [value] : []
			case 'money':
			case 'currency':
				return value ? Number(String(value).replace(/[^0-9.-]/g, '')) : null
			case 'color':
				return typeof value === 'string' ? value : null
			default:
				return value
		}
	}
}
