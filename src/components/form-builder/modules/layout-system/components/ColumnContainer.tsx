'use client'

import React from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { FormField } from '@/types'

interface ColumnContainerProps {
	id: string
	title?: string
	fields: FormField[]
	width?: number
	gap?: number
	onFieldSelect: (field: FormField | null) => void
	onFieldRemove: (fieldId: string) => void
	onFieldMove: (fieldId: string, newIndex: number) => void
	onFieldAdd: (
		field: FormField,
		position?: { row: number; col: number }
	) => void
	selectedFieldId?: string
	className?: string
}

export default function ColumnContainer({
	id,
	title = 'Column',
	fields,
	width = 6,
	gap = 16,
	onFieldSelect,
	onFieldRemove,
	onFieldMove,
	onFieldAdd,
	selectedFieldId,
	className = '',
}: ColumnContainerProps) {
	const handleFieldClick = (field: FormField) => {
		onFieldSelect(field)
	}

	const handleFieldRemove = (fieldId: string, event: React.MouseEvent) => {
		event.stopPropagation()
		onFieldRemove(fieldId)
	}

	return (
		<Card className={`h-full ${className}`}>
			<div className='p-3 border-b border-gray-600 bg-gray-800/50'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<i className='pi pi-columns text-purple-400' />
						<h3 className='text-sm font-medium text-white'>{title}</h3>
						<span className='text-xs text-gray-400'>
							({fields.length} fields)
						</span>
					</div>
					<div className='flex items-center gap-1'>
						<Button
							icon='pi pi-cog'
							className='p-button-text p-button-sm text-gray-400 hover:text-white'
							tooltip='Column Settings'
						/>
						<Button
							icon='pi pi-trash'
							className='p-button-text p-button-sm text-red-400 hover:text-red-300'
							tooltip='Remove Column'
						/>
					</div>
				</div>
			</div>

			<div className='p-4 h-full overflow-auto'>
				{fields.length === 0 ? (
					<div className='text-center py-8 text-gray-400 border-2 border-dashed border-gray-600 rounded-lg'>
						<i className='pi pi-plus-circle text-2xl mb-2' />
						<div className='text-sm'>Empty Column</div>
						<div className='text-xs'>Drag fields here to add them</div>
					</div>
				) : (
					<div className='space-y-3' style={{ gap: `${gap}px` }}>
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
								<div className='flex items-center justify-between mb-2'>
									<div className='flex items-center gap-2'>
										<i className='pi pi-circle-fill text-xs text-purple-400' />
										<span className='font-medium text-white text-sm'>
											{field.label}
										</span>
										{field.required && (
											<span className='text-red-400 text-xs'>*</span>
										)}
									</div>
									<div className='flex items-center gap-1'>
										<Button
											icon='pi pi-copy'
											className='p-button-text p-button-sm text-gray-400 hover:text-white'
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
								<div className='text-xs text-gray-400'>
									{field.type} • {field.placeholder || 'No placeholder'}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</Card>
	)
}
