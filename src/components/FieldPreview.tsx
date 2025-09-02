'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { FieldMCP, MCPLogger } from '@/lib/mcp'
import { FormField, FieldType } from '@/types'
import { FIELD_TYPES } from '@/constants'

interface FieldPreviewProps {
	field: FormField
	className?: string
}

export default function FieldPreview({ field, className = '' }: FieldPreviewProps) {
	const [previewValue, setPreviewValue] = useState<unknown>('')
	const [previewError, setPreviewError] = useState<string>('')
	const [isValid, setIsValid] = useState<boolean>(true)
	const [validationMessage, setValidationMessage] = useState<string>('')

	const generateSampleValue = useCallback((fieldType: FieldType): unknown => {
		switch (fieldType) {
			case 'text':
			case 'email':
			case 'password':
			case 'url':
			case 'search':
				return 'Sample text'
			case 'number':
			case 'money':
			case 'percentage':
			case 'currency':
				return '123'
			case 'phone':
				return '(555) 123-4567'
			case 'date':
			case 'datetime':
			case 'time':
			case 'month':
			case 'week':
			case 'year':
				return new Date()
			case 'textarea':
			case 'rich-text':
			case 'markdown':
				return 'This is a sample text area content that shows how the field will look when rendered.'
			case 'select':
			case 'radio':
			case 'yesno':
				return field.options?.[0] || 'Option 1'
			case 'checkbox':
				return field.options?.slice(0, 2) || ['Option 1', 'Option 2']
			case 'multiselect':
				return field.options?.slice(0, 2) || ['Option 1', 'Option 2']
			case 'toggle':
				return true
			case 'address':
				return '123 Main St, City, State 12345'
			case 'country':
				return 'United States'
			case 'state':
				return 'California'
			case 'zipcode':
				return '12345'
			case 'file':
			case 'image':
			case 'audio':
			case 'video':
				return 'sample-file.pdf'
			case 'signature':
				return 'John Doe'
			case 'rating':
			case 'slider':
			case 'range':
				return 5
			case 'likert':
				return 'Agree'
			case 'color':
				return '#3B82F6'
			case 'tags':
				return ['tag1', 'tag2', 'tag3']
			case 'autocomplete':
				return 'Sample autocomplete value'
			case 'location':
				return 'New York, NY'
			case 'matrix':
				return { row1: 'col1', row2: 'col2' }
			default:
				return 'Sample value'
		}
	}, [field.options])

	// Generate sample value based on field type
	useEffect(() => {
		const sampleValue = generateSampleValue(field.type)
		setPreviewValue(sampleValue)
	}, [field.type, generateSampleValue])

	// Validate field configuration
	useEffect(() => {
		const validation = FieldMCP.validateField(field)
		if (!validation.success) {
			setPreviewError(validation.errors?.[0]?.message || 'Invalid field configuration')
			setIsValid(false)
		} else {
			setPreviewError('')
			setIsValid(true)
		}
	}, [field])

	// Validate field value
	useEffect(() => {
		if (previewValue !== '') {
			const validation = FieldMCP.validateFieldValue(field, previewValue)
			if (!validation.success) {
				setValidationMessage(validation.errors?.[0]?.message || 'Invalid value')
				setIsValid(false)
			} else {
				setValidationMessage('')
				setIsValid(true)
			}
		}
	}, [field, previewValue])

	const renderPreview = () => {
		try {
			const result = FieldMCP.render({
				field,
				control: {
					[field.id]: {
						value: previewValue,
						onChange: (newValue: unknown) => setPreviewValue(newValue),
						onBlur: () => {},
					},
				},
				errors: previewError ? { [field.id]: { message: previewError } } : {},
			})

			if (!result.success) {
				MCPLogger.error('FieldPreview.render', result.errors?.[0] || new Error('Rendering failed'))
				return (
					<div className="p-error p-3 rounded">
						Failed to render field preview: {result.errors?.[0]?.message}
					</div>
				)
			}

			const { Component, componentProps } = result.data!
			return <Component {...componentProps} />
		} catch (error) {
			MCPLogger.error('FieldPreview.render', error as Error)
			return (
				<div className="p-error p-3 rounded">
					Error rendering field preview: {(error as Error).message}
				</div>
			)
		}
	}

	const getFieldTypeInfo = () => {
		const fieldTypeConfig = FIELD_TYPES.find(ft => ft.value === field.type)
		return fieldTypeConfig || { label: field.type, category: 'unknown' }
	}

	return (
		<Card className={`field-preview ${className}`}>
			<div className="mb-3">
				<div className="flex justify-between items-center mb-2">
					<h4 className="text-lg font-semibold text-white">Field Preview</h4>
					<div className="flex items-center gap-2">
						<span className={`px-2 py-1 rounded text-xs ${
							isValid ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
						}`}>
							{isValid ? 'Valid' : 'Invalid'}
						</span>
						<span className="px-2 py-1 rounded text-xs bg-blue-600 text-white">
							{getFieldTypeInfo().label}
						</span>
					</div>
				</div>
				
				<div className="text-sm text-gray-400 mb-3">
					<strong>Label:</strong> {field.label}
					{field.required && <span className="text-red-400 ml-1">*</span>}
					{field.placeholder && (
						<>
							<br />
							<strong>Placeholder:</strong> {field.placeholder}
						</>
					)}
					{field.options && field.options.length > 0 && (
						<>
							<br />
							<strong>Options:</strong> {field.options.join(', ')}
						</>
					)}
				</div>
			</div>

			{previewError && (
				<Message severity="error" text={previewError} className="mb-3" />
			)}

			<div className="field-preview-render mb-3">
				<label className="block text-sm font-medium text-gray-300 mb-2">
					{field.label}
					{field.required && <span className="text-red-400 ml-1">*</span>}
				</label>
				{renderPreview()}
			</div>

			{validationMessage && (
				<Message severity="warn" text={validationMessage} className="mb-3" />
			)}

			<div className="flex gap-2">
				<Button
					label="Test Validation"
					icon="pi pi-check"
					className="p-button-sm p-button-outlined"
					onClick={() => {
						const validation = FieldMCP.validateFieldValue(field, previewValue)
						if (validation.success) {
							MCPLogger.debug('FieldPreview.testValidation', 'Field value validation passed', {
								field: field.id,
								value: previewValue,
							})
						} else {
							MCPLogger.error('FieldPreview.testValidation', validation.errors?.[0] || new Error('Validation failed'))
						}
					}}
				/>
				<Button
					label="Reset Sample"
					icon="pi pi-refresh"
					className="p-button-sm p-button-outlined"
					onClick={() => {
						const sampleValue = generateSampleValue(field.type)
						setPreviewValue(sampleValue)
						MCPLogger.debug('FieldPreview.resetSample', 'Sample value reset', {
							field: field.id,
							value: sampleValue,
						})
					}}
				/>
			</div>
		</Card>
	)
}
