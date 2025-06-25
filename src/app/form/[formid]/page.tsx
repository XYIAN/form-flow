'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { Checkbox } from 'primereact/checkbox'
import { RadioButton } from 'primereact/radiobutton'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Message } from 'primereact/message'
import { InputMask } from 'primereact/inputmask'
import { FileUpload } from 'primereact/fileupload'
import { useForms } from '@/context/FormContext'
import { Form, FormField } from '@/types'

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
	const [submittedData, setSubmittedData] = useState<Record<string, string | number | boolean | string[] | Date>>({})
	const [error, setError] = useState('')
	const [resolvedParams, setResolvedParams] = useState<{ formid: string } | null>(null)

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm()

	// Resolve params promise
	useEffect(() => {
		params.then((resolved) => {
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

	const onSubmit = (data: Record<string, string | number | boolean | string[] | Date>) => {
		setSubmittedData(data)
		setShowSubmissionModal(true)
		reset()
	}

	const renderField = (field: FormField) => {
		const fieldName = field.id
		const isRequired = field.required

		switch (field.type) {
			case 'text':
			case 'email':
			case 'number':
				return (
					<Controller
						name={fieldName}
						control={control}
						rules={{ required: isRequired ? `${field.label} is required` : false }}
						render={({ field: { onChange, value } }) => (
							<InputText
								type={field.type}
								value={value || ''}
								onChange={onChange}
								placeholder={field.placeholder}
								className={`w-full ${errors[fieldName] ? 'p-invalid' : ''}`}
							/>
						)}
					/>
				)

			case 'textarea':
				return (
					<Controller
						name={fieldName}
						control={control}
						rules={{ required: isRequired ? `${field.label} is required` : false }}
						render={({ field: { onChange, value } }) => (
							<InputTextarea
								value={value || ''}
								onChange={onChange}
								placeholder={field.placeholder}
								rows={4}
								className={`w-full ${errors[fieldName] ? 'p-invalid' : ''}`}
							/>
						)}
					/>
				)

			case 'date':
				return (
					<Controller
						name={fieldName}
						control={control}
						rules={{ required: isRequired ? `${field.label} is required` : false }}
						render={({ field: { onChange, value } }) => (
							<Calendar
								value={value}
								onChange={onChange}
								showIcon
								dateFormat="mm/dd/yy"
								placeholder={field.placeholder || 'Select date'}
								className={`w-full ${errors[fieldName] ? 'p-invalid' : ''}`}
							/>
						)}
					/>
				)

			case 'select':
				return (
					<Controller
						name={fieldName}
						control={control}
						rules={{ required: isRequired ? `${field.label} is required` : false }}
						render={({ field: { onChange, value } }) => (
							<Dropdown
								value={value}
								options={field.options || []}
								onChange={onChange}
								placeholder={field.placeholder || 'Select an option'}
								className={`w-full ${errors[fieldName] ? 'p-invalid' : ''}`}
							/>
						)}
					/>
				)

			case 'checkbox':
				return (
					<Controller
						name={fieldName}
						control={control}
						rules={{ required: isRequired ? `${field.label} is required` : false }}
						render={({ field: { onChange, value } }) => (
							<div className="flex flex-column gap-2">
								{field.options?.map((option, index) => (
									<div key={index} className="flex align-items-center">
										<Checkbox
											inputId={`${fieldName}-${index}`}
											value={option}
											onChange={onChange}
											checked={Array.isArray(value) ? value.includes(option) : false}
										/>
										<label htmlFor={`${fieldName}-${index}`} className="ml-2 text-white">
											{option}
										</label>
									</div>
								))}
							</div>
						)}
					/>
				)

			case 'radio':
				return (
					<Controller
						name={fieldName}
						control={control}
						rules={{ required: isRequired ? `${field.label} is required` : false }}
						render={({ field: { onChange, value } }) => (
							<div className="flex flex-column gap-2">
								{field.options?.map((option, index) => (
									<div key={index} className="flex align-items-center">
										<RadioButton
											inputId={`${fieldName}-${index}`}
											name={fieldName}
											value={option}
											onChange={onChange}
											checked={value === option}
										/>
										<label htmlFor={`${fieldName}-${index}`} className="ml-2 text-white">
											{option}
										</label>
									</div>
								))}
							</div>
						)}
					/>
				)

			case 'money':
				return (
					<Controller
						name={fieldName}
						control={control}
						rules={{ required: isRequired ? `${field.label} is required` : false }}
						render={({ field: { onChange, value } }) => (
							<InputMask
								value={value || ''}
								onChange={onChange}
								placeholder={field.placeholder}
								className={`w-full ${errors[fieldName] ? 'p-invalid' : ''}`}
								mask="999,999,999.99"
							/>
						)}
					/>
				)

			case 'phone':
				return (
					<Controller
						name={fieldName}
						control={control}
						rules={{ required: isRequired ? `${field.label} is required` : false }}
						render={({ field: { onChange, value } }) => (
							<InputMask
								value={value || ''}
								onChange={onChange}
								placeholder={field.placeholder}
								className={`w-full ${errors[fieldName] ? 'p-invalid' : ''}`}
								mask="(999) 999-9999"
							/>
						)}
					/>
				)

			case 'address':
				return (
					<Controller
						name={fieldName}
						control={control}
						rules={{ required: isRequired ? `${field.label} is required` : false }}
						render={({ field: { onChange, value } }) => (
							<InputText
								value={value || ''}
								onChange={onChange}
								placeholder={field.placeholder}
								className={`w-full ${errors[fieldName] ? 'p-invalid' : ''}`}
							/>
						)}
					/>
				)

			case 'yesno':
				return (
					<Controller
						name={fieldName}
						control={control}
						rules={{ required: isRequired ? `${field.label} is required` : false }}
						render={({ field: { onChange, value } }) => (
							<div className="flex flex-column gap-2">
								{['Yes', 'No'].map((option, index) => (
									<div key={index} className="flex align-items-center">
										<RadioButton
											inputId={`${fieldName}-${index}`}
											name={fieldName}
											value={option}
											onChange={onChange}
											checked={value === option}
										/>
										<label htmlFor={`${fieldName}-${index}`} className="ml-2 text-white">
											{option}
										</label>
									</div>
								))}
							</div>
						)}
					/>
				)

			case 'file':
				return (
					<Controller
						name={fieldName}
						control={control}
						rules={{ required: isRequired ? `${field.label} is required` : false }}
						render={({ field: { onChange } }) => (
							<FileUpload
								mode="basic"
								name={fieldName}
								accept={field.allowedExtensions?.join(',') || '.pdf,.doc,.docx,.jpg,.jpeg,.png,.txt'}
								maxFileSize={field.maxFileSize || 1000000}
								customUpload
								uploadHandler={(event) => {
									onChange(event.files[0]?.name || '')
								}}
								auto
								chooseLabel="Choose File"
								className={`w-full ${errors[fieldName] ? 'p-invalid' : ''}`}
							/>
						)}
					/>
				)

			case 'signature':
				return (
					<Controller
						name={fieldName}
						control={control}
						rules={{ required: isRequired ? `${field.label} is required` : false }}
						render={({ field: { onChange, value } }) => (
							<InputMask
								value={value || ''}
								onChange={onChange}
								placeholder={field.placeholder}
								className={`w-full ${errors[fieldName] ? 'p-invalid' : ''}`}
								mask="*"
							/>
						)}
					/>
				)

			default:
				return (
					<Controller
						name={fieldName}
						control={control}
						rules={{ required: isRequired ? `${field.label} is required` : false }}
						render={({ field: { onChange, value } }) => (
							<InputText
								value={value || ''}
								onChange={onChange}
								placeholder={field.placeholder}
								className={`w-full ${errors[fieldName] ? 'p-invalid' : ''}`}
							/>
						)}
					/>
				)
		}
	}

	const renderSubmissionData = () => {
		return (
			<div className="space-y-4">
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
						<div key={fieldId} className="p-3 bg-gray-800 rounded">
							<div className="font-semibold text-white mb-1">{field.label}</div>
							<div className="text-gray-300">{displayValue || 'No value provided'}</div>
						</div>
					)
				})}
			</div>
		)
	}

	if (isLoading || !resolvedParams) {
		return (
			<div className="form-flow-container">
				<div className="flex align-items-center justify-content-center min-h-screen">
					<div className="text-center">
						<i className="pi pi-spinner pi-spin text-4xl text-white mb-4"></i>
						<p className="text-gray-300">Loading form...</p>
					</div>
				</div>
			</div>
		)
	}

	if (error || !form) {
		return (
			<div className="form-flow-container">
				<div className="flex align-items-center justify-content-center min-h-screen">
					<div className="text-center">
						<Message severity="error" text={error || 'Form not found'} className="mb-4" />
						<Button
							label="Go Home"
							icon="pi pi-home"
							onClick={() => router.push('/')}
						/>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="form-flow-container">
			<div className="p-4">
				<div className="max-w-2xl mx-auto">
					<div className="text-center mb-6">
						<h1 className="text-3xl font-bold text-white mb-2">{form.title}</h1>
						{form.description && (
							<p className="text-gray-300 text-lg">{form.description}</p>
						)}
					</div>

					<Card className="form-flow-card">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							{form.fields.map((field) => (
								<div key={field.id} className="field">
									<label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-2">
										{field.label}
										{field.required && <span className="text-red-400 ml-1">*</span>}
									</label>
									{renderField(field)}
									{errors[field.id] && (
										<small className="p-error block mt-1">
											{errors[field.id]?.message as string}
										</small>
									)}
								</div>
							))}

							<div className="flex justify-content-center pt-6">
								<Button
									type="submit"
									label="Submit Form"
									icon="pi pi-send"
									className="p-button-primary p-button-lg"
								/>
							</div>
						</form>
					</Card>
				</div>
			</div>

			<Dialog
				header="Form Submission"
				visible={showSubmissionModal}
				onHide={() => setShowSubmissionModal(false)}
				style={{ width: '50vw' }}
				modal
				className="p-fluid"
			>
				<div className="mb-4">
					<Message
						severity="success"
						text="Form submitted successfully!"
						className="mb-4"
					/>
					<h3 className="text-lg font-semibold text-white mb-3">Submitted Data:</h3>
					{renderSubmissionData()}
				</div>
				<div className="flex justify-content-end">
					<Button
						label="Close"
						icon="pi pi-check"
						onClick={() => setShowSubmissionModal(false)}
						className="p-button-primary"
					/>
				</div>
			</Dialog>
		</div>
	)
} 