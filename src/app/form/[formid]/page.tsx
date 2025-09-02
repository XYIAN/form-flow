'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Message } from 'primereact/message'
import { useForms } from '@/context/FormContext'
import { Form, FormField } from '@/types'
import { FieldMCP, SubmissionMCP, MCPLogger } from '@/lib/mcp'

interface FormViewPageProps {
	params: Promise<{
		formid: string
	}>
}

export default function FormViewPage({ params }: FormViewPageProps) {
	const { getFormById } = useForms()
	const router = useRouter()
	const [form, setForm] = useState<Form | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [showSubmissionModal, setShowSubmissionModal] = useState(false)
	const [submittedData, setSubmittedData] = useState<
		Record<string, string | number | boolean | string[] | Date>
	>({})
	const [error, setError] = useState('')
	const [resolvedParams, setResolvedParams] = useState<{
		formid: string
	} | null>(null)

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm()

	// Resolve params promise
	useEffect(() => {
		params.then(resolved => {
			setResolvedParams(resolved)
		})
	}, [params])

	// Load form data
	useEffect(() => {
		if (!resolvedParams) return

		const foundForm = getFormById(resolvedParams.formid)
		if (!foundForm) {
			setError('Form not found')
			setIsLoading(false)
			return
		}

		setForm(foundForm)
		setIsLoading(false)
	}, [resolvedParams, getFormById])

	const onSubmit = (
		data: Record<string, string | number | boolean | string[] | Date>
	) => {
		if (!form) return

		// Use MCP to validate and process submission
		const validationContext = {
			form,
			submissionData: data,
			fieldErrors: errors,
		}

		const validationResult = SubmissionMCP.validateSubmission(validationContext)

		if (!validationResult.success) {
			MCPLogger.error(
				'onSubmit',
				validationResult.errors?.[0] ||
					new Error('Submission validation failed')
			)
			setError('Form submission failed. Please check your inputs.')
			return
		}

		if (!validationResult.data?.isValid) {
			setError('Please fix the errors in the form before submitting.')
			return
		}

		// Process submission using MCP
		const processResult = SubmissionMCP.processSubmission(form, data)

		if (!processResult.success) {
			MCPLogger.error(
				'onSubmit',
				processResult.errors?.[0] || new Error('Submission processing failed')
			)
			setError('Failed to process form submission.')
			return
		}

		// Format data for display using MCP
		const formattedData = SubmissionMCP.formatSubmissionForDisplay(
			form,
			processResult.data!
		)

		setSubmittedData(formattedData)
		setShowSubmissionModal(true)
		setError('')
		reset()
	}

	const renderField = (field: FormField) => {
		// Wrap in Controller for React Hook Form integration
		return (
			<Controller
				name={field.id}
				control={control}
				rules={FieldMCP.getValidationRules(field)}
				render={({ field: { onChange, value, onBlur } }) => {
					// Use MCP to render field with React Hook Form integration
					const result = FieldMCP.render({
						field,
						control: {
							[field.id]: {
								value: value || '',
								onChange: (newValue: unknown) => onChange(newValue),
								onBlur: onBlur,
							},
						},
						errors,
					})

					if (!result.success) {
						MCPLogger.error(
							'renderField',
							result.errors?.[0] || new Error('Field rendering failed')
						)
						return (
							<div className='p-error'>
								Failed to render field: {field.label}
							</div>
						)
					}

					return <div>{result.data}</div>
				}}
			/>
		)
	}

	const renderSubmissionData = () => {
		return (
			<div className='space-y-4'>
				{Object.entries(submittedData).map(([fieldId, value]) => {
					const field = form?.fields.find(f => f.id === fieldId)
					if (!field) return null

					let displayValue: string
					if (Array.isArray(value)) {
						displayValue = value.join(', ')
					} else if (value instanceof Date) {
						displayValue = value.toLocaleDateString()
					} else {
						displayValue = String(value)
					}

					return (
						<div key={fieldId} className='p-3 bg-gray-800 rounded'>
							<div className='font-semibold text-white mb-1'>{field.label}</div>
							<div className='text-gray-300'>
								{displayValue || 'No value provided'}
							</div>
						</div>
					)
				})}
			</div>
		)
	}

	if (isLoading || !resolvedParams) {
		return (
			<div className='form-flow-container'>
				<div className='flex align-items-center justify-content-center min-h-screen'>
					<div className='text-center'>
						<i className='pi pi-spinner pi-spin text-4xl text-white mb-4'></i>
						<p className='text-gray-300'>Loading form...</p>
					</div>
				</div>
			</div>
		)
	}

	if (error || !form) {
		return (
			<div className='form-flow-container'>
				<div className='flex align-items-center justify-content-center min-h-screen'>
					<div className='text-center'>
						<Message
							severity='error'
							text={error || 'Form not found'}
							className='mb-4'
						/>
						<Button
							label='Go Home'
							icon='pi pi-home'
							onClick={() => router.push('/')}
						/>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='form-flow-container'>
			<div className='p-4'>
				<div className='max-w-2xl mx-auto'>
					<div className='text-center mb-6'>
						<h1 className='text-3xl font-bold text-white mb-2'>{form.title}</h1>
						{form.description && (
							<p className='text-gray-300 text-lg'>{form.description}</p>
						)}
					</div>

					<Card className='form-flow-card'>
						<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
							{form.fields.map(field => (
								<div key={field.id} className='field'>
									<label
										htmlFor={field.id}
										className='block text-sm font-medium text-gray-300 mb-2'
									>
										{field.label}
										{field.required && (
											<span className='text-red-400 ml-1'>*</span>
										)}
									</label>
									{renderField(field)}
									{errors[field.id] && (
										<small className='p-error block mt-1'>
											{errors[field.id]?.message as string}
										</small>
									)}
								</div>
							))}

							<div className='flex justify-content-center pt-6'>
								<Button
									type='submit'
									label='Submit Form'
									icon='pi pi-send'
									className='p-button-primary p-button-lg'
								/>
							</div>
						</form>
					</Card>
				</div>
			</div>

			<Dialog
				header='Form Submission'
				visible={showSubmissionModal}
				onHide={() => setShowSubmissionModal(false)}
				style={{ width: '50vw' }}
				modal
				className='p-fluid'
			>
				<div className='mb-4'>
					<Message
						severity='success'
						text='Form submitted successfully!'
						className='mb-4'
					/>
					<h3 className='text-lg font-semibold text-white mb-3'>
						Submitted Data:
					</h3>
					{renderSubmissionData()}
				</div>
				<div className='flex justify-content-end'>
					<Button
						label='Close'
						icon='pi pi-check'
						onClick={() => setShowSubmissionModal(false)}
						className='p-button-primary'
					/>
				</div>
			</Dialog>
		</div>
	)
}
