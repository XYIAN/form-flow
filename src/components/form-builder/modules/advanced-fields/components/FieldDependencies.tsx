'use client'

import React, { useState, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { FormField } from '@/types'

interface FieldDependency {
	id: string
	sourceFieldId: string
	targetFieldId: string
	condition:
		| 'equals'
		| 'not_equals'
		| 'contains'
		| 'not_contains'
		| 'greater_than'
		| 'less_than'
		| 'is_empty'
		| 'is_not_empty'
	value: string
	action:
		| 'show'
		| 'hide'
		| 'enable'
		| 'disable'
		| 'set_value'
		| 'set_options'
		| 'set_required'
	actionValue: string
	enabled: boolean
}

interface FieldDependenciesProps {
	fields: FormField[]
	selectedField: FormField | null
	onDependenciesChange: (dependencies: FieldDependency[]) => void
	className?: string
}

export default function FieldDependencies({
	fields,
	selectedField,
	onDependenciesChange,
	className = '',
}: FieldDependenciesProps) {
	const [dependencies, setDependencies] = useState<FieldDependency[]>([])
	const [showAddForm, setShowAddForm] = useState(false)
	const [newDependency, setNewDependency] = useState<Partial<FieldDependency>>({
		sourceFieldId: '',
		targetFieldId: '',
		condition: 'equals',
		value: '',
		action: 'show',
		actionValue: '',
		enabled: true,
	})

	const conditionOptions = [
		{ label: 'Equals', value: 'equals' },
		{ label: 'Not Equals', value: 'not_equals' },
		{ label: 'Contains', value: 'contains' },
		{ label: 'Not Contains', value: 'not_contains' },
		{ label: 'Greater Than', value: 'greater_than' },
		{ label: 'Less Than', value: 'less_than' },
		{ label: 'Is Empty', value: 'is_empty' },
		{ label: 'Is Not Empty', value: 'is_not_empty' },
	]

	const actionOptions = [
		{ label: 'Show Field', value: 'show' },
		{ label: 'Hide Field', value: 'hide' },
		{ label: 'Enable Field', value: 'enable' },
		{ label: 'Disable Field', value: 'disable' },
		{ label: 'Set Value', value: 'set_value' },
		{ label: 'Set Options', value: 'set_options' },
		{ label: 'Set Required', value: 'set_required' },
	]

	const fieldOptions = fields.map(field => ({
		label: field.label,
		value: field.id,
	}))

	const handleAddDependency = useCallback(() => {
		if (!newDependency.sourceFieldId || !newDependency.targetFieldId) return

		const dependency: FieldDependency = {
			id: `dep_${Date.now()}`,
			sourceFieldId: newDependency.sourceFieldId,
			targetFieldId: newDependency.targetFieldId,
			condition: newDependency.condition || 'equals',
			value: newDependency.value || '',
			action: newDependency.action || 'show',
			actionValue: newDependency.actionValue || '',
			enabled: newDependency.enabled || true,
		}

		const newDependencies = [...dependencies, dependency]
		setDependencies(newDependencies)
		onDependenciesChange(newDependencies)
		setNewDependency({
			sourceFieldId: '',
			targetFieldId: '',
			condition: 'equals',
			value: '',
			action: 'show',
			actionValue: '',
			enabled: true,
		})
		setShowAddForm(false)
	}, [dependencies, newDependency, onDependenciesChange])

	const handleRemoveDependency = useCallback(
		(dependencyId: string) => {
			const newDependencies = dependencies.filter(
				dep => dep.id !== dependencyId
			)
			setDependencies(newDependencies)
			onDependenciesChange(newDependencies)
		},
		[dependencies, onDependenciesChange]
	)

	const handleToggleDependency = useCallback(
		(dependencyId: string) => {
			const newDependencies = dependencies.map(dep =>
				dep.id === dependencyId ? { ...dep, enabled: !dep.enabled } : dep
			)
			setDependencies(newDependencies)
			onDependenciesChange(newDependencies)
		},
		[dependencies, onDependenciesChange]
	)

	const getFieldLabel = (fieldId: string) => {
		const field = fields.find(f => f.id === fieldId)
		return field ? field.label : 'Unknown Field'
	}

	const getConditionLabel = (condition: string) => {
		const option = conditionOptions.find(opt => opt.value === condition)
		return option ? option.label : condition
	}

	const getActionLabel = (action: string) => {
		const option = actionOptions.find(opt => opt.value === action)
		return option ? option.label : action
	}

	if (!selectedField) {
		return (
			<Card className={`mb-4 ${className}`}>
				<div className='p-4 text-center text-gray-400'>
					<i className='pi pi-info-circle text-2xl mb-2' />
					<div>Select a field to configure dependencies</div>
				</div>
			</Card>
		)
	}

	return (
		<Card className={`mb-4 ${className}`}>
			<div className='p-4 border-b border-gray-600'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<i className='pi pi-sitemap text-purple-400' />
						<h3 className='text-sm font-medium text-white'>
							Field Dependencies
						</h3>
					</div>
					<Button
						icon='pi pi-plus'
						label='Add Dependency'
						className='p-button-sm'
						onClick={() => setShowAddForm(true)}
					/>
				</div>
			</div>

			<div className='p-4 space-y-4'>
				{/* Add Dependency Form */}
				{showAddForm && (
					<div className='p-4 border border-gray-600 rounded-lg bg-gray-800/50'>
						<h4 className='text-sm font-medium text-white mb-3'>
							Add New Dependency
						</h4>

						<div className='grid grid-cols-2 gap-4 mb-4'>
							<div>
								<label className='block text-xs text-gray-400 mb-1'>
									Source Field (Triggers)
								</label>
								<Dropdown
									value={newDependency.sourceFieldId}
									options={fieldOptions.filter(
										f => f.value !== selectedField.id
									)}
									onChange={e =>
										setNewDependency(prev => ({
											...prev,
											sourceFieldId: e.value,
										}))
									}
									placeholder='Select source field...'
									className='w-full'
								/>
							</div>

							<div>
								<label className='block text-xs text-gray-400 mb-1'>
									Target Field (Affected)
								</label>
								<Dropdown
									value={newDependency.targetFieldId}
									options={fieldOptions.filter(
										f => f.value !== selectedField.id
									)}
									onChange={e =>
										setNewDependency(prev => ({
											...prev,
											targetFieldId: e.value,
										}))
									}
									placeholder='Select target field...'
									className='w-full'
								/>
							</div>
						</div>

						<div className='grid grid-cols-2 gap-4 mb-4'>
							<div>
								<label className='block text-xs text-gray-400 mb-1'>
									Condition
								</label>
								<Dropdown
									value={newDependency.condition}
									options={conditionOptions}
									onChange={e =>
										setNewDependency(prev => ({ ...prev, condition: e.value }))
									}
									className='w-full'
								/>
							</div>

							<div>
								<label className='block text-xs text-gray-400 mb-1'>
									Value
								</label>
								<InputText
									value={newDependency.value}
									onChange={e =>
										setNewDependency(prev => ({
											...prev,
											value: e.target.value,
										}))
									}
									placeholder='Enter condition value...'
									className='w-full'
								/>
							</div>
						</div>

						<div className='grid grid-cols-2 gap-4 mb-4'>
							<div>
								<label className='block text-xs text-gray-400 mb-1'>
									Action
								</label>
								<Dropdown
									value={newDependency.action}
									options={actionOptions}
									onChange={e =>
										setNewDependency(prev => ({ ...prev, action: e.value }))
									}
									className='w-full'
								/>
							</div>

							<div>
								<label className='block text-xs text-gray-400 mb-1'>
									Action Value
								</label>
								<InputText
									value={newDependency.actionValue}
									onChange={e =>
										setNewDependency(prev => ({
											...prev,
											actionValue: e.target.value,
										}))
									}
									placeholder='Enter action value...'
									className='w-full'
								/>
							</div>
						</div>

						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<Checkbox
									inputId='enabled'
									checked={newDependency.enabled}
									onChange={e =>
										setNewDependency(prev => ({ ...prev, enabled: e.checked }))
									}
								/>
								<label htmlFor='enabled' className='text-sm text-gray-300'>
									Enable Dependency
								</label>
							</div>

							<div className='flex gap-2'>
								<Button
									label='Cancel'
									className='p-button-text p-button-sm'
									onClick={() => setShowAddForm(false)}
								/>
								<Button
									label='Add Dependency'
									className='p-button-sm'
									onClick={handleAddDependency}
								/>
							</div>
						</div>
					</div>
				)}

				{/* Dependencies List */}
				{dependencies.length === 0 ? (
					<div className='text-center py-8 text-gray-400'>
						<i className='pi pi-sitemap text-2xl mb-2' />
						<div>No dependencies configured</div>
						<div className='text-sm'>
							Add dependencies to create conditional logic
						</div>
					</div>
				) : (
					<div className='space-y-3'>
						{dependencies.map(dependency => (
							<div
								key={dependency.id}
								className={`p-3 border rounded-lg ${
									dependency.enabled
										? 'border-gray-600 bg-gray-800/50'
										: 'border-gray-700 bg-gray-800/30 opacity-60'
								}`}
							>
								<div className='flex items-center justify-between mb-2'>
									<div className='flex items-center gap-2'>
										<Checkbox
											inputId={`dep-${dependency.id}`}
											checked={dependency.enabled}
											onChange={() => handleToggleDependency(dependency.id)}
										/>
										<span className='text-sm font-medium text-white'>
											{getFieldLabel(dependency.sourceFieldId)}{' '}
											{getConditionLabel(dependency.condition)} "
											{dependency.value}"
										</span>
									</div>
									<Button
										icon='pi pi-trash'
										className='p-button-text p-button-sm text-red-400 hover:text-red-300'
										onClick={() => handleRemoveDependency(dependency.id)}
										tooltip='Remove Dependency'
									/>
								</div>

								<div className='text-xs text-gray-400 ml-6'>
									→ {getActionLabel(dependency.action)}{' '}
									{getFieldLabel(dependency.targetFieldId)}
									{dependency.actionValue && ` to "${dependency.actionValue}"`}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</Card>
	)
}
