'use client'

import React, { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Checkbox } from 'primereact/checkbox'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { Badge } from 'primereact/badge'
import { FormField, FieldType } from '@/types'

interface PropertiesPanelProps {
	selectedField: FormField | null
	onFieldUpdate: (field: FormField) => void
	onFieldRemove: (fieldId: string) => void
	className?: string
}

export default function PropertiesPanel({
	selectedField,
	onFieldUpdate,
	onFieldRemove,
	className = '',
}: PropertiesPanelProps) {
	const [fieldData, setFieldData] = useState<FormField | null>(null)
	const [optionsText, setOptionsText] = useState('')

	// Update local state when selected field changes
	useEffect(() => {
		if (selectedField) {
			setFieldData({ ...selectedField })
			setOptionsText(selectedField.options?.join(', ') || '')
		} else {
			setFieldData(null)
			setOptionsText('')
		}
	}, [selectedField])

	const handleFieldUpdate = () => {
		if (!fieldData) return

		// Parse options if they exist
		if (optionsText.trim()) {
			fieldData.options = optionsText
				.split(',')
				.map(opt => opt.trim())
				.filter(opt => opt)
		} else {
			fieldData.options = undefined
		}

		onFieldUpdate(fieldData)
	}

	const handleFieldRemove = () => {
		if (!fieldData) return
		onFieldRemove(fieldData.id)
	}

	const handleInputChange = (field: keyof FormField, value: unknown) => {
		if (!fieldData) return
		setFieldData({ ...fieldData, [field]: value })
	}

	const handleValidationChange = (validationField: string, value: unknown) => {
		if (!fieldData) return
		setFieldData({
			...fieldData,
			validation: {
				...fieldData.validation,
				[validationField]: value,
			},
		})
	}

	const getFieldTypeInfo = (fieldType: FieldType) => {
		const typeInfo = {
			text: { name: 'Text Input', description: 'Single-line text input' },
			email: { name: 'Email', description: 'Email address input' },
			password: {
				name: 'Password',
				description: 'Password input with masking',
			},
			number: { name: 'Number', description: 'Numeric input' },
			url: { name: 'URL', description: 'URL input with validation' },
			search: { name: 'Search', description: 'Search input field' },
			date: { name: 'Date', description: 'Date picker' },
			datetime: { name: 'Date & Time', description: 'Date and time picker' },
			time: { name: 'Time', description: 'Time picker' },
			month: { name: 'Month', description: 'Month picker' },
			week: { name: 'Week', description: 'Week picker' },
			year: { name: 'Year', description: 'Year picker' },
			textarea: { name: 'Text Area', description: 'Multi-line text input' },
			'rich-text': { name: 'Rich Text', description: 'Rich text editor' },
			markdown: { name: 'Markdown', description: 'Markdown editor' },
			select: { name: 'Dropdown', description: 'Single selection dropdown' },
			multiselect: {
				name: 'Multi-Select',
				description: 'Multiple selection dropdown',
			},
			checkbox: {
				name: 'Checkbox Group',
				description: 'Multiple selection checkboxes',
			},
			radio: {
				name: 'Radio Buttons',
				description: 'Single selection radio buttons',
			},
			yesno: { name: 'Yes/No', description: 'Yes or No question' },
			toggle: { name: 'Toggle Switch', description: 'On/Off toggle switch' },
			money: { name: 'Money/Currency', description: 'Currency input' },
			percentage: { name: 'Percentage', description: 'Percentage input' },
			currency: { name: 'Currency', description: 'Currency input with symbol' },
			phone: { name: 'Phone Number', description: 'Phone number input' },
			address: { name: 'Address', description: 'Address input' },
			country: { name: 'Country', description: 'Country selection' },
			state: { name: 'State/Province', description: 'State selection' },
			zipcode: { name: 'ZIP/Postal Code', description: 'ZIP code input' },
			file: { name: 'File Upload', description: 'File upload' },
			image: { name: 'Image Upload', description: 'Image upload' },
			signature: { name: 'Signature', description: 'Digital signature' },
			audio: { name: 'Audio Upload', description: 'Audio upload' },
			video: { name: 'Video Upload', description: 'Video upload' },
			rating: { name: 'Rating', description: 'Star rating' },
			slider: { name: 'Slider', description: 'Range slider' },
			range: { name: 'Range', description: 'Range input' },
			likert: { name: 'Likert Scale', description: 'Likert scale rating' },
			color: { name: 'Color Picker', description: 'Color selection' },
			tags: { name: 'Tags', description: 'Tag input' },
			autocomplete: { name: 'Autocomplete', description: 'Autocomplete input' },
			location: { name: 'Location', description: 'Location picker' },
			matrix: { name: 'Matrix', description: 'Matrix question' },
		}

		return (
			typeInfo[fieldType] || {
				name: fieldType,
				description: 'Unknown field type',
			}
		)
	}

	const requiresOptions = (fieldType: FieldType) => {
		return [
			'select',
			'multiselect',
			'checkbox',
			'radio',
			'yesno',
			'autocomplete',
			'likert',
			'matrix',
		].includes(fieldType)
	}

	const hasFileUpload = (fieldType: FieldType) => {
		return ['file', 'image', 'audio', 'video'].includes(fieldType)
	}

	const hasValidation = (fieldType: FieldType) => {
		return !['search'].includes(fieldType)
	}

	if (!selectedField || !fieldData) {
		return (
			<Card className={`h-full ${className}`}>
				<div className='p-4 text-center'>
					<div className='mb-4'>
						<i className='pi pi-cog text-4xl text-gray-500' />
					</div>
					<h3 className='text-lg font-medium text-gray-300 mb-2'>
						Field Properties
					</h3>
					<p className='text-gray-500'>Select a field to edit its properties</p>
				</div>
			</Card>
		)
	}

	const fieldTypeInfo = getFieldTypeInfo(fieldData.type)

	return (
		<Card className={`h-full ${className}`}>
			<div className='p-4 border-b border-gray-600'>
				<div className='flex items-center justify-between mb-2'>
					<h3 className='text-lg font-semibold text-white'>Field Properties</h3>
					<Button
						icon='pi pi-trash'
						className='p-button-text p-button-sm text-red-400 hover:text-red-300'
						onClick={handleFieldRemove}
						tooltip='Delete Field'
					/>
				</div>
				<div className='flex items-center gap-2'>
					<Badge value={fieldTypeInfo.name} severity='info' />
					<span className='text-sm text-gray-400'>
						{fieldTypeInfo.description}
					</span>
				</div>
			</div>

			<div className='p-4 space-y-4 overflow-auto'>
				{/* Basic Properties */}
				<div className='space-y-3'>
					<h4 className='text-sm font-medium text-gray-300 flex items-center gap-2'>
						<i className='pi pi-info-circle' />
						Basic Properties
					</h4>

					<div className='field'>
						<label
							htmlFor='fieldLabel'
							className='block text-sm font-medium text-gray-300 mb-1'
						>
							Label
						</label>
						<InputText
							id='fieldLabel'
							value={fieldData.label}
							onChange={e => handleInputChange('label', e.target.value)}
							className='w-full'
							placeholder='Field label...'
						/>
					</div>

					<div className='field'>
						<label
							htmlFor='fieldPlaceholder'
							className='block text-sm font-medium text-gray-300 mb-1'
						>
							Placeholder
						</label>
						<InputText
							id='fieldPlaceholder'
							value={fieldData.placeholder || ''}
							onChange={e => handleInputChange('placeholder', e.target.value)}
							className='w-full'
							placeholder='Placeholder text...'
						/>
					</div>

					<div className='field'>
						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='fieldRequired'
								checked={fieldData.required}
								onChange={e => handleInputChange('required', e.checked)}
							/>
							<label
								htmlFor='fieldRequired'
								className='text-sm font-medium text-gray-300'
							>
								Required Field
							</label>
						</div>
					</div>
				</div>

				<Divider />

				{/* Options (for select, radio, checkbox, etc.) */}
				{requiresOptions(fieldData.type) && (
					<div className='space-y-3'>
						<h4 className='text-sm font-medium text-gray-300 flex items-center gap-2'>
							<i className='pi pi-list' />
							Options
						</h4>

						<div className='field'>
							<label
								htmlFor='fieldOptions'
								className='block text-sm font-medium text-gray-300 mb-1'
							>
								Options (comma-separated)
							</label>
							<InputTextarea
								id='fieldOptions'
								value={optionsText}
								onChange={e => setOptionsText(e.target.value)}
								className='w-full'
								rows={3}
								placeholder='Option 1, Option 2, Option 3...'
							/>
						</div>
					</div>
				)}

				{/* File Upload Settings */}
				{hasFileUpload(fieldData.type) && (
					<div className='space-y-3'>
						<h4 className='text-sm font-medium text-gray-300 flex items-center gap-2'>
							<i className='pi pi-upload' />
							File Settings
						</h4>

						<div className='field'>
							<label
								htmlFor='maxFileSize'
								className='block text-sm font-medium text-gray-300 mb-1'
							>
								Max File Size (bytes)
							</label>
							<InputText
								id='maxFileSize'
								type='number'
								value={fieldData.maxFileSize || ''}
								onChange={e =>
									handleInputChange(
										'maxFileSize',
										parseInt(e.target.value) || undefined
									)
								}
								className='w-full'
								placeholder='5000000'
							/>
						</div>

						<div className='field'>
							<label
								htmlFor='allowedExtensions'
								className='block text-sm font-medium text-gray-300 mb-1'
							>
								Allowed Extensions (comma-separated)
							</label>
							<InputText
								id='allowedExtensions'
								value={fieldData.allowedExtensions?.join(', ') || ''}
								onChange={e =>
									handleInputChange(
										'allowedExtensions',
										e.target.value
											.split(',')
											.map(ext => ext.trim())
											.filter(ext => ext)
									)
								}
								className='w-full'
								placeholder='.pdf, .doc, .docx'
							/>
						</div>
					</div>
				)}

				{/* Validation Settings */}
				{hasValidation(fieldData.type) && (
					<div className='space-y-3'>
						<h4 className='text-sm font-medium text-gray-300 flex items-center gap-2'>
							<i className='pi pi-check-circle' />
							Validation
						</h4>

						{fieldData.type === 'number' && (
							<div className='grid'>
								<div className='col-6'>
									<div className='field'>
										<label
											htmlFor='validationMin'
											className='block text-sm font-medium text-gray-300 mb-1'
										>
											Min Value
										</label>
										<InputText
											id='validationMin'
											type='number'
											value={fieldData.validation?.min || ''}
											onChange={e =>
												handleValidationChange(
													'min',
													parseFloat(e.target.value) || undefined
												)
											}
											className='w-full'
											placeholder='0'
										/>
									</div>
								</div>
								<div className='col-6'>
									<div className='field'>
										<label
											htmlFor='validationMax'
											className='block text-sm font-medium text-gray-300 mb-1'
										>
											Max Value
										</label>
										<InputText
											id='validationMax'
											type='number'
											value={fieldData.validation?.max || ''}
											onChange={e =>
												handleValidationChange(
													'max',
													parseFloat(e.target.value) || undefined
												)
											}
											className='w-full'
											placeholder='100'
										/>
									</div>
								</div>
							</div>
						)}

						<div className='field'>
							<label
								htmlFor='validationPattern'
								className='block text-sm font-medium text-gray-300 mb-1'
							>
								Pattern (Regex)
							</label>
							<InputText
								id='validationPattern'
								value={fieldData.validation?.pattern || ''}
								onChange={e =>
									handleValidationChange('pattern', e.target.value)
								}
								className='w-full'
								placeholder='^[a-zA-Z0-9]+$'
							/>
						</div>
					</div>
				)}

				{/* Custom Properties */}
				{fieldData.type === 'money' && (
					<div className='space-y-3'>
						<h4 className='text-sm font-medium text-gray-300 flex items-center gap-2'>
							<i className='pi pi-dollar' />
							Currency Settings
						</h4>

						<div className='field'>
							<label
								htmlFor='currency'
								className='block text-sm font-medium text-gray-300 mb-1'
							>
								Currency
							</label>
							<InputText
								id='currency'
								value={fieldData.currency || ''}
								onChange={e => handleInputChange('currency', e.target.value)}
								className='w-full'
								placeholder='USD'
							/>
						</div>
					</div>
				)}

				{fieldData.type === 'address' && (
					<div className='space-y-3'>
						<h4 className='text-sm font-medium text-gray-300 flex items-center gap-2'>
							<i className='pi pi-map-marker' />
							Address Settings
						</h4>

						<div className='field'>
							<label
								htmlFor='addressType'
								className='block text-sm font-medium text-gray-300 mb-1'
							>
								Address Type
							</label>
							<Dropdown
								id='addressType'
								value={fieldData.addressType || 'full'}
								options={[
									{ label: 'Full Address', value: 'full' },
									{ label: 'Street Only', value: 'street' },
									{ label: 'City Only', value: 'city' },
									{ label: 'State Only', value: 'state' },
									{ label: 'ZIP Only', value: 'zip' },
								]}
								onChange={e => handleInputChange('addressType', e.value)}
								className='w-full'
							/>
						</div>
					</div>
				)}

				{/* Save Button */}
				<div className='pt-4'>
					<Button
						label='Update Field'
						icon='pi pi-check'
						onClick={handleFieldUpdate}
						className='w-full'
					/>
				</div>
			</div>
		</Card>
	)
}
