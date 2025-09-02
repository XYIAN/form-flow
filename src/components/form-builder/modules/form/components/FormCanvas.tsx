'use client'

import React, { useState } from 'react'

import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Badge } from 'primereact/badge'
import { FormField } from '@/types'
import FormSection from './FormSection'
import { useFormHistory } from '../../../shared/hooks/useFormHistory'

interface FormCanvasProps {
	fields: FormField[]
	onFieldsChange: (fields: FormField[]) => void
	onFieldSelect: (field: FormField | null) => void
	selectedFieldId?: string
	className?: string
}

interface GridPosition {
	row: number
	col: number
}

export default function FormCanvas({
	fields,
	onFieldsChange,
	onFieldSelect,
	selectedFieldId,
	className = '',
}: FormCanvasProps) {
	const [gridSize] = useState({ rows: 12, cols: 12 })
	const [showGrid, setShowGrid] = useState(true)
	const [snapToGrid, setSnapToGrid] = useState(true)

	const { canUndo, canRedo, undo, redo } = useFormHistory(
		fields,
		onFieldsChange
	)

	// Create grid system for field positioning
	// const createGridSystem = () => {
	// 	const grid: (FormField | null)[][] = Array(gridSize.rows)
	// 		.fill(null)
	// 		.map(() => Array(gridSize.cols).fill(null))

	// 	// Place existing fields in grid
	// 	fields.forEach(field => {
	// 		const position = getFieldPosition(field)
	// 		if (position && position.row < gridSize.rows && position.col < gridSize.cols) {
	// 			grid[position.row][position.col] = field
	// 		}
	// 	})

	// 	return grid
	// }

	// const getFieldPosition = (field: FormField): GridPosition | null => {
	// 	// For now, use a simple positioning system
	// 	// In a real implementation, this would come from field metadata
	// 	const index = fields.indexOf(field)
	// 	if (index === -1) return null

	// 	const row = Math.floor(index / gridSize.cols)
	// 	const col = index % gridSize.cols
	// 	return { row, col }
	// }

	// const addFieldToGrid = (field: FormField, position: GridPosition) => {
	// 	const newField = {
	// 		...field,
	// 		id: field.id || `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
	// 	}

	// 	// Find the next available position if the specified position is occupied
	// 	let targetPosition = position
	// 	while (isPositionOccupied(targetPosition)) {
	// 		targetPosition = getNextAvailablePosition(targetPosition)
	// 	}

	// 	// Add field to the specified position
	// 	const newFields = [...fields, newField]
	// 	onFieldsChange(newFields)
	// 	onFieldSelect(newField)
	// }

	// const isPositionOccupied = (position: GridPosition): boolean => {
	// 	return fields.some(field => {
	// 		const fieldPos = getFieldPosition(field)
	// 		return (
	// 			fieldPos &&
	// 			fieldPos.row === position.row &&
	// 			fieldPos.col === position.col
	// 		)
	// 	})
	// }

	// const getNextAvailablePosition = (
	// 	startPosition: GridPosition
	// ): GridPosition => {
	// 	let { row, col } = startPosition

	// 	// Try to find next available position
	// 	while (row < gridSize.rows) {
	// 		while (col < gridSize.cols) {
	// 			if (!isPositionOccupied({ row, col })) {
	// 				return { row, col }
	// 			}
	// 			col++
	// 		}
	// 		row++
	// 		col = 0
	// 	}

	// 	// If no position found, return the start position
	// 	return startPosition
	// }

	const removeField = (fieldId: string) => {
		const newFields = fields.filter(field => field.id !== fieldId)
		onFieldsChange(newFields)
		onFieldSelect(null)
	}

	const moveField = (fieldId: string, newPosition: GridPosition) => {
		// Implementation for moving fields within the grid
		// This would update the field's position metadata
		console.log(`Moving field ${fieldId} to position`, newPosition)
	}

	const duplicateField = (field: FormField) => {
		const newField: FormField = {
			...field,
			id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			label: `${field.label} (Copy)`,
		}

		const newFields = [...fields, newField]
		onFieldsChange(newFields)
		onFieldSelect(newField)
	}

	// Group fields into sections for better organization
	const groupFieldsIntoSections = () => {
		const sections: { title: string; fields: FormField[] }[] = []
		let currentSection = { title: 'Section 1', fields: [] as FormField[] }

		fields.forEach((field, index) => {
			// Create a new section every 6 fields or when we have a section break
			if (index > 0 && index % 6 === 0) {
				sections.push(currentSection)
				currentSection = {
					title: `Section ${sections.length + 1}`,
					fields: [],
				}
			}
			currentSection.fields.push(field)
		})

		if (currentSection.fields.length > 0) {
			sections.push(currentSection)
		}

		return sections
	}

	const sections = groupFieldsIntoSections()

	const toolbarStart = (
		<div className='flex items-center gap-2'>
			<Button
				icon='pi pi-undo'
				className='p-button-text p-button-sm'
				disabled={!canUndo}
				onClick={undo}
				tooltip='Undo (Ctrl+Z)'
			/>
			<Button
				icon='pi pi-refresh'
				className='p-button-text p-button-sm'
				disabled={!canRedo}
				onClick={redo}
				tooltip='Redo (Ctrl+Y)'
			/>
			<div className='w-px h-6 bg-gray-600' />
			<Button
				icon={showGrid ? 'pi pi-eye' : 'pi pi-eye-slash'}
				className='p-button-text p-button-sm'
				onClick={() => setShowGrid(!showGrid)}
				tooltip={showGrid ? 'Hide Grid' : 'Show Grid'}
			/>
			<Button
				icon={snapToGrid ? 'pi pi-th-large' : 'pi pi-th'}
				className={`p-button-text p-button-sm ${
					snapToGrid ? 'text-purple-400' : ''
				}`}
				onClick={() => setSnapToGrid(!snapToGrid)}
				tooltip={snapToGrid ? 'Snap to Grid' : 'Free Position'}
			/>
		</div>
	)

	const toolbarEnd = (
		<div className='flex items-center gap-2'>
			<Badge value={fields.length} severity='info' />
			<span className='text-sm text-gray-400'>fields</span>
		</div>
	)

	return (
		<Card className={`h-full ${className}`}>
			<div className='p-4 border-b border-gray-600'>
				<Toolbar
					start={toolbarStart}
					end={toolbarEnd}
					className='border-0 bg-transparent'
				/>
			</div>

			<div className='p-4 h-full overflow-auto'>
				{fields.length === 0 ? (
					<EmptyCanvas />
				) : (
					<div className='space-y-6'>
						{sections.map((section, index) => (
							<FormSection
								key={index}
								title={section.title}
								fields={section.fields}
								onFieldSelect={onFieldSelect}
								onFieldRemove={removeField}
								onFieldDuplicate={duplicateField}
								onFieldMove={moveField}
								selectedFieldId={selectedFieldId}
								showGrid={showGrid}
								snapToGrid={snapToGrid}
								gridSize={gridSize}
							/>
						))}
					</div>
				)}
			</div>
		</Card>
	)
}

function EmptyCanvas() {
	return (
		<div className='flex flex-col items-center justify-center h-64 text-center'>
			<div className='mb-4'>
				<i className='pi pi-plus-circle text-4xl text-gray-500' />
			</div>
			<h3 className='text-lg font-medium text-gray-300 mb-2'>
				Start Building Your Form
			</h3>
			<p className='text-gray-500 mb-4 max-w-md'>
				Drag fields from the palette on the left to start building your form.
				You can organize fields into sections and customize their properties.
			</p>
			<div className='flex gap-2 text-sm text-gray-400'>
				<div className='flex items-center gap-1'>
					<i className='pi pi-mouse-pointer' />
					<span>Drag & Drop</span>
				</div>
				<div className='flex items-center gap-1'>
					<i className='pi pi-th-large' />
					<span>Grid System</span>
				</div>
				<div className='flex items-center gap-1'>
					<i className='pi pi-cog' />
					<span>Customize</span>
				</div>
			</div>
		</div>
	)
}
