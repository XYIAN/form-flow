'use client'

import React, { useState, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { Badge } from 'primereact/badge'
import { FormField } from '@/types'

interface GridPosition {
	row: number
	col: number
	span: number
}

interface GridSystemProps {
	fields: FormField[]
	onFieldSelect: (field: FormField | null) => void
	onFieldRemove: (fieldId: string) => void
	onFieldMove: (fieldId: string, newPosition: GridPosition) => void
	onFieldAdd: (field: FormField, position: GridPosition) => void
	selectedFieldId?: string
	className?: string
}

const GRID_COLUMNS = 12
const BREAKPOINTS = [
	{ label: 'Mobile (320px)', value: 'mobile', columns: 1 },
	{ label: 'Tablet (768px)', value: 'tablet', columns: 6 },
	{ label: 'Desktop (1024px)', value: 'desktop', columns: 12 },
	{ label: 'Large (1440px)', value: 'large', columns: 12 },
]

export default function GridSystem({
	fields,
	onFieldSelect,
	onFieldRemove,
	onFieldMove,
	onFieldAdd,
	selectedFieldId,
	className = '',
}: GridSystemProps) {
	const [currentBreakpoint, setCurrentBreakpoint] = useState('desktop')
	const [showGrid, setShowGrid] = useState(true)
	const [snapToGrid, setSnapToGrid] = useState(true)

	const getFieldPosition = useCallback(
		(field: FormField): GridPosition => {
			// Get field position from metadata or calculate from index
			const index = fields.indexOf(field)
			if (index === -1) return { row: 0, col: 0, span: 6 }

			const row = Math.floor(index / 2) // 2 fields per row
			const col = (index % 2) * 6 // 6 columns per field
			return { row, col, span: 6 }
		},
		[fields]
	)

	const isPositionOccupied = useCallback(
		(position: GridPosition): boolean => {
			return fields.some(field => {
				const fieldPos = getFieldPosition(field)
				return (
					fieldPos.row === position.row &&
					fieldPos.col <= position.col &&
					fieldPos.col + fieldPos.span > position.col
				)
			})
		},
		[fields, getFieldPosition]
	)

	const getNextAvailablePosition = useCallback(
		(startPosition: GridPosition): GridPosition => {
			let { row, col } = startPosition

			// Try to find next available position
			while (row < 20) {
				// Max 20 rows
				while (col < GRID_COLUMNS) {
					const testPosition = { row, col, span: 6 }
					if (!isPositionOccupied(testPosition)) {
						return testPosition
					}
					col += 6
				}
				row++
				col = 0
			}

			// If no position found, return the start position
			return startPosition
		},
		[isPositionOccupied]
	)

	const renderGridLines = () => {
		if (!showGrid) return null

		const lines = []
		const currentColumns =
			BREAKPOINTS.find(bp => bp.value === currentBreakpoint)?.columns || 12

		// Vertical lines
		for (let i = 0; i <= currentColumns; i++) {
			lines.push(
				<div
					key={`v-${i}`}
					className='absolute top-0 bottom-0 border-l border-gray-600 opacity-30'
					style={{ left: `${(i / currentColumns) * 100}%` }}
				/>
			)
		}

		// Horizontal lines (every 4 rows)
		for (let i = 0; i < 20; i++) {
			lines.push(
				<div
					key={`h-${i}`}
					className='absolute left-0 right-0 border-t border-gray-600 opacity-30'
					style={{ top: `${i * 80}px` }}
				/>
			)
		}

		return <div className='absolute inset-0 pointer-events-none'>{lines}</div>
	}

	const renderField = (field: FormField) => {
		const position = getFieldPosition(field)
		const isSelected = selectedFieldId === field.id

		return (
			<div
				key={field.id}
				className={`
					absolute border rounded-lg cursor-pointer transition-all duration-200
					${
						isSelected
							? 'border-purple-400 bg-purple-900/20'
							: 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
					}
				`}
				style={{
					left: `${(position.col / GRID_COLUMNS) * 100}%`,
					top: `${position.row * 80}px`,
					width: `${(position.span / GRID_COLUMNS) * 100}%`,
					height: '72px',
				}}
				onClick={() => onFieldSelect(field)}
			>
				<div className='p-2 h-full flex flex-col justify-between'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-1'>
							<i className='pi pi-circle-fill text-xs text-purple-400' />
							<span className='font-medium text-white text-xs truncate'>
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
								onClick={e => {
									e.stopPropagation()
									onFieldRemove(field.id)
								}}
								tooltip='Remove Field'
							/>
						</div>
					</div>
					<div className='text-xs text-gray-400 truncate'>
						{field.type} • {field.placeholder || 'No placeholder'}
					</div>
				</div>
			</div>
		)
	}

	return (
		<Card className={`h-full ${className}`}>
			<div className='p-4 border-b border-gray-600'>
				<div className='flex items-center justify-between mb-3'>
					<h3 className='text-lg font-semibold text-white'>Grid System</h3>
					<div className='flex items-center gap-2'>
						<Badge value={fields.length} severity='info' />
						<span className='text-sm text-gray-400'>fields</span>
					</div>
				</div>

				{/* Grid Controls */}
				<div className='flex items-center gap-4'>
					<div className='flex items-center gap-2'>
						<label className='text-sm text-gray-300'>Breakpoint:</label>
						<Dropdown
							value={currentBreakpoint}
							options={BREAKPOINTS}
							onChange={e => setCurrentBreakpoint(e.value)}
							className='w-40'
						/>
					</div>

					<div className='flex items-center gap-2'>
						<Button
							icon={showGrid ? 'pi pi-eye' : 'pi pi-eye-slash'}
							className={`p-button-text p-button-sm ${
								showGrid ? 'text-purple-400' : ''
							}`}
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
				</div>
			</div>

			{/* Grid Canvas */}
			<div className='p-4 h-full overflow-auto relative'>
				<div className='relative min-h-96'>
					{/* Grid Lines */}
					{renderGridLines()}

					{/* Fields */}
					{fields.map(renderField)}

					{/* Empty State */}
					{fields.length === 0 && (
						<div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
							<i className='pi pi-th-large text-4xl text-gray-500 mb-4' />
							<h3 className='text-lg font-medium text-gray-300 mb-2'>
								Empty Grid
							</h3>
							<p className='text-gray-500 mb-4 max-w-md'>
								Drag fields from the palette to start building your form. Use
								the grid system to create responsive layouts.
							</p>
							<div className='flex gap-2 text-sm text-gray-400'>
								<div className='flex items-center gap-1'>
									<i className='pi pi-mobile' />
									<span>Responsive</span>
								</div>
								<div className='flex items-center gap-1'>
									<i className='pi pi-th-large' />
									<span>Grid System</span>
								</div>
								<div className='flex items-center gap-1'>
									<i className='pi pi-cog' />
									<span>Customizable</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</Card>
	)
}
