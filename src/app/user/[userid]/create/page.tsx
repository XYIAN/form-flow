'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { FileUpload } from 'primereact/fileupload'
import { Message } from 'primereact/message'
import { useAuth } from '@/context/AuthContext'
import { useForms } from '@/context/FormContext'
import { FormField, FieldType } from '@/types'
import { FIELD_TYPES, FIELD_CATEGORIES } from '@/constants'
import { generateId } from '@/utils'
import { FieldMCP, MCPLogger } from '@/lib/mcp'
import Navigation from '@/components/Navigation'
import FieldPreview from '@/components/FieldPreview'

interface CreateFormProps {
	params: Promise<{
		userid: string
	}>
}

export default function CreateForm({ params }: CreateFormProps) {
	const { user, isAuthenticated } = useAuth()
	const { createForm, errors: formErrors, warnings: formWarnings } = useForms()
	const router = useRouter()
	const [activeTab, setActiveTab] = useState<
		'manual' | 'csv' | 'components' | 'layouts' | 'templates'
	>('manual')
	const [resolvedParams, setResolvedParams] = useState<{
		userid: string
	} | null>(null)
	const hasRedirected = useRef(false)

	// Form data
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [fields, setFields] = useState<FormField[]>([])

	// Field editing
	const [editingField, setEditingField] = useState<FormField | null>(null)
	const [fieldLabel, setFieldLabel] = useState('')
	const [fieldType, setFieldType] = useState<FieldType>('text')
	const [fieldRequired, setFieldRequired] = useState(false)
	const [fieldPlaceholder, setFieldPlaceholder] = useState('')
	const [fieldOptions, setFieldOptions] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<string>('basic')

	// CSV data
	const [csvHeaders, setCsvHeaders] = useState<string[]>([])
	const [csvTitle, setCsvTitle] = useState('')
	const [csvDescription, setCsvDescription] = useState('')

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

		if (user.email !== resolvedParams.userid) {
			hasRedirected.current = true
			router.push(`/user/${user.email}/create`)
			return
		}
	}, [isAuthenticated, user, resolvedParams, router])

	const handleAddField = () => {
		if (!fieldLabel.trim()) {
			setError('Field label is required')
			return
		}

		// Create field object
		const newField: FormField = {
			id: generateId(),
			label: fieldLabel.trim(),
			type: fieldType,
			required: fieldRequired,
			placeholder: fieldPlaceholder.trim() || undefined,
			options: fieldOptions.trim()
				? fieldOptions.split(',').map(opt => opt.trim())
				: FieldMCP.generateDefaultOptions(fieldType),
		}

		console.log('Adding field:', newField)

		// Validate field using MCP
		const validation = FieldMCP.validateField(newField)
		console.log('Field validation result:', validation)

		if (!validation.success) {
			const errorMessages = validation.errors?.map(e => e.message) || [
				'Invalid field configuration',
			]
			setError(errorMessages.join(', '))
			MCPLogger.error(
				'handleAddField',
				validation.errors?.[0] || new Error('Field validation failed')
			)
			return
		}

		// Sanitize field data
		const sanitizedField = FieldMCP.sanitizeFieldData(newField)
		console.log('Sanitized field:', sanitizedField)

		setFields(prev => [...prev, sanitizedField])
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
		// Set the category based on the field type
		const fieldTypeConfig = FIELD_TYPES.find(ft => ft.value === field.type)
		if (fieldTypeConfig) {
			setSelectedCategory(fieldTypeConfig.category)
		}
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
				: FieldMCP.generateDefaultOptions(fieldType),
		}

		// Validate field using MCP
		const validation = FieldMCP.validateField(updatedField)
		if (!validation.success) {
			const errorMessages = validation.errors?.map(e => e.message) || [
				'Invalid field configuration',
			]
			setError(errorMessages.join(', '))
			MCPLogger.error(
				'handleUpdateField',
				validation.errors?.[0] || new Error('Field validation failed')
			)
			return
		}

		// Sanitize field data
		const sanitizedField = FieldMCP.sanitizeFieldData(updatedField)

		setFields(prev =>
			prev.map(f => (f.id === editingField.id ? sanitizedField : f))
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
		setSelectedCategory('basic')
	}

	const handleCsvUpload = (event: { files: File[] }) => {
		const file = event.files[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = e => {
			const content = e.target?.result as string
			const lines = content.split('\n')
			if (lines.length > 0) {
				const headers = lines[0]
					.split(',')
					.map(h => h.trim())
					.filter(h => h)
				setCsvHeaders(headers)
			}
		}
		reader.readAsText(file)
	}

	const handleCreateFromCsv = () => {
		if (!csvTitle.trim()) {
			setError('Form title is required')
			return
		}

		if (fields.length === 0) {
			setError('Please upload and process a CSV file first')
			return
		}

		handleSaveForm(csvTitle, csvDescription, fields)
	}

	const handleSaveForm = (
		formTitle: string,
		formDescription: string,
		formFields: FormField[]
	) => {
		if (!formTitle.trim()) {
			setError('Form title is required')
			return
		}

		if (formFields.length === 0) {
			setError('At least one field is required. Please add fields to your form before creating it.')
			return
		}

		if (!resolvedParams) {
			setError('Invalid user session')
			return
		}

		// Check if user and user ID exist
		if (!user || !user.id) {
			console.error('User object:', user)
			setError('User session is invalid. Please log in again.')
			return
		}

		// Debug logging
		console.log('Creating form with:', {
			title: formTitle,
			description: formDescription,
			fields: formFields,
			userId: user.id,
			user: user
		})

		// Additional validation logging
		console.log('Form validation check:', {
			hasTitle: !!formTitle.trim(),
			titleLength: formTitle.trim().length,
			hasDescription: !!formDescription.trim(),
			descriptionLength: formDescription.trim().length,
			fieldsCount: formFields.length,
			fieldsValid: formFields.every(field => field.label && field.type),
			userValid: !!user && !!user.id
		})

		setIsLoading(true)
		try {
			createForm(
				{
					title: formTitle.trim(),
					description: formDescription.trim() || undefined,
					fields: formFields,
				},
				user!.id
			)

			// Redirect back to dashboard to show the new form in the list
			router.push(`/user/${resolvedParams.userid}?created=true`)
		} catch {
			setError('Failed to create form. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	const handleSaveManualForm = () => {
		console.log('Saving manual form with:', {
			title,
			description,
			fields,
			user: user,
			userId: user?.id
		})
		handleSaveForm(title, description, fields)
	}

	if (!isAuthenticated || !user || !resolvedParams) {
		return null
	}

	return (
		<div className='form-flow-container'>
			<Navigation userEmail={user.email} companyName={user.companyName} />

			<div className='p-4'>
				<div className='w-full max-w-7xl mx-auto'>
					<div className='grid'>
						<div className='col-12 lg:col-8'>
							<div className='flex justify-between items-center mb-4'>
								<h2 className='text-2xl font-bold text-white'>
									Create New Form
								</h2>
								<Button
									label='Back to Dashboard'
									icon='pi pi-arrow-left'
									className='p-button-outlined p-button-secondary'
									onClick={() => router.push(`/user/${resolvedParams.userid}`)}
								/>
							</div>

							<div className='flex gap-4 mb-4'>
								<Button
									label='Manual Creation'
									icon='pi pi-pencil'
									className={
										activeTab === 'manual'
											? 'p-button-primary'
											: 'p-button-outlined'
									}
									onClick={() => setActiveTab('manual')}
								/>
								<Button
									label='CSV Upload'
									icon='pi pi-upload'
									className={
										activeTab === 'csv'
											? 'p-button-primary'
											: 'p-button-outlined'
									}
									onClick={() => setActiveTab('csv')}
								/>
							</div>

							{error && (
								<Message severity='error' text={error} className='mb-4' />
							)}

							{activeTab === 'manual' ? (
								<div className='flex flex-col w-full'>
									{/* Instructions */}
									<div className='mb-4 p-4 bg-blue-900/20 border border-blue-700/30 rounded'>
										<div className='flex items-start gap-3'>
											<i className='pi pi-info-circle text-blue-400 text-xl mt-0.5'></i>
											<div className='text-blue-200 text-sm'>
												<h4 className='font-medium mb-2'>How to create a form:</h4>
												<ol className='list-decimal list-inside space-y-1 text-blue-100'>
													<li>Enter a form title and description</li>
													<li>Add at least one field using the form builder below</li>
													<li>Click &quot;Create Form&quot; when you&apos;re ready</li>
												</ol>
											</div>
										</div>
									</div>

									<Card className='form-flow-card mb-4'>
										<h3 className='text-xl font-semibold text-white mb-4'>
											Form Details
										</h3>
										<div className='field mb-3'>
											<label
												htmlFor='title'
												className='block text-sm font-medium text-gray-300 mb-2'
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
										<div className='field mb-3'>
											<label
												htmlFor='description'
												className='block text-sm font-medium text-gray-300 mb-2'
											>
												Description
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
									</Card>

									<Card className='form-flow-card'>
										<h3 className='text-xl font-semibold text-white mb-4'>
											Form Fields {fields.length > 0 && <span className='text-sm text-gray-400'>({fields.length} field{fields.length !== 1 ? 's' : ''} added)</span>}
										</h3>
										{fields.length > 0 && (
											<div className='mb-4'>
												{fields.map((field, index) => (
													<div
														key={field.id}
														className='flex justify-between items-center p-3 bg-gray-800 rounded mb-2'
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
														<div className='flex gap-2'>
															<Button
																icon='pi pi-pencil'
																className='p-button-sm p-button-outlined'
																onClick={() => handleEditField(field)}
															/>
															<Button
																icon='pi pi-trash'
																className='p-button-sm p-button-outlined p-button-danger'
																onClick={() => handleDeleteField(field.id)}
															/>
														</div>
													</div>
												))}
											</div>
										)}

										{fields.length === 0 && (
											<div className='mb-4 p-4 bg-gray-800 rounded border border-gray-600'>
												<div className='text-center text-gray-400'>
													<i className='pi pi-info-circle text-xl mb-2'></i>
													<p className='text-sm'>No fields added yet. Add at least one field below to create your form.</p>
												</div>
											</div>
										)}

										<div className='border-t border-gray-700 pt-4'>
											<h4 className='text-lg font-medium text-white mb-3'>
												{editingField ? 'Edit Field' : 'Add New Field'}
											</h4>
											<div className='flex flex-wrap gap-4'>
												<div className='w-full md:w-1/2'>
													<label className='block text-sm font-medium text-gray-300 mb-2'>
														Field Label *
													</label>
													<InputText
														value={fieldLabel}
														onChange={e => setFieldLabel(e.target.value)}
														placeholder='Enter field label'
														className='w-full'
													/>
												</div>
												<div className='w-full md:w-1/2'>
													<label className='block text-sm font-medium text-gray-300 mb-2'>
														Field Category
													</label>
													<Dropdown
														value={selectedCategory}
														options={FIELD_CATEGORIES}
														onChange={e => {
															setSelectedCategory(e.value)
															// Reset field type when category changes
															const categoryTypes = FIELD_TYPES.filter(
																ft => ft.category === e.value
															)
															if (categoryTypes.length > 0) {
																setFieldType(categoryTypes[0].value)
															}
														}}
														optionLabel='name'
														optionValue='id'
														placeholder='Select category'
														className='w-full'
													/>
												</div>
												<div className='w-full md:w-1/2'>
													<label className='block text-sm font-medium text-gray-300 mb-2'>
														Field Type
													</label>
													<Dropdown
														value={fieldType}
														options={FIELD_TYPES.filter(
															ft => ft.category === selectedCategory
														)}
														onChange={e => setFieldType(e.value)}
														optionLabel='label'
														optionValue='value'
														placeholder='Select field type'
														className='w-full'
													/>
												</div>
												<div className='w-full md:w-1/2'>
													<label className='block text-sm font-medium text-gray-300 mb-2'>
														Placeholder
													</label>
													<InputText
														value={fieldPlaceholder}
														onChange={e => setFieldPlaceholder(e.target.value)}
														placeholder='Enter placeholder text'
														className='w-full'
													/>
												</div>
												<div className='w-full md:w-1/2'>
													<label className='block text-sm font-medium text-gray-300 mb-2'>
														Required
													</label>
													<div className='flex items-center'>
														<input
															type='checkbox'
															checked={fieldRequired}
															onChange={e => setFieldRequired(e.target.checked)}
															className='mr-2'
														/>
														<span className='text-gray-300'>
															Make this field required
														</span>
													</div>
												</div>
												{(fieldType === 'select' ||
													fieldType === 'radio' ||
													fieldType === 'checkbox' ||
													fieldType === 'yesno') && (
													<div className='w-full'>
														<label className='block text-sm font-medium text-gray-300 mb-2'>
															{fieldType === 'yesno'
																? 'Yes/No options (auto-filled)'
																: 'Options (comma-separated)'}
														</label>
														<InputText
															value={fieldOptions}
															onChange={e => setFieldOptions(e.target.value)}
															placeholder={
																fieldType === 'yesno'
																	? `Yes, No (auto-filled)`
																	: 'Option 1, Option 2, Option 3'
															}
															className='w-full'
															disabled={fieldType === 'yesno'}
														/>
													</div>
												)}
											</div>

											<div className='flex gap-2 mt-4'>
												{editingField ? (
													<>
														<Button
															label='Update Field'
															icon='pi pi-check'
															onClick={handleUpdateField}
															className='p-button-primary'
														/>
														<Button
															label='Cancel'
															icon='pi pi-times'
															className='p-button-outlined'
															onClick={resetFieldForm}
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
									</Card>

									{/* Field Preview */}
									{(fieldLabel || editingField) && (
										<FieldPreview
											field={{
												id: editingField?.id || 'preview-field',
												label:
													fieldLabel || editingField?.label || 'Preview Field',
												type: fieldType,
												required: fieldRequired,
												placeholder: fieldPlaceholder || undefined,
												options: fieldOptions.trim()
													? fieldOptions.split(',').map(opt => opt.trim())
													: FieldMCP.generateDefaultOptions(fieldType),
											}}
											className='mt-4'
										/>
									)}

									<div className='flex justify-end mt-4'>
										<Button
											label='Create Form'
											icon='pi pi-save'
											onClick={handleSaveManualForm}
											className='p-button-primary'
											disabled={isLoading || fields.length === 0}
											tooltip={fields.length === 0 ? 'Add at least one field before creating the form' : ''}
										/>
									</div>
								</div>
							) : activeTab === 'csv' ? (
								<Card className='form-flow-card'>
									<h3 className='text-xl font-semibold text-white mb-4'>
										Create Form from CSV
									</h3>

									<div className='field mb-4'>
										<label className='block text-sm font-medium text-gray-300 mb-2'>
											Upload CSV File
										</label>
										<FileUpload
											mode='basic'
											name='csv'
											accept='.csv'
											maxFileSize={1000000}
											customUpload
											uploadHandler={handleCsvUpload}
											auto
											chooseLabel='Choose CSV File'
											className='w-full'
										/>
										<small className='text-gray-400'>
											Upload a CSV file with headers. The first row will be used
											as field labels.
										</small>
									</div>

									{csvHeaders.length > 0 && (
										<>
											<div className='field mb-3'>
												<label
													htmlFor='csvTitle'
													className='block text-sm font-medium text-gray-300 mb-2'
												>
													Form Title *
												</label>
												<InputText
													id='csvTitle'
													value={csvTitle}
													onChange={e => setCsvTitle(e.target.value)}
													placeholder='Enter form title'
													className='w-full'
												/>
											</div>

											<div className='field mb-3'>
												<label
													htmlFor='csvDescription'
													className='block text-sm font-medium text-gray-300 mb-2'
												>
													Description
												</label>
												<InputTextarea
													id='csvDescription'
													value={csvDescription}
													onChange={e => setCsvDescription(e.target.value)}
													placeholder='Enter form description (optional)'
													rows={3}
													className='w-full'
												/>
											</div>

											<div className='mb-4'>
												<h4 className='text-lg font-medium text-white mb-2'>
													Detected Fields:
												</h4>
												<div className='grid'>
													{csvHeaders.map((header, index) => (
														<div
															key={index}
															className='col-12 md:col-6 lg:col-4'
														>
															<div className='p-3 bg-gray-800 rounded'>
																<span className='text-white'>
																	{index + 1}. {header}
																</span>
															</div>
														</div>
													))}
												</div>
											</div>

											{/* Generated Fields Preview */}
											{fields.length > 0 && (
												<div className='mb-4'>
													<h4 className='text-lg font-medium text-white mb-2'>
														Generated Form Fields:
													</h4>
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
																<div className='text-sm text-gray-300'>
																	{field.placeholder && (
																		<span>
																			Placeholder: {field.placeholder}
																		</span>
																	)}
																	{field.options &&
																		field.options.length > 0 && (
																			<span className='ml-2'>
																				Options: {field.options.length}
																			</span>
																		)}
																</div>
															</div>
														))}
													</div>
												</div>
											)}

											{/* CSV Analysis Results */}
											{/* The following block was removed as per the edit hint */}
											{/*
											{csvAnalysis && (
												<div className='mb-4'>
													<h4 className='text-lg font-medium text-white mb-2'>
														Data Analysis:
													</h4>
													<div className='grid'>
														<div className='col-12 md:col-6'>
															<div className='p-3 bg-gray-800 rounded'>
																<div className='text-sm text-gray-300 mb-1'>
																	Data Quality
																</div>
																<div className='text-white'>
																	Completeness:{' '}
																	{Math.round(
																		(
																			csvAnalysis as {
																				quality: { completeness: number }
																			}
																		).quality.completeness * 100
																	)}
																	%
																</div>
																<div className='text-white'>
																	Consistency:{' '}
																	{Math.round(
																		(
																			csvAnalysis as {
																				quality: { consistency: number }
																			}
																		).quality.consistency * 100
																	)}
																	%
																</div>
															</div>
														</div>
														<div className='col-12 md:col-6'>
															<div className='p-3 bg-gray-800 rounded'>
																<div className='text-sm text-gray-300 mb-1'>
																	Field Types Detected
																</div>
																<div className='text-white'>
																	{Object.entries(
																		(
																			csvAnalysis as {
																				dataTypes: Array<{
																					detectedType: string
																				}>
																			}
																		).dataTypes.reduce(
																			(
																				acc: Record<string, number>,
																				dt: { detectedType: string }
																			) => {
																				acc[dt.detectedType] =
																					(acc[dt.detectedType] || 0) + 1
																				return acc
																			},
																			{}
																		)
																	).map(([type, count]) => (
																		<div key={type}>
																			{type}: {count as number}
																		</div>
																	))}
																</div>
															</div>
														</div>
													</div>
												</div>
											)}
											*/}

											<div className='flex justify-content-end'>
												<Button
													label={
														isLoading
															? 'Processing CSV...'
															: 'Create Form from CSV'
													}
													icon={
														isLoading
															? 'pi pi-spin pi-spinner'
															: 'pi pi-save'
													}
													onClick={handleCreateFromCsv}
													className='p-button-primary'
													disabled={
														isLoading ||
														fields.length === 0
													}
												/>
											</div>
										</>
									)}
								</Card>
							) : null}
						</div>

						{/* MCP Status and Performance Panel */}
						<div className='col-12 lg:col-4'>
							<div className='space-y-4'>
								{/* Temporarily disabled MCP components for debugging
								<MCPStatusIndicator
									operation='Field Validation'
									status={mcpStatus}
									executionTime={mcpExecutionTime}
									error={mcpError}
								/>

								<MCPPerformanceDisplay />

								<MCPHealthDashboard />

								<MCPErrorDisplay
									errors={formErrors.map(error => ({
										code: 'FORM_ERROR' as const,
										message: error,
										timestamp: new Date(),
									}))}
									warnings={formWarnings}
								/>
								*/}
								
								{/* Simple debug info */}
								<div className='p-4 bg-gray-800 rounded'>
									<h4 className='text-white font-medium mb-2'>Debug Info</h4>
									<div className='text-sm text-gray-300 space-y-1'>
										<div>User ID: {user?.id || 'undefined'}</div>
										<div>Fields Count: {fields.length}</div>
										<div>Form Errors: {formErrors.length}</div>
										<div>Form Warnings: {formWarnings.length}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
