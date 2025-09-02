import React, { useRef, useEffect } from 'react'
import { useDrag } from '../context/DragContext'

interface DraggableProps {
	type: 'component' | 'layout' | 'template'
	data: unknown
	children: React.ReactNode
	className?: string
	previewComponent?: React.ReactNode
	onDragStart?: () => void
	onDragEnd?: () => void
}

export default function Draggable({
	type,
	data,
	children,
	className = '',
	// previewComponent, // Available for future use
	onDragStart,
	onDragEnd,
}: DraggableProps) {
	const dragRef = useRef<HTMLDivElement>(null)
	const { startDrag, endDrag, updatePreview } = useDrag()

	useEffect(() => {
		const element = dragRef.current
		if (!element) return

		let isDragging = false
		let startX = 0
		let startY = 0
		let offsetX = 0
		let offsetY = 0

		const handleMouseDown = (e: MouseEvent) => {
			isDragging = true
			startX = e.clientX - offsetX
			startY = e.clientY - offsetY

			startDrag({ type, data })
			onDragStart?.()

			// Add global event listeners
			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUp)
		}

		const handleMouseMove = (e: MouseEvent) => {
			if (!isDragging) return

			offsetX = e.clientX - startX
			offsetY = e.clientY - startY

			updatePreview(e.clientX, e.clientY)
		}

		const handleMouseUp = () => {
			if (!isDragging) return

			isDragging = false
			endDrag()
			onDragEnd?.()

			// Remove global event listeners
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}

		element.addEventListener('mousedown', handleMouseDown)

		return () => {
			element.removeEventListener('mousedown', handleMouseDown)
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [type, data, startDrag, endDrag, updatePreview, onDragStart, onDragEnd])

	return (
		<div
			ref={dragRef}
			className={`cursor-grab active:cursor-grabbing ${className}`}
			draggable={false} // We'll handle drag behavior manually
		>
			{children}
		</div>
	)
}
