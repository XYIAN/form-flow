'use client'

import React from 'react'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'

interface LayoutToolbarProps {
	onAddRow: () => void
	onAddColumn: () => void
	onAddTab: () => void
	onAddAccordion: () => void
	onAddSpacer: () => void
	onGridSizeChange: (size: number) => void
	onGapChange: (gap: number) => void
	onBreakpointChange: (breakpoint: string) => void
	gridSize: number
	gap: number
	currentBreakpoint: string
	className?: string
}

const BREAKPOINT_OPTIONS = [
	{ label: 'Mobile (320px)', value: 'mobile' },
	{ label: 'Tablet (768px)', value: 'tablet' },
	{ label: 'Desktop (1024px)', value: 'desktop' },
	{ label: 'Large (1440px)', value: 'large' },
]

const GRID_SIZE_OPTIONS = [
	{ label: '6 Columns', value: 6 },
	{ label: '12 Columns', value: 12 },
	{ label: '16 Columns', value: 16 },
	{ label: '24 Columns', value: 24 },
]

export default function LayoutToolbar({
	onAddRow,
	onAddColumn,
	onAddTab,
	onAddAccordion,
	onAddSpacer,
	onGridSizeChange,
	onGapChange,
	onBreakpointChange,
	gridSize,
	gap,
	currentBreakpoint,
	className = '',
}: LayoutToolbarProps) {
	return (
		<div className={`p-4 border-b border-gray-600 bg-gray-800/50 ${className}`}>
			<div className='flex items-center justify-between'>
				{/* Layout Actions */}
				<div className='flex items-center gap-2'>
					<span className='text-sm font-medium text-gray-300 mr-2'>
						Add Layout:
					</span>

					<Button
						icon='pi pi-th-large'
						label='Row'
						className='p-button-sm p-button-outlined'
						onClick={onAddRow}
						tooltip='Add Row Container'
					/>

					<Button
						icon='pi pi-columns'
						label='Column'
						className='p-button-sm p-button-outlined'
						onClick={onAddColumn}
						tooltip='Add Column Container'
					/>

					<Button
						icon='pi pi-window-maximize'
						label='Tab'
						className='p-button-sm p-button-outlined'
						onClick={onAddTab}
						tooltip='Add Tab Container'
					/>

					<Button
						icon='pi pi-list'
						label='Accordion'
						className='p-button-sm p-button-outlined'
						onClick={onAddAccordion}
						tooltip='Add Accordion Container'
					/>

					<Button
						icon='pi pi-minus'
						label='Spacer'
						className='p-button-sm p-button-outlined'
						onClick={onAddSpacer}
						tooltip='Add Spacer'
					/>
				</div>

				{/* Grid Controls */}
				<div className='flex items-center gap-4'>
					<div className='flex items-center gap-2'>
						<label className='text-sm text-gray-300'>Grid Size:</label>
						<Dropdown
							value={gridSize}
							options={GRID_SIZE_OPTIONS}
							onChange={e => onGridSizeChange(e.value)}
							className='w-32'
						/>
					</div>

					<div className='flex items-center gap-2'>
						<label className='text-sm text-gray-300'>Gap:</label>
						<InputNumber
							value={gap}
							onValueChange={e => onGapChange(e.value || 16)}
							min={0}
							max={100}
							suffix='px'
							className='w-20'
						/>
					</div>

					<div className='flex items-center gap-2'>
						<label className='text-sm text-gray-300'>Breakpoint:</label>
						<Dropdown
							value={currentBreakpoint}
							options={BREAKPOINT_OPTIONS}
							onChange={e => onBreakpointChange(e.value)}
							className='w-40'
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
