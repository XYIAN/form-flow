'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { useAuth } from '@/context/AuthContext'
import { useForms } from '@/context/FormContext'
import { FormField, FieldType, Form } from '@/types'
import { FIELD_TYPES } from '@/constants'
import { generateId } from '@/utils'
import Navigation from '@/components/Navigation'

interface EditFormProps {
	params: Promise<{
		userid: string
		formid: string
	}>
}

export default function EditForm({ params }: EditFormProps) {
	const { user, isAuthenticated } = useAuth()
	const { getFormById, updateForm } = useForms()
	const router = useRouter()
	const [resolvedParams, setResolvedParams] = useState<{
		userid: string
		formid: string
	} | null>(null)
	const hasRedirected = useRef(false)

	// Form data
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [fields, setFields] = useState<FormField[]>([])
	const [originalForm, setOriginalForm] = useState<Form | null>(null)

	// Field editing
	const [editingField, setEditingField] = useState<FormField | null>(null)
	const [fieldLabel, setFieldLabel] = useState('')
	const [fieldType, setFieldType] = useState<FieldType>('text')
	const [fieldRequired, setFieldRequired] = useState(false)
	const [fieldPlaceholder, setFieldPlaceholder] = useState('')
	const [fieldOptions, setFieldOptions] = useState('')

	// UI state
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	// Resolve params promise
	useEffect(() => {
		params.then(resolved => {
			setResolvedParams(resolved)
		})
	}, [params])

	// Redirect if not authenticated or wrong user
	useEffect(() => {
		if (hasRedirected.current) return

		if (!isAuthenticated || !user || !resolvedParams) {
			if (!isAuthenticated || !user) {
				hasRedirected.current = true
				router.push('/')
			}
			return
		}

		// Decode the userid from URL to compare with user email
		const decodedUserid = decodeURIComponent(resolvedParams.userid)
		if (user.email !== decodedUserid) {
			hasRedirected.current = true
			router.push(`/user/${user.email}`)
			return
		}

		// Load existing form data
		const existingForm = getFormById(resolvedParams.formid)
		if (!existingForm) {
			setError('Form not found')
			return
		}

		if (existingForm.userId !== user.id) {
			setError('You do not have permission to edit this form')
			return
		}

		setOriginalForm(existingForm)
		setTitle(existingForm.title)
		setDescription(existingForm.description || '')
		setFields(existingForm.fields)
	}, [isAuthenticated, user, resolvedParams, getFormById])

	const handleAddField = () => {
		if (!fieldLabel.trim()) {
			setError('Field label is required')
			return
		}

		// Set default options for certain field types
		let defaultOptions: string[] | undefined
		let defaultPlaceholder = fieldPlaceholder.trim() || undefined

		switch (fieldType) {
			case 'yesno':
				defaultOptions = ['Yes', 'No']
				break
			case 'money':
				defaultPlaceholder =
					defaultPlaceholder || 'Enter amount (e.g., 1,234.56)'
				break
			case 'phone':
				defaultPlaceholder = defaultPlaceholder || '(555) 123-4567'
				break
			case 'address':
				defaultPlaceholder = defaultPlaceholder || 'Enter full address'
				break
			case 'file':
				defaultPlaceholder =
					defaultPlaceholder || 'Upload file (PDF, DOC, JPG, etc.)'
				break
			case 'signature':
				defaultPlaceholder = defaultPlaceholder || 'Type your full name to sign'
				break
		}

		const newField: FormField = {
			id: generateId(),
			label: fieldLabel.trim(),
			type: fieldType,
			required: fieldRequired,
			placeholder: defaultPlaceholder,
			options: fieldOptions.trim()
				? fieldOptions.split(',').map(opt => opt.trim())
				: defaultOptions,
		}

		setFields(prev => [...prev, newField])
		resetFieldForm()
		setError('')
	}

	const handleEditField = (field: FormField) => {
		setEditingField(field)
		setFieldLabel(field.label)
		setFieldType(field.type)
		setFieldRequired(field.required)
		setFieldPlaceholder(field.placeholder || '')
		setFieldOptions(field.options?.join(', ') || '')
	}

	const handleUpdateField = () => {
		if (!editingField || !fieldLabel.trim()) {
			setError('Field label is required')
			return
		}

		const updatedField: FormField = {
			...editingField,
			label: fieldLabel.trim(),
			type: fieldType,
			required: fieldRequired,
			placeholder: fieldPlaceholder.trim() || undefined,
			options: fieldOptions.trim()
				? fieldOptions.split(',').map(opt => opt.trim())
				: undefined,
		}

		setFields(prev =>
			prev.map(f => (f.id === editingField.id ? updatedField : f))
		)
		resetFieldForm()
		setError('')
	}

	const handleDeleteField = (fieldId: string) => {
		setFields(prev => prev.filter(f => f.id !== fieldId))
	}

	const resetFieldForm = () => {
		setEditingField(null)
		setFieldLabel('')
		setFieldType('text')
		setFieldRequired(false)
		setFieldPlaceholder('')
		setFieldOptions('')
	}

	const handleSaveForm = (
		formTitle: string,
		formDescription: string,
		formFields: FormField[]
	) => {
		if (!originalForm || !resolvedParams) return

		const formData: Partial<Form> = {
			title: formTitle,
			description: formDescription,
			fields: formFields,
			updatedAt: new Date(),
		}

		updateForm(originalForm.id, formData)
		router.push(`/user/${resolvedParams.userid}`)
	}

	const handleSaveManualForm = () => {
		if (!title.trim()) {
			setError('Form title is required')
			return
		}

		if (fields.length === 0) {
			setError('At least one field is required')
			return
		}

		setIsLoading(true)
		setError('')

		// Simulate API call
		setTimeout(() => {
			handleSaveForm(title, description, fields)
			setIsLoading(false)
		}, 500)
	}

	const handleCancel = () => {
		if (!resolvedParams) return
		router.push(`/user/${resolvedParams.userid}`)
	}

	if (!isAuthenticated || !user || !resolvedParams) {
		return null
	}

	if (error && !originalForm) {
		return (
			<div className='form-flow-container'>
				<Navigation userEmail={user.email} companyName={user.companyName} />
				<div className='p-4'>
					<div className='max-w-4xl mx-auto'>
						<Message severity='error' text={error} className='mb-4' />
						<Button
							label='Back to Dashboard'
							icon='pi pi-arrow-left'
							onClick={() => router.push(`/user/${resolvedParams.userid}`)}
							className='p-button-secondary'
						/>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='form-flow-container'>
			<Navigation userEmail={user.email} companyName={user.companyName} />

			<div className='p-4'>
				<div className='max-w-4xl mx-auto'>
					<div className='flex justify-content-between align-items-center mb-4'>
						<h2 className='text-2xl font-bold text-white'>Edit Form</h2>
						<div className='flex gap-2'>
							<Button
								label='Cancel'
								icon='pi pi-times'
								onClick={handleCancel}
								className='p-button-secondary'
							/>
							<Button
								label='Save Form'
								icon='pi pi-check'
								onClick={handleSaveManualForm}
								loading={isLoading}
								className='p-button-primary'
							/>
						</div>
					</div>

					{error && <Message severity='error' text={error} className='mb-4' />}

					<Card className='form-flow-card'>
						<div className='mb-4'>
							<label
								htmlFor='title'
								className='block text-white font-semibold mb-2'
							>
								Form Title *
							</label>
							<InputText
								id='title'
								value={title}
								onChange={e => setTitle(e.target.value)}
								placeholder='Enter form title'
								className='w-full'
							/>
						</div>

						<div className='mb-6'>
							<label
								htmlFor='description'
								className='block text-white font-semibold mb-2'
							>
								Form Description
							</label>
							<InputTextarea
								id='description'
								value={description}
								onChange={e => setDescription(e.target.value)}
								placeholder='Enter form description (optional)'
								rows={3}
								className='w-full'
							/>
						</div>

						<div className='mb-6'>
							<h3 className='text-xl font-semibold text-white mb-4'>
								Form Fields
							</h3>

							{fields.length > 0 && (
								<div className='mb-4'>
									{fields.map(field => (
										<div
											key={field.id}
											className='border border-gray-600 rounded p-3 mb-3'
										>
											<div className='flex justify-content-between align-items-center'>
												<div className='flex-1'>
													<div className='font-semibold text-white'>
														{field.label}
													</div>
													<div className='text-sm text-gray-400'>
														Type: {field.type} | Required:{' '}
														{field.required ? 'Yes' : 'No'}
													</div>
													{field.placeholder && (
														<div className='text-sm text-gray-400'>
															Placeholder: {field.placeholder}
														</div>
													)}
													{field.options && field.options.length > 0 && (
														<div className='text-sm text-gray-400'>
															Options: {field.options.join(', ')}
														</div>
													)}
												</div>
												<div className='flex gap-2'>
													<Button
														icon='pi pi-pencil'
														className='p-button-sm p-button-outlined p-button-secondary'
														onClick={() => handleEditField(field)}
														tooltip='Edit Field'
													/>
													<Button
														icon='pi pi-trash'
														className='p-button-sm p-button-outlined p-button-danger'
														onClick={() => handleDeleteField(field.id)}
														tooltip='Delete Field'
													/>
												</div>
											</div>
										</div>
									))}
								</div>
							)}

							<div className='border border-gray-600 rounded p-4'>
								<h4 className='text-lg font-semibold text-white mb-3'>
									{editingField ? 'Edit Field' : 'Add New Field'}
								</h4>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
									<div>
										<label
											htmlFor='fieldLabel'
											className='block text-white font-semibold mb-2'
										>
											Field Label *
										</label>
										<InputText
											id='fieldLabel'
											value={fieldLabel}
											onChange={e => setFieldLabel(e.target.value)}
											placeholder='Enter field label'
											className='w-full'
										/>
									</div>

									<div>
										<label
											htmlFor='fieldType'
											className='block text-white font-semibold mb-2'
										>
											Field Type
										</label>
										<Dropdown
											id='fieldType'
											value={fieldType}
											options={FIELD_TYPES}
											onChange={e => setFieldType(e.value)}
											placeholder='Select field type'
											className='w-full'
										/>
									</div>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
									<div>
										<label
											htmlFor='fieldPlaceholder'
											className='block text-white font-semibold mb-2'
										>
											Placeholder Text
										</label>
										<InputText
											id='fieldPlaceholder'
											value={fieldPlaceholder}
											onChange={e => setFieldPlaceholder(e.target.value)}
											placeholder='Enter placeholder text'
											className='w-full'
										/>
									</div>

									<div>
										<label
											htmlFor='fieldOptions'
											className='block text-white font-semibold mb-2'
										>
											Options (comma-separated)
										</label>
										<InputText
											id='fieldOptions'
											value={fieldOptions}
											onChange={e => setFieldOptions(e.target.value)}
											placeholder='Option 1, Option 2, Option 3'
											className='w-full'
											disabled={
												!['select', 'checkbox', 'radio', 'yesno'].includes(
													fieldType
												)
											}
										/>
									</div>
								</div>

								<div className='mb-4'>
									<div className='flex align-items-center'>
										<input
											type='checkbox'
											id='fieldRequired'
											checked={fieldRequired}
											onChange={e => setFieldRequired(e.target.checked)}
											className='mr-2'
										/>
										<label htmlFor='fieldRequired' className='text-white'>
											This field is required
										</label>
									</div>
								</div>

								<div className='flex gap-2'>
									{editingField ? (
										<>
											<Button
												label='Update Field'
												icon='pi pi-check'
												onClick={handleUpdateField}
												className='p-button-primary'
											/>
											<Button
												label='Cancel Edit'
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
										/>
									)}
								</div>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	)
}
