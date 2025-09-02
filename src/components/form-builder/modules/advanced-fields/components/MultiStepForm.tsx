'use client'

import React, { useState, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Checkbox } from 'primereact/checkbox'
import { Dropdown } from 'primereact/dropdown'
import { FormField } from '@/types'

interface FormStep {
	id: string
	title: string
	description: string
	fields: FormField[]
	required: boolean
	showProgress: boolean
	allowBack: boolean
	allowSkip: boolean
	validation: boolean
}

interface MultiStepFormProps {
	steps: FormStep[]
	onStepsChange: (steps: FormStep[]) => void
	onFieldSelect: (field: FormField | null) => void
	onFieldRemove: (fieldId: string) => void
	onFieldAdd: (field: FormField, stepId: string) => void
	selectedFieldId?: string
	className?: string
}

export default function MultiStepForm({
	steps,
	onStepsChange,
	onFieldSelect,
	onFieldRemove,
	onFieldAdd,
	selectedFieldId,
	className = '',
}: MultiStepFormProps) {
	const [activeStep, setActiveStep] = useState(0)
	const [showAddStep, setShowAddStep] = useState(false)
	const [newStep, setNewStep] = useState<Partial<FormStep>>({
		title: '',
		description: '',
		fields: [],
		required: true,
		showProgress: true,
		allowBack: true,
		allowSkip: false,
		validation: true,
	})

	const handleAddStep = useCallback(() => {
		if (!newStep.title) return

		const step: FormStep = {
			id: `step_${Date.now()}`,
			title: newStep.title,
			description: newStep.description || '',
			fields: [],
			required: newStep.required || true,
			showProgress: newStep.showProgress || true,
			allowBack: newStep.allowBack || true,
			allowSkip: newStep.allowSkip || false,
			validation: newStep.validation || true,
		}

		const newSteps = [...steps, step]
		onStepsChange(newSteps)
		setNewStep({
			title: '',
			description: '',
			fields: [],
			required: true,
			showProgress: true,
			allowBack: true,
			allowSkip: false,
			validation: true,
		})
		setShowAddStep(false)
	}, [steps, newStep, onStepsChange])

	const handleRemoveStep = useCallback(
		(stepId: string) => {
			const newSteps = steps.filter(step => step.id !== stepId)
			onStepsChange(newSteps)
			if (activeStep >= newSteps.length) {
				setActiveStep(Math.max(0, newSteps.length - 1))
			}
		},
		[steps, activeStep, onStepsChange]
	)

	const handleStepUpdate = useCallback(
		(stepId: string, updates: Partial<FormStep>) => {
			const newSteps = steps.map(step =>
				step.id === stepId ? { ...step, ...updates } : step
			)
			onStepsChange(newSteps)
		},
		[steps, onStepsChange]
	)

	const handleFieldAdd = useCallback(
		(field: FormField, stepId: string) => {
			const newSteps = steps.map(step =>
				step.id === stepId ? { ...step, fields: [...step.fields, field] } : step
			)
			onStepsChange(newSteps)
		},
		[steps, onStepsChange]
	)

	const handleFieldRemove = useCallback(
		(fieldId: string) => {
			const newSteps = steps.map(step => ({
				...step,
				fields: step.fields.filter(field => field.id !== fieldId),
			}))
			onStepsChange(newSteps)
			onFieldRemove(fieldId)
		},
		[steps, onStepsChange, onFieldRemove]
	)

	const handleFieldSelect = useCallback(
		(field: FormField | null) => {
			onFieldSelect(field)
		},
		[onFieldSelect]
	)

	const renderStep = (step: FormStep, index: number) => {
		const isActive = activeStep === index
		const isCompleted = index < activeStep

		return (
			<div
				key={step.id}
				className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
					isActive
						? 'border-purple-400 bg-purple-900/20'
						: isCompleted
						? 'border-green-400 bg-green-900/20'
						: 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
				}`}
				onClick={() => setActiveStep(index)}
			>
				<div className='flex items-center justify-between mb-2'>
					<div className='flex items-center gap-3'>
						<div
							className={`
							w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
							${
								isActive
									? 'bg-purple-600 text-white'
									: isCompleted
									? 'bg-green-600 text-white'
									: 'bg-gray-600 text-gray-300'
							}
						`}
						>
							{isCompleted ? '✓' : index + 1}
						</div>
						<div>
							<h3 className='text-sm font-medium text-white'>{step.title}</h3>
							{step.description && (
								<p className='text-xs text-gray-400'>{step.description}</p>
							)}
						</div>
					</div>
					<div className='flex items-center gap-2'>
						<span className='text-xs text-gray-400'>
							{step.fields.length} fields
						</span>
						<Button
							icon='pi pi-trash'
							className='p-button-text p-button-sm text-red-400 hover:text-red-300'
							onClick={e => {
								e.stopPropagation()
								handleRemoveStep(step.id)
							}}
							tooltip='Remove Step'
						/>
					</div>
				</div>

				{/* Step Configuration */}
				{isActive && (
					<div className='mt-4 p-3 bg-gray-800/50 rounded border border-gray-600'>
						<h4 className='text-xs font-medium text-gray-300 mb-3'>
							Step Configuration:
						</h4>

						<div className='grid grid-cols-2 gap-4 mb-3'>
							<div>
								<label className='block text-xs text-gray-400 mb-1'>
									Title
								</label>
								<InputText
									value={step.title}
									onChange={e =>
										handleStepUpdate(step.id, { title: e.target.value })
									}
									className='w-full'
								/>
							</div>
							<div>
								<label className='block text-xs text-gray-400 mb-1'>
									Description
								</label>
								<InputText
									value={step.description}
									onChange={e =>
										handleStepUpdate(step.id, { description: e.target.value })
									}
									className='w-full'
								/>
							</div>
						</div>

						<div className='flex items-center gap-4'>
							<div className='flex items-center gap-2'>
								<Checkbox
									inputId={`required-${step.id}`}
									checked={step.required}
									onChange={e =>
										handleStepUpdate(step.id, { required: e.checked })
									}
								/>
								<label
									htmlFor={`required-${step.id}`}
									className='text-xs text-gray-300'
								>
									Required Step
								</label>
							</div>

							<div className='flex items-center gap-2'>
								<Checkbox
									inputId={`showProgress-${step.id}`}
									checked={step.showProgress}
									onChange={e =>
										handleStepUpdate(step.id, { showProgress: e.checked })
									}
								/>
								<label
									htmlFor={`showProgress-${step.id}`}
									className='text-xs text-gray-300'
								>
									Show Progress
								</label>
							</div>

							<div className='flex items-center gap-2'>
								<Checkbox
									inputId={`allowBack-${step.id}`}
									checked={step.allowBack}
									onChange={e =>
										handleStepUpdate(step.id, { allowBack: e.checked })
									}
								/>
								<label
									htmlFor={`allowBack-${step.id}`}
									className='text-xs text-gray-300'
								>
									Allow Back
								</label>
							</div>

							<div className='flex items-center gap-2'>
								<Checkbox
									inputId={`allowSkip-${step.id}`}
									checked={step.allowSkip}
									onChange={e =>
										handleStepUpdate(step.id, { allowSkip: e.checked })
									}
								/>
								<label
									htmlFor={`allowSkip-${step.id}`}
									className='text-xs text-gray-300'
								>
									Allow Skip
								</label>
							</div>
						</div>
					</div>
				)}

				{/* Fields in Step */}
				{step.fields.length > 0 && (
					<div className='mt-3 space-y-2'>
						{step.fields.map(field => (
							<div
								key={field.id}
								className={`p-2 border rounded cursor-pointer transition-colors ${
									selectedFieldId === field.id
										? 'border-purple-400 bg-purple-900/20'
										: 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
								}`}
								onClick={e => {
									e.stopPropagation()
									handleFieldSelect(field)
								}}
							>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<i className='pi pi-circle-fill text-xs text-purple-400' />
										<span className='text-xs text-white'>{field.label}</span>
										{field.required && (
											<span className='text-red-400 text-xs'>*</span>
										)}
									</div>
									<Button
										icon='pi pi-trash'
										className='p-button-text p-button-sm text-red-400 hover:text-red-300'
										onClick={e => {
											e.stopPropagation()
											handleFieldRemove(field.id)
										}}
										tooltip='Remove Field'
									/>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		)
	}

	return (
		<Card className={`mb-4 ${className}`}>
			<div className='p-4 border-b border-gray-600'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<i className='pi pi-list text-purple-400' />
						<h3 className='text-sm font-medium text-white'>Multi-Step Form</h3>
						<span className='text-xs text-gray-400'>
							({steps.length} steps)
						</span>
					</div>
					<Button
						icon='pi pi-plus'
						label='Add Step'
						className='p-button-sm'
						onClick={() => setShowAddStep(true)}
					/>
				</div>
			</div>

			<div className='p-4 space-y-4'>
				{/* Add Step Form */}
				{showAddStep && (
					<div className='p-4 border border-gray-600 rounded-lg bg-gray-800/50'>
						<h4 className='text-sm font-medium text-white mb-3'>
							Add New Step
						</h4>

						<div className='grid grid-cols-2 gap-4 mb-4'>
							<div>
								<label className='block text-xs text-gray-400 mb-1'>
									Step Title
								</label>
								<InputText
									value={newStep.title}
									onChange={e =>
										setNewStep(prev => ({ ...prev, title: e.target.value }))
									}
									placeholder='Enter step title...'
									className='w-full'
								/>
							</div>
							<div>
								<label className='block text-xs text-gray-400 mb-1'>
									Description
								</label>
								<InputText
									value={newStep.description}
									onChange={e =>
										setNewStep(prev => ({
											...prev,
											description: e.target.value,
										}))
									}
									placeholder='Enter step description...'
									className='w-full'
								/>
							</div>
						</div>

						<div className='flex items-center gap-4 mb-4'>
							<div className='flex items-center gap-2'>
								<Checkbox
									inputId='required'
									checked={newStep.required}
									onChange={e =>
										setNewStep(prev => ({ ...prev, required: e.checked }))
									}
								/>
								<label htmlFor='required' className='text-sm text-gray-300'>
									Required Step
								</label>
							</div>

							<div className='flex items-center gap-2'>
								<Checkbox
									inputId='showProgress'
									checked={newStep.showProgress}
									onChange={e =>
										setNewStep(prev => ({ ...prev, showProgress: e.checked }))
									}
								/>
								<label htmlFor='showProgress' className='text-sm text-gray-300'>
									Show Progress
								</label>
							</div>

							<div className='flex items-center gap-2'>
								<Checkbox
									inputId='allowBack'
									checked={newStep.allowBack}
									onChange={e =>
										setNewStep(prev => ({ ...prev, allowBack: e.checked }))
									}
								/>
								<label htmlFor='allowBack' className='text-sm text-gray-300'>
									Allow Back
								</label>
							</div>

							<div className='flex items-center gap-2'>
								<Checkbox
									inputId='allowSkip'
									checked={newStep.allowSkip}
									onChange={e =>
										setNewStep(prev => ({ ...prev, allowSkip: e.checked }))
									}
								/>
								<label htmlFor='allowSkip' className='text-sm text-gray-300'>
									Allow Skip
								</label>
							</div>
						</div>

						<div className='flex gap-2'>
							<Button
								label='Cancel'
								className='p-button-text p-button-sm'
								onClick={() => setShowAddStep(false)}
							/>
							<Button
								label='Add Step'
								className='p-button-sm'
								onClick={handleAddStep}
							/>
						</div>
					</div>
				)}

				{/* Steps List */}
				{steps.length === 0 ? (
					<div className='text-center py-8 text-gray-400'>
						<i className='pi pi-list text-2xl mb-2' />
						<div>No steps configured</div>
						<div className='text-sm'>Add steps to create a multi-step form</div>
					</div>
				) : (
					<div className='space-y-3'>
						{steps.map((step, index) => renderStep(step, index))}
					</div>
				)}
			</div>
		</Card>
	)
}
