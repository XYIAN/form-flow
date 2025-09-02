import React, { useState } from 'react'
import { useDrag } from '../context/DragContext'

interface DropZoneProps {
	accepts: ('component' | 'layout' | 'template')[]
	onDrop: (item: unknown) => void
	children: React.ReactNode
	className?: string
	activeClassName?: string
}

export default function DropZone({
	accepts,
	onDrop,
	children,
	className = '',
	activeClassName = 'ring-2 ring-primary bg-primary-50',
}: DropZoneProps) {
	const { draggedItem, isDragging } = useDrag()
	const [isOver, setIsOver] = useState(false)

	const isAccepted = draggedItem && accepts.includes(draggedItem.type)
	const isActive = isDragging && isAccepted && isOver

	const handleDragEnter = (e: React.DragEvent) => {
		e.preventDefault()
		if (isAccepted) {
			setIsOver(true)
		}
	}

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault()
		setIsOver(false)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		setIsOver(false)

		if (draggedItem && isAccepted) {
			onDrop(draggedItem.data)
		}
	}

	return (
		<div
			className={`transition-all ${className} ${
				isActive ? activeClassName : ''
			}`}
			onDragEnter={handleDragEnter}
			onDragOver={e => e.preventDefault()}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			{children}
		</div>
	)
}
