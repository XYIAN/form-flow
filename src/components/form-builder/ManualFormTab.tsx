/**
 * Manual Form Builder Tab Component
 *
 * Handles manual form field creation and editing
 */

import { useState } from 'react'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { FieldType, FormField } from '@/types'
import { FIELD_TYPES, FIELD_CATEGORIES } from '@/constants'

interface ManualFormTabProps {
	title: string
	setTitle: (title: string) => void
	description: string
	setDescription: (description: string) => void
	fields: Array<{
		id: string
		label: string
		type: FieldType
		required: boolean
		placeholder?: string
		options?: string[]
	}>
	onAddField: (field: FormField) => void
	onUpdateField: (fieldId: string, updates: Partial<FormField>) => void
	onDeleteField: (fieldId: string) => void
	onSaveForm: () => void
	isLoading: boolean
}

export default function ManualFormTab({
	title,
	setTitle,
	description,
	setDescription,
	fields,
	onAddField,
	onUpdateField,
	onDeleteField,
	onSaveForm,
	isLoading,
}: ManualFormTabProps) {
	const [editingField, setEditingField] = useState<FormField | null>(null)
	const [fieldLabel, setFieldLabel] = useState('')
	const [fieldType, setFieldType] = useState<FieldType>('text')
	const [fieldRequired, setFieldRequired] = useState(false)
	const [fieldPlaceholder, setFieldPlaceholder] = useState('')
	const [fieldOptions, setFieldOptions] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<string>('basic')

	const resetFieldForm = () => {
		setEditingField(null)
		setFieldLabel('')
		setFieldType('text')
		setFieldRequired(false)
		setFieldPlaceholder('')
		setFieldOptions('')
		setSelectedCategory('basic')
	}

	const handleAddField = () => {
		if (!fieldLabel.trim()) return

		console.log('➕ Manual Form: Adding new field...')
		console.log('📝 Field label:', fieldLabel.trim())
		console.log('🔧 Field type:', fieldType)
		console.log('✅ Required:', fieldRequired)
		console.log('📋 Placeholder:', fieldPlaceholder.trim() || 'None')

		const options = fieldOptions
			.split(',')
			.map(opt => opt.trim())
			.filter(opt => opt)

		if (options.length > 0) {
			console.log('📊 Field options:', options)
		}

		const newField = {
			id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			label: fieldLabel.trim(),
			type: fieldType,
			required: fieldRequired,
			placeholder: fieldPlaceholder.trim() || undefined,
			options: options.length > 0 ? options : undefined,
		}

		console.log('✅ Field created successfully:', newField)
		onAddField(newField)
		resetFieldForm()
	}

	const handleEditField = (field: FormField) => {
		setEditingField(field)
		setFieldLabel(field.label)
		setFieldType(field.type)
		setFieldRequired(field.required)
		setFieldPlaceholder(field.placeholder || '')
		setFieldOptions(field.options ? field.options.join(', ') : '')

		// Find category for field type
		const fieldTypeData = FIELD_TYPES.find(ft => ft.value === field.type)
		setSelectedCategory(fieldTypeData?.category || 'basic')
	}

	const handleUpdateField = () => {
		if (!editingField || !fieldLabel.trim()) return

		const options = fieldOptions
			.split(',')
			.map(opt => opt.trim())
			.filter(opt => opt)

		const updatedField = {
			...editingField,
			label: fieldLabel.trim(),
			type: fieldType,
			required: fieldRequired,
			placeholder: fieldPlaceholder.trim() || undefined,
			options: options.length > 0 ? options : undefined,
		}

		onUpdateField(editingField.id, updatedField)
		resetFieldForm()
	}

	const filteredFieldTypes = FIELD_TYPES.filter(
		ft => ft.category === selectedCategory
	)

	return (
		<div className='space-y-4'>
			{/* Form Details */}
			<Card title='Form Details' className='w-full'>
				<div className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-white mb-2'>
							Form Title
						</label>
						<InputText
							value={title}
							onChange={e => setTitle(e.target.value)}
							placeholder='Enter form title...'
							className='w-full'
						/>
					</div>
					<div>
						<label className='block text-sm font-medium text-white mb-2'>
							Form Description
						</label>
						<InputTextarea
							value={description}
							onChange={e => setDescription(e.target.value)}
							placeholder='Enter form description...'
							rows={3}
							className='w-full'
						/>
					</div>
				</div>
			</Card>

			{/* Field Builder */}
			<Card title='Add Field' className='w-full'>
				<div className='space-y-4'>
					{/* Category Selection */}
					<div>
						<label className='block text-sm font-medium text-white mb-2'>
							Field Category
						</label>
						<Dropdown
							value={selectedCategory}
							options={FIELD_CATEGORIES.map(cat => ({
								label: cat.name,
								value: cat.id,
							}))}
							onChange={e => setSelectedCategory(e.value)}
							placeholder='Select category'
							className='w-full'
						/>
					</div>

					{/* Field Type Selection */}
					<div>
						<label className='block text-sm font-medium text-white mb-2'>
							Field Type
						</label>
						<Dropdown
							value={fieldType}
							options={filteredFieldTypes.map(ft => ({
								label: ft.label,
								value: ft.value,
							}))}
							onChange={e => setFieldType(e.value)}
							placeholder='Select field type'
							className='w-full'
						/>
					</div>

					{/* Field Label */}
					<div>
						<label className='block text-sm font-medium text-white mb-2'>
							Field Label
						</label>
						<InputText
							value={fieldLabel}
							onChange={e => setFieldLabel(e.target.value)}
							placeholder='Enter field label...'
							className='w-full'
						/>
					</div>

					{/* Field Placeholder */}
					<div>
						<label className='block text-sm font-medium text-white mb-2'>
							Placeholder Text
						</label>
						<InputText
							value={fieldPlaceholder}
							onChange={e => setFieldPlaceholder(e.target.value)}
							placeholder='Enter placeholder text...'
							className='w-full'
						/>
					</div>

					{/* Field Options (for select, radio, checkbox fields) */}
					{['select', 'radio', 'checkbox', 'multiselect'].includes(
						fieldType
					) && (
						<div>
							<label className='block text-sm font-medium text-white mb-2'>
								Options (comma-separated)
							</label>
							<InputTextarea
								value={fieldOptions}
								onChange={e => setFieldOptions(e.target.value)}
								placeholder='Option 1, Option 2, Option 3...'
								rows={3}
								className='w-full'
							/>
						</div>
					)}

					{/* Required Checkbox */}
					<div className='flex items-center space-x-2'>
						<Checkbox
							inputId='required'
							checked={fieldRequired}
							onChange={e => setFieldRequired(e.checked || false)}
						/>
						<label htmlFor='required' className='text-white'>
							Required field
						</label>
					</div>

					{/* Action Buttons */}
					<div className='flex space-x-2'>
						{editingField ? (
							<>
								<Button
									label='Update Field'
									icon='pi pi-check'
									onClick={handleUpdateField}
									className='p-button-success'
								/>
								<Button
									label='Cancel'
									icon='pi pi-times'
									onClick={resetFieldForm}
									className='p-button-secondary'
								/>
							</>
						) : (
							<Button
								label='Add Field'
								icon='pi pi-plus'
								onClick={handleAddField}
								className='p-button-primary'
								disabled={!fieldLabel.trim()}
							/>
						)}
					</div>
				</div>
			</Card>

			{/* Fields List */}
			{fields.length > 0 && (
				<Card title='Form Fields' className='w-full'>
					<div className='space-y-2'>
						{fields.map((field, index) => (
							<div
								key={field.id}
								className='p-3 bg-gray-800 rounded flex justify-between items-center'
							>
								<div>
									<span className='font-medium text-white'>
										{index + 1}. {field.label}
									</span>
									<span className='ml-2 text-sm text-gray-400'>
										({field.type})
									</span>
									{field.required && (
										<span className='ml-2 text-red-400'>*</span>
									)}
								</div>
								<div className='flex space-x-2'>
									<Button
										icon='pi pi-pencil'
										onClick={() => handleEditField(field)}
										className='p-button-text p-button-sm'
										tooltip='Edit field'
									/>
									<Button
										icon='pi pi-trash'
										onClick={() => onDeleteField(field.id)}
										className='p-button-text p-button-sm p-button-danger'
										tooltip='Delete field'
									/>
								</div>
							</div>
						))}
					</div>
				</Card>
			)}

			{/* Save Form Button */}
			<div className='flex justify-end'>
				<Button
					label='Save Form'
					icon='pi pi-save'
					onClick={onSaveForm}
					className='p-button-primary'
					disabled={isLoading || !title.trim() || fields.length === 0}
				/>
			</div>
		</div>
	)
}
