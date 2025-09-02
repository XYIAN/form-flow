'use client'

import React, { useState, useCallback } from 'react'
// import { Card } from 'primereact/card'
import { FormField } from '@/types'
import RowContainer from './RowContainer'
import ColumnContainer from './ColumnContainer'
import TabContainer from './TabContainer'
import AccordionContainer from './AccordionContainer'
import GridSystem from './GridSystem'
import LayoutToolbar from './LayoutToolbar'

interface LayoutComponent {
	id: string
	type: 'row' | 'column' | 'tab' | 'accordion' | 'grid' | 'spacer'
	title: string
	fields: FormField[]
	config: Record<string, unknown>
}

interface LayoutSystemProps {
	fields: FormField[]
	onFieldSelect: (field: FormField | null) => void
	onFieldRemove: (fieldId: string) => void
	onFieldMove: (fieldId: string, newIndex: number) => void
	onFieldAdd: (
		field: FormField,
		position?: { row: number; col: number }
	) => void
	onFieldsChange?: (fields: FormField[]) => void
	selectedFieldId?: string
	className?: string
}

export default function LayoutSystem({
	fields,
	onFieldSelect,
	onFieldRemove,
	onFieldMove,
	onFieldAdd,
	onFieldsChange,
	selectedFieldId,
	className = '',
}: LayoutSystemProps) {
	const [layoutComponents, setLayoutComponents] = useState<LayoutComponent[]>([
		{
			id: 'default-grid',
			type: 'grid',
			title: 'Main Grid',
			fields: fields,
			config: { columns: 12, gap: 16, breakpoint: 'desktop' },
		},
	])
	const [activeLayout, setActiveLayout] = useState('default-grid')
	const [gridSize, setGridSize] = useState(12)
	const [gap, setGap] = useState(16)
	const [currentBreakpoint, setCurrentBreakpoint] = useState('desktop')

	// Layout Actions
	const handleAddRow = useCallback(() => {
		const newRow: LayoutComponent = {
			id: `row-${Date.now()}`,
			type: 'row',
			title: 'New Row',
			fields: [],
			config: { columns: 12, gap: 16 },
		}
		setLayoutComponents(prev => [...prev, newRow])
	}, [])

	const handleAddColumn = useCallback(() => {
		const newColumn: LayoutComponent = {
			id: `column-${Date.now()}`,
			type: 'column',
			title: 'New Column',
			fields: [],
			config: { width: 6, gap: 16 },
		}
		setLayoutComponents(prev => [...prev, newColumn])
	}, [])

	const handleAddTab = useCallback(() => {
		const newTab: LayoutComponent = {
			id: `tab-${Date.now()}`,
			type: 'tab',
			title: 'New Tab Container',
			fields: [],
			config: {
				tabs: [
					{ id: 'tab-1', label: 'Tab 1', fields: [] },
					{ id: 'tab-2', label: 'Tab 2', fields: [] },
				],
			},
		}
		setLayoutComponents(prev => [...prev, newTab])
	}, [])

	const handleAddAccordion = useCallback(() => {
		const newAccordion: LayoutComponent = {
			id: `accordion-${Date.now()}`,
			type: 'accordion',
			title: 'New Accordion Container',
			fields: [],
			config: {
				sections: [
					{ id: 'section-1', label: 'Section 1', fields: [] },
					{ id: 'section-2', label: 'Section 2', fields: [] },
				],
			},
		}
		setLayoutComponents(prev => [...prev, newAccordion])
	}, [])

	const handleAddSpacer = useCallback(() => {
		const newSpacer: LayoutComponent = {
			id: `spacer-${Date.now()}`,
			type: 'spacer',
			title: 'Spacer',
			fields: [],
			config: { height: 40 },
		}
		setLayoutComponents(prev => [...prev, newSpacer])
	}, [])

	const handleRemoveLayout = useCallback(
		(layoutId: string) => {
			setLayoutComponents(prev => prev.filter(layout => layout.id !== layoutId))
			if (activeLayout === layoutId) {
				setActiveLayout('default-grid')
			}
		},
		[activeLayout]
	)

	// Field Management
	const handleFieldAdd = useCallback(
		(field: FormField, position?: { row: number; col: number }) => {
			onFieldAdd(field, position)
		},
		[onFieldAdd]
	)

	const handleFieldRemove = useCallback(
		(fieldId: string) => {
			onFieldRemove(fieldId)
			// Remove field from all layout components
			setLayoutComponents(prev =>
				prev.map(layout => ({
					...layout,
					fields: layout.fields.filter(field => field.id !== fieldId),
				}))
			)
		},
		[onFieldRemove]
	)

	const handleFieldMove = useCallback(
		(fieldId: string, newIndex: number) => {
			onFieldMove(fieldId, newIndex)
		},
		[onFieldMove]
	)

	// Render Layout Component
	const renderLayoutComponent = (layout: LayoutComponent) => {
		const commonProps = {
			id: layout.id,
			title: layout.title,
			fields: layout.fields,
			onFieldSelect,
			onFieldRemove: handleFieldRemove,
			onFieldMove: handleFieldMove,
			onFieldAdd: handleFieldAdd,
			selectedFieldId,
		}

		switch (layout.type) {
			case 'row':
				return (
					<RowContainer
						{...commonProps}
						columns={(layout.config.columns as number) || 12}
						gap={(layout.config.gap as number) || 16}
					/>
				)
			case 'column':
				return (
					<ColumnContainer
						{...commonProps}
						width={(layout.config.width as number) || 6}
						gap={(layout.config.gap as number) || 16}
					/>
				)
			case 'tab':
				return (
					<TabContainer
						{...commonProps}
						tabs={
							(layout.config.tabs as Array<{
								id: string
								label: string
								fields: FormField[]
							}>) || []
						}
						onTabAdd={() => {}}
						onTabRemove={() => {}}
						onTabRename={() => {}}
					/>
				)
			case 'accordion':
				return (
					<AccordionContainer
						{...commonProps}
						sections={
							(layout.config.sections as Array<{
								id: string
								label: string
								fields: FormField[]
							}>) || []
						}
						onSectionAdd={() => {}}
						onSectionRemove={() => {}}
						onSectionRename={() => {}}
					/>
				)
			case 'grid':
				return (
					<GridSystem
						{...commonProps}
						onFieldMove={(fieldId, position) => {
							console.log('Grid field move:', fieldId, position)
						}}
					/>
				)
			case 'spacer':
				return (
					<div
						className='w-full bg-gray-700 border border-gray-600 rounded'
						style={{ height: `${layout.config.height || 40}px` }}
					>
						<div className='flex items-center justify-center h-full text-gray-400 text-sm'>
							<i className='pi pi-minus mr-2' />
							Spacer ({layout.config.height}px)
						</div>
					</div>
				)
			default:
				return null
		}
	}

	return (
		<div className={`h-full flex flex-col ${className}`}>
			{/* Layout Toolbar */}
			<LayoutToolbar
				onAddRow={handleAddRow}
				onAddColumn={handleAddColumn}
				onAddTab={handleAddTab}
				onAddAccordion={handleAddAccordion}
				onAddSpacer={handleAddSpacer}
				onGridSizeChange={setGridSize}
				onGapChange={setGap}
				onBreakpointChange={setCurrentBreakpoint}
				gridSize={gridSize}
				gap={gap}
				currentBreakpoint={currentBreakpoint}
			/>

			{/* Layout Components */}
			<div className='flex-1 overflow-auto p-4'>
				{layoutComponents.length === 0 ? (
					<div className='text-center py-12 text-gray-400'>
						<i className='pi pi-th-large text-4xl mb-4' />
						<h3 className='text-lg font-medium text-gray-300 mb-2'>
							No Layout Components
						</h3>
						<p className='text-gray-500 mb-4'>
							Add layout components to organize your form fields
						</p>
						<div className='flex gap-2 justify-center'>
							<button
								onClick={handleAddRow}
								className='px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors'
							>
								Add Row
							</button>
							<button
								onClick={handleAddColumn}
								className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors'
							>
								Add Column
							</button>
						</div>
					</div>
				) : (
					<div className='space-y-4'>
						{layoutComponents.map(layout => (
							<div key={layout.id} className='relative'>
								{renderLayoutComponent(layout)}
								<button
									onClick={() => handleRemoveLayout(layout.id)}
									className='absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity'
									title='Remove Layout Component'
								>
									<i className='pi pi-times text-xs' />
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
