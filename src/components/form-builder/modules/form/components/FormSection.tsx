'use client'

import React from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { FormField } from '@/types'

interface FormSectionProps {
	title: string
	fields: FormField[]
	onFieldSelect: (field: FormField | null) => void
	onFieldRemove: (fieldId: string) => void
	onFieldDuplicate: (field: FormField) => void
	onFieldMove?: (
		fieldId: string,
		newPosition: { row: number; col: number }
	) => void
	selectedFieldId?: string
	showGrid?: boolean
	snapToGrid?: boolean
	gridSize?: { rows: number; cols: number }
}

export default function FormSection({
	title,
	fields,
	onFieldSelect,
	onFieldRemove,
	onFieldDuplicate,
	onFieldMove,
	selectedFieldId,
	showGrid = false,
	snapToGrid = true,
	gridSize = { rows: 12, cols: 12 },
}: FormSectionProps) {
	const handleFieldClick = (field: FormField) => {
		onFieldSelect(field)
	}

	const handleFieldRemove = (fieldId: string, event: React.MouseEvent) => {
		event.stopPropagation()
		onFieldRemove(fieldId)
	}

	const handleFieldDuplicate = (field: FormField, event: React.MouseEvent) => {
		event.stopPropagation()
		onFieldDuplicate(field)
	}

	return (
		<Card className='mb-4'>
			<div className='p-4 border-b border-gray-600'>
				<div className='flex items-center justify-between'>
					<h3 className='text-lg font-semibold text-white'>{title}</h3>
					<div className='flex items-center gap-2'>
						<span className='text-sm text-gray-400'>
							{fields.length} fields
						</span>
					</div>
				</div>
			</div>

			<div className='p-4'>
				{fields.length === 0 ? (
					<div className='text-center py-8 text-gray-400'>
						<i className='pi pi-plus-circle text-2xl mb-2' />
						<div>No fields in this section</div>
						<div className='text-sm'>Drag fields here to add them</div>
					</div>
				) : (
					<div className='space-y-3'>
						{fields.map(field => (
							<div
								key={field.id}
								className={`
									p-3 border rounded-lg cursor-pointer transition-all duration-200
									${
										selectedFieldId === field.id
											? 'border-purple-400 bg-purple-900/20'
											: 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
									}
								`}
								onClick={() => handleFieldClick(field)}
							>
								<div className='flex items-center justify-between'>
									<div className='flex-1'>
										<div className='flex items-center gap-2 mb-1'>
											<i className='pi pi-circle-fill text-xs text-purple-400' />
											<span className='font-medium text-white'>
												{field.label}
											</span>
											{field.required && (
												<span className='text-red-400 text-xs'>*</span>
											)}
										</div>
										<div className='text-sm text-gray-400'>
											{field.type} • {field.placeholder || 'No placeholder'}
										</div>
									</div>
									<div className='flex items-center gap-1'>
										<Button
											icon='pi pi-copy'
											className='p-button-text p-button-sm text-gray-400 hover:text-white'
											onClick={e => handleFieldDuplicate(field, e)}
											tooltip='Duplicate Field'
										/>
										<Button
											icon='pi pi-trash'
											className='p-button-text p-button-sm text-red-400 hover:text-red-300'
											onClick={e => handleFieldRemove(field.id, e)}
											tooltip='Remove Field'
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</Card>
	)
}
