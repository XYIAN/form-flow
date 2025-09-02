'use client'

import React, { useState, useCallback } from 'react'
import { Card } from 'primereact/card'
import { TabView, TabPanel } from 'primereact/tabview'
import { FormField } from '@/types'
import DragDropProvider from './shared/providers/DragDropProvider'
import FieldPalette from './modules/component-library/components/FieldPalette'
import FormCanvas from './modules/form/components/FormCanvas'
import PropertiesPanel from './modules/form/components/PropertiesPanel'
import LayoutSystem from './modules/layout-system/components/LayoutSystem'
import { useFormHistory } from './shared/hooks/useFormHistory'
import { useKeyboardShortcuts } from './shared/hooks/useKeyboardShortcuts'

interface FormBuilderProps {
	initialFields?: FormField[]
	onFieldsChange?: (fields: FormField[]) => void
	onFormSave?: (fields: FormField[]) => void
	className?: string
}

export default function FormBuilder({
	initialFields = [],
	onFieldsChange,
	onFormSave,
	className = '',
}: FormBuilderProps) {
	const [fields, setFields] = useState<FormField[]>(initialFields)
	const [selectedField, setSelectedField] = useState<FormField | null>(null)
	const [activeTab, setActiveTab] = useState(0)
	const [useAdvancedLayout, setUseAdvancedLayout] = useState(false)

	// Form history management
	const { canUndo, canRedo, undo, redo, saveState } = useFormHistory(
		fields,
		setFields
	)

	// Keyboard shortcuts
	useKeyboardShortcuts({
		onUndo: canUndo ? undo : undefined,
		onRedo: canRedo ? redo : undefined,
		onSave: handleSave,
		onPreview: () => setActiveTab(2),
	})

	// Handle field changes
	const handleFieldsChange = useCallback(
		(newFields: FormField[]) => {
			setFields(newFields)
			onFieldsChange?.(newFields)
			saveState(newFields)
		},
		[onFieldsChange, saveState]
	)

	// Handle field addition
	const handleFieldAdd = useCallback(
		(field: FormField, position?: { row: number; col: number }) => {
			const newField = {
				...field,
				id:
					field.id ||
					`field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			}

			const newFields = [...fields, newField]
			handleFieldsChange(newFields)
			setSelectedField(newField)

			console.log('➕ Field added:', {
				field: newField,
				position,
				totalFields: newFields.length,
			})
		},
		[fields, handleFieldsChange]
	)

	// Handle field movement
	const handleFieldMove = useCallback(
		(fieldId: string, newIndex: number) => {
			const currentIndex = fields.findIndex(f => f.id === fieldId)
			if (currentIndex === -1 || currentIndex === newIndex) return

			const newFields = [...fields]
			const [movedField] = newFields.splice(currentIndex, 1)
			newFields.splice(newIndex, 0, movedField)

			handleFieldsChange(newFields)

			console.log('🔄 Field moved:', {
				fieldId,
				from: currentIndex,
				to: newIndex,
			})
		},
		[fields, handleFieldsChange]
	)

	// Handle field selection
	const handleFieldSelect = useCallback((field: FormField | null) => {
		setSelectedField(field)
		console.log('🎯 Field selected:', field?.id || 'none')
	}, [])

	// Handle field update
	const handleFieldUpdate = useCallback(
		(updatedField: FormField) => {
			const newFields = fields.map(field =>
				field.id === updatedField.id ? updatedField : field
			)
			handleFieldsChange(newFields)
			setSelectedField(updatedField)

			console.log('✏️ Field updated:', updatedField)
		},
		[fields, handleFieldsChange]
	)

	// Handle field removal
	const handleFieldRemove = useCallback(
		(fieldId: string) => {
			const newFields = fields.filter(field => field.id !== fieldId)
			handleFieldsChange(newFields)

			if (selectedField?.id === fieldId) {
				setSelectedField(null)
			}

			console.log('🗑️ Field removed:', fieldId)
		},
		[fields, handleFieldsChange, selectedField]
	)

	// Handle form save
	const handleSave = useCallback(() => {
		onFormSave?.(fields)
		console.log('💾 Form saved:', { fieldCount: fields.length })
	}, [fields, onFormSave])

	return (
		<div className={`form-builder h-full ${className}`}>
			<DragDropProvider
				fields={fields}
				onFieldsChange={handleFieldsChange}
				onFieldAdd={handleFieldAdd}
				onFieldMove={handleFieldMove}
				onFieldSelect={handleFieldSelect}
			>
				<div className='grid h-full'>
					{/* Left Sidebar - Field Palette */}
					<div className='col-12 lg:col-3'>
						<FieldPalette className='h-full' />
					</div>

					{/* Main Content Area */}
					<div className='col-12 lg:col-6'>
						{useAdvancedLayout ? (
							<LayoutSystem
								fields={fields}
								onFieldsChange={handleFieldsChange}
								onFieldSelect={handleFieldSelect}
								onFieldRemove={handleFieldRemove}
								onFieldMove={handleFieldMove}
								onFieldAdd={handleFieldAdd}
								selectedFieldId={selectedField?.id}
								className='h-full'
							/>
						) : (
							<FormCanvas
								fields={fields}
								onFieldsChange={handleFieldsChange}
								onFieldSelect={handleFieldSelect}
								selectedFieldId={selectedField?.id}
								className='h-full'
							/>
						)}
					</div>

					{/* Right Sidebar - Properties Panel */}
					<div className='col-12 lg:col-3'>
						<PropertiesPanel
							selectedField={selectedField}
							onFieldUpdate={handleFieldUpdate}
							onFieldRemove={handleFieldRemove}
							className='h-full'
						/>
					</div>
				</div>

				{/* Bottom Panel - Tabs for additional features */}
				<div className='col-12 mt-4'>
					<Card>
						<TabView
							activeIndex={activeTab}
							onTabChange={e => setActiveTab(e.index)}
						>
							<TabPanel header='Form Settings' leftIcon='pi pi-cog'>
								<div className='p-4'>
									<h3 className='text-lg font-semibold text-white mb-4'>
										Form Settings
									</h3>

									{/* Layout Mode Toggle */}
									<div className='mb-6 p-4 border border-gray-600 rounded-lg bg-gray-800/50'>
										<div className='flex items-center justify-between mb-3'>
											<div>
												<h4 className='text-md font-medium text-white mb-1'>
													Layout Mode
												</h4>
												<p className='text-sm text-gray-400'>
													Choose between basic canvas or advanced layout system
												</p>
											</div>
											<button
												onClick={() => setUseAdvancedLayout(!useAdvancedLayout)}
												className={`
													px-4 py-2 rounded transition-colors
													${
														useAdvancedLayout
															? 'bg-purple-600 hover:bg-purple-700 text-white'
															: 'bg-gray-600 hover:bg-gray-500 text-gray-300'
													}
												`}
											>
												{useAdvancedLayout ? 'Advanced Layout' : 'Basic Canvas'}
											</button>
										</div>
										<div className='text-xs text-gray-500'>
											{useAdvancedLayout
												? 'Advanced layout system with rows, columns, tabs, and accordions'
												: 'Simple canvas with drag-and-drop field placement'}
										</div>
									</div>

									<div className='grid'>
										<div className='col-12 md:col-6'>
											<div className='field'>
												<label
													htmlFor='formTitle'
													className='block text-sm font-medium text-gray-300 mb-2'
												>
													Form Title
												</label>
												<input
													id='formTitle'
													type='text'
													className='w-full p-2 border border-gray-600 rounded bg-gray-800 text-white'
													placeholder='Enter form title...'
													defaultValue='Untitled Form'
												/>
											</div>
										</div>
										<div className='col-12 md:col-6'>
											<div className='field'>
												<label
													htmlFor='formDescription'
													className='block text-sm font-medium text-gray-300 mb-2'
												>
													Description
												</label>
												<textarea
													id='formDescription'
													className='w-full p-2 border border-gray-600 rounded bg-gray-800 text-white'
													rows={3}
													placeholder='Enter form description...'
												/>
											</div>
										</div>
									</div>
								</div>
							</TabPanel>

							<TabPanel header='Preview' leftIcon='pi pi-eye'>
								<div className='p-4'>
									<h3 className='text-lg font-semibold text-white mb-4'>
										Form Preview
									</h3>
									<div className='bg-gray-800 p-4 rounded border border-gray-600'>
										{fields.length === 0 ? (
											<div className='text-center py-8 text-gray-400'>
												<i className='pi pi-eye-slash text-2xl mb-2' />
												<div>No fields to preview</div>
											</div>
										) : (
											<div className='space-y-4'>
												{fields.map(field => (
													<div key={field.id} className='field'>
														<label className='block text-sm font-medium text-gray-300 mb-1'>
															{field.label}
															{field.required && (
																<span className='text-red-400 ml-1'>*</span>
															)}
														</label>
														<div className='p-2 border border-gray-600 rounded bg-gray-700 text-gray-300'>
															{field.placeholder || `Enter ${field.type}...`}
														</div>
													</div>
												))}
											</div>
										)}
									</div>
								</div>
							</TabPanel>

							<TabPanel header='Export' leftIcon='pi pi-download'>
								<div className='p-4'>
									<h3 className='text-lg font-semibold text-white mb-4'>
										Export Form
									</h3>
									<div className='grid'>
										<div className='col-12 md:col-4'>
											<button
												onClick={handleSave}
												className='w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors'
											>
												<i className='pi pi-save mr-2' />
												Save Form
											</button>
										</div>
										<div className='col-12 md:col-4'>
											<button
												onClick={() => console.log('Export JSON')}
												className='w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors'
											>
												<i className='pi pi-file mr-2' />
												Export JSON
											</button>
										</div>
										<div className='col-12 md:col-4'>
											<button
												onClick={() => console.log('Export HTML')}
												className='w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded transition-colors'
											>
												<i className='pi pi-code mr-2' />
												Export HTML
											</button>
										</div>
									</div>
								</div>
							</TabPanel>
						</TabView>
					</Card>
				</div>
			</DragDropProvider>
		</div>
	)
}
