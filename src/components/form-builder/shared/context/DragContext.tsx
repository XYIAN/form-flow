import React, { createContext, useContext, useState, useCallback } from 'react'
import { FormComponent, FormLayout, FormTemplate } from '@/types'

type DragItem = {
	type: 'component' | 'layout' | 'template'
	data: FormComponent | FormLayout | FormTemplate
}

interface DragContextType {
	draggedItem: DragItem | null
	isDragging: boolean
	previewPosition: { x: number; y: number } | null
	startDrag: (item: DragItem) => void
	endDrag: () => void
	updatePreview: (x: number, y: number) => void
}

const DragContext = createContext<DragContextType | undefined>(undefined)

export function DragProvider({ children }: { children: React.ReactNode }) {
	const [draggedItem, setDraggedItem] = useState<DragItem | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [previewPosition, setPreviewPosition] = useState<{
		x: number
		y: number
	} | null>(null)

	const startDrag = useCallback((item: DragItem) => {
		setDraggedItem(item)
		setIsDragging(true)
	}, [])

	const endDrag = useCallback(() => {
		setDraggedItem(null)
		setIsDragging(false)
		setPreviewPosition(null)
	}, [])

	const updatePreview = useCallback((x: number, y: number) => {
		setPreviewPosition({ x, y })
	}, [])

	return (
		<DragContext.Provider
			value={{
				draggedItem,
				isDragging,
				previewPosition,
				startDrag,
				endDrag,
				updatePreview,
			}}
		>
			{children}
		</DragContext.Provider>
	)
}

export function useDrag() {
	const context = useContext(DragContext)
	if (context === undefined) {
		throw new Error('useDrag must be used within a DragProvider')
	}
	return context
}
