'use client'

import React, { useState, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { TabView, TabPanel } from 'primereact/tabview'
import { FormField } from '@/types'
import FileUploadField from './FileUploadField'
import RichTextField from './RichTextField'
import DateTimeField from './DateTimeField'
import InputMaskField from './InputMaskField'
import FieldDependencies from './FieldDependencies'
import MultiStepForm from './MultiStepForm'

interface AdvancedFieldsPanelProps {
	fields: FormField[]
	selectedField: FormField | null
	onFieldUpdate: (field: FormField) => void
	onFieldRemove: (fieldId: string) => void
	onFieldSelect: (field: FormField | null) => void
	onFieldsChange: (fields: FormField[]) => void
	className?: string
}

export default function AdvancedFieldsPanel({
	fields,
	selectedField,
	onFieldUpdate,
	onFieldRemove,
	onFieldSelect,
	onFieldsChange,
	className = '',
}: AdvancedFieldsPanelProps) {
	const [activeTab, setActiveTab] = useState(0)
	const [dependencies, setDependencies] = useState<any[]>([])
	const [steps, setSteps] = useState<any[]>([])

	const handleFieldUpdate = useCallback(
		(field: FormField) => {
			onFieldUpdate(field)
		},
		[onFieldUpdate]
	)

	const handleFieldRemove = useCallback(
		(fieldId: string) => {
			onFieldRemove(fieldId)
		},
		[onFieldRemove]
	)

	const handleFieldSelect = useCallback(
		(field: FormField | null) => {
			onFieldSelect(field)
		},
		[onFieldSelect]
	)

	const handleDependenciesChange = useCallback((newDependencies: any[]) => {
		setDependencies(newDependencies)
	}, [])

	const handleStepsChange = useCallback((newSteps: any[]) => {
		setSteps(newSteps)
	}, [])

	const handleFieldAdd = useCallback(
		(field: FormField, stepId?: string) => {
			if (stepId) {
				// Add field to specific step
				const newSteps = steps.map(step =>
					step.id === stepId
						? { ...step, fields: [...step.fields, field] }
						: step
				)
				setSteps(newSteps)
			} else {
				// Add field to main form
				const newFields = [...fields, field]
				onFieldsChange(newFields)
			}
		},
		[fields, steps, onFieldsChange]
	)

	const renderAdvancedField = (field: FormField) => {
		switch (field.type) {
			case 'file':
				return (
					<FileUploadField
						key={field.id}
						field={field}
						onFieldUpdate={handleFieldUpdate}
						onFieldRemove={handleFieldRemove}
						selectedFieldId={selectedField?.id}
					/>
				)
			case 'richtext':
				return (
					<RichTextField
						key={field.id}
						field={field}
						onFieldUpdate={handleFieldUpdate}
						onFieldRemove={handleFieldRemove}
						selectedFieldId={selectedField?.id}
					/>
				)
			case 'date':
			case 'datetime':
			case 'time':
				return (
					<DateTimeField
						key={field.id}
						field={field}
						onFieldUpdate={handleFieldUpdate}
						onFieldRemove={handleFieldRemove}
						selectedFieldId={selectedField?.id}
					/>
				)
			case 'phone':
			case 'ssn':
			case 'creditcard':
				return (
					<InputMaskField
						key={field.id}
						field={field}
						onFieldUpdate={handleFieldUpdate}
						onFieldRemove={handleFieldRemove}
						selectedFieldId={selectedField?.id}
					/>
				)
			default:
				return null
		}
	}

	const getAdvancedFields = () => {
		return fields.filter(field =>
			[
				'file',
				'richtext',
				'date',
				'datetime',
				'time',
				'phone',
				'ssn',
				'creditcard',
			].includes(field.type)
		)
	}

	return (
		<Card className={`h-full ${className}`}>
			<div className='p-4 border-b border-gray-600'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<i className='pi pi-cog text-purple-400' />
						<h3 className='text-sm font-medium text-white'>Advanced Fields</h3>
					</div>
					<span className='text-xs text-gray-400'>
						{getAdvancedFields().length} advanced fields
					</span>
				</div>
			</div>

			<div className='p-0'>
				<TabView
					activeIndex={activeTab}
					onTabChange={e => setActiveTab(e.index)}
					className='advanced-fields-tabs'
				>
					<TabPanel header='Field Types' leftIcon='pi pi-list'>
						<div className='p-4 space-y-4'>
							{getAdvancedFields().length === 0 ? (
								<div className='text-center py-8 text-gray-400'>
									<i className='pi pi-list text-2xl mb-2' />
									<div>No advanced fields</div>
									<div className='text-sm'>
										Add advanced field types to see them here
									</div>
								</div>
							) : (
								getAdvancedFields().map(renderAdvancedField)
							)}
						</div>
					</TabPanel>

					<TabPanel header='Dependencies' leftIcon='pi pi-sitemap'>
						<div className='p-4'>
							<FieldDependencies
								fields={fields}
								selectedField={selectedField}
								onDependenciesChange={handleDependenciesChange}
							/>
						</div>
					</TabPanel>

					<TabPanel header='Multi-Step' leftIcon='pi pi-list'>
						<div className='p-4'>
							<MultiStepForm
								steps={steps}
								onStepsChange={handleStepsChange}
								onFieldSelect={handleFieldSelect}
								onFieldRemove={handleFieldRemove}
								onFieldAdd={handleFieldAdd}
								selectedFieldId={selectedField?.id}
							/>
						</div>
					</TabPanel>

					<TabPanel header='Validation' leftIcon='pi pi-check-circle'>
						<div className='p-4'>
							<div className='text-center py-8 text-gray-400'>
								<i className='pi pi-check-circle text-2xl mb-2' />
								<div>Custom Validation Rules</div>
								<div className='text-sm'>
									Configure advanced validation rules
								</div>
							</div>
						</div>
					</TabPanel>

					<TabPanel header='API Integration' leftIcon='pi pi-cloud'>
						<div className='p-4'>
							<div className='text-center py-8 text-gray-400'>
								<i className='pi pi-cloud text-2xl mb-2' />
								<div>API Integration</div>
								<div className='text-sm'>Connect fields to external APIs</div>
							</div>
						</div>
					</TabPanel>
				</TabView>
			</div>
		</Card>
	)
}
