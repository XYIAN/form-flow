'use client'

import React, { useState, useCallback } from 'react'
import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragStartEvent,
	DragOverlay,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { FormField, FieldType } from '@/types'
import { createPortal } from 'react-dom'

interface DragDropProviderProps {
	children: React.ReactNode
	fields: FormField[]
	onFieldsChange: (fields: FormField[]) => void
	onFieldAdd: (
		field: FormField,
		position?: { row: number; col: number }
	) => void
	onFieldMove?: (fieldId: string, newIndex: number) => void
	onFieldSelect: (field: FormField | null) => void
}

interface DragData {
	type: 'field' | 'existing-field'
	fieldType?: string
	config?: unknown
	field?: FormField
}

export default function DragDropProvider({
	children,
	fields,
	onFieldsChange,
	onFieldAdd,
	onFieldMove,
	onFieldSelect,
}: DragDropProviderProps) {
	const [activeId, setActiveId] = useState<string | null>(null)
	const [activeData, setActiveData] = useState<DragData | null>(null)

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	const handleDragStart = useCallback((event: DragStartEvent) => {
		const { active } = event
		setActiveId(active.id as string)

		// Get drag data from the active element
		const dragData = active.data.current as DragData
		setActiveData(dragData)

		console.log('🎯 Drag started:', {
			id: active.id,
			type: dragData?.type,
			fieldType: dragData?.fieldType,
		})
	}, [])

	const handleDragOver = useCallback((event: DragOverEvent) => {
		const { active, over } = event

		if (!over) return

		console.log('🔄 Drag over:', {
			activeId: active.id,
			overId: over.id,
			overData: over.data.current,
		})
	}, [])

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event

			setActiveId(null)
			setActiveData(null)

			if (!over) {
				console.log('❌ Drag ended without drop target')
				return
			}

			const dragData = active.data.current as DragData
			const dropData = over.data.current

			console.log('✅ Drag ended:', {
				activeId: active.id,
				overId: over.id,
				dragType: dragData?.type,
				dropType: dropData?.type,
			})

			// Handle different drag scenarios
			if (dragData?.type === 'field' && dropData?.type === 'canvas') {
				// New field being added to canvas
				handleNewFieldDrop(dragData, dropData)
			} else if (
				dragData?.type === 'existing-field' &&
				dropData?.type === 'canvas'
			) {
				// Existing field being moved within canvas
				handleExistingFieldMove(dragData, dropData)
			} else if (
				dragData?.type === 'existing-field' &&
				dropData?.type === 'field'
			) {
				// Field being reordered
				handleFieldReorder(dragData, dropData)
			}
		},
		[handleNewFieldDrop, handleExistingFieldMove, handleFieldReorder]
	)

	const handleNewFieldDrop = useCallback(
		(dragData: DragData) => {
			if (!dragData.fieldType) return

			// Create new field from the dragged field type
			const newField: FormField = {
				id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				label: `New ${dragData.fieldType} Field`,
				type: dragData.fieldType as FieldType,
				required: false,
				placeholder: `Enter ${dragData.fieldType}...`,
			}

			// Add field to the form
			onFieldAdd(newField)
			onFieldSelect(newField)

			console.log('➕ New field added:', newField)
		},
		[onFieldAdd, onFieldSelect]
	)

	const handleExistingFieldMove = useCallback((dragData: DragData) => {
		if (!dragData.field) return

		// Handle moving existing field to new position
		// This would involve updating the field's position metadata
		console.log('🔄 Field moved:', dragData.field.id)
	}, [])

	const handleFieldReorder = useCallback(
		(dragData: DragData, dropData: { fieldId: string }) => {
			if (!dragData.field) return

			const dragIndex = fields.findIndex(
				field => field.id === dragData.field!.id
			)
			const dropIndex = fields.findIndex(field => field.id === dropData.fieldId)

			if (dragIndex !== -1 && dropIndex !== -1 && dragIndex !== dropIndex) {
				const newFields = arrayMove(fields, dragIndex, dropIndex)
				onFieldsChange(newFields)

				console.log('🔄 Fields reordered:', {
					from: dragIndex,
					to: dropIndex,
					fieldId: dragData.field.id,
				})
			}
		},
		[fields, onFieldsChange]
	)

	const handleDragCancel = useCallback(() => {
		setActiveId(null)
		setActiveData(null)
		console.log('❌ Drag cancelled')
	}, [])

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
			onDragCancel={handleDragCancel}
		>
			<SortableContext
				items={fields.map(f => f.id)}
				strategy={verticalListSortingStrategy}
			>
				{children}
			</SortableContext>

			{/* Drag Overlay */}
			{createPortal(
				<DragOverlay>
					{activeId && activeData ? (
						<DragOverlayContent activeData={activeData} />
					) : null}
				</DragOverlay>,
				document.body
			)}
		</DndContext>
	)
}

interface DragOverlayContentProps {
	activeData: DragData
}

function DragOverlayContent({ activeData }: DragOverlayContentProps) {
	if (activeData.type === 'field') {
		// New field being dragged
		return (
			<div className='p-3 border border-purple-400 rounded-lg bg-purple-900/50 backdrop-blur-sm'>
				<div className='flex items-center gap-3'>
					<i className='pi pi-plus text-purple-400' />
					<div className='text-white font-medium'>
						Add {activeData.fieldType} Field
					</div>
				</div>
			</div>
		)
	} else if (activeData.type === 'existing-field' && activeData.field) {
		// Existing field being moved
		return (
			<div className='p-3 border border-blue-400 rounded-lg bg-blue-900/50 backdrop-blur-sm'>
				<div className='flex items-center gap-3'>
					<i className='pi pi-arrows-alt text-blue-400' />
					<div className='text-white font-medium'>{activeData.field.label}</div>
				</div>
			</div>
		)
	}

	return null
}
