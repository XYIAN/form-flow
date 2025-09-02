import React from 'react'
import { useDrag } from '../context/DragContext'
import { Card } from 'primereact/card'
import { Badge } from 'primereact/badge'

export default function DragPreview() {
	const { draggedItem, previewPosition, isDragging } = useDrag()

	if (!isDragging || !draggedItem || !previewPosition) return null

	const previewStyle: React.CSSProperties = {
		position: 'fixed',
		left: previewPosition.x,
		top: previewPosition.y,
		transform: 'translate(-50%, -50%)',
		pointerEvents: 'none',
		zIndex: 9999,
		opacity: 0.8,
		width: '200px',
	}

	const renderPreview = () => {
		switch (draggedItem.type) {
			case 'component':
				const component = draggedItem.data
				return (
					<Card className='shadow-lg'>
						<div className='flex items-center gap-2'>
							<i className={`${component.icon} text-xl`} />
							<div>
								<div className='font-medium'>{component.name}</div>
								<Badge value={component.type} />
							</div>
						</div>
					</Card>
				)

			case 'layout':
				const layout = draggedItem.data
				return (
					<Card className='shadow-lg'>
						<div className='space-y-2'>
							<div className='font-medium'>{layout.name}</div>
							<div className='grid grid-cols-12 gap-1'>
								{layout.sections[0]?.columns.map((col, idx) => (
									<div
										key={idx}
										className='h-2 bg-primary rounded'
										style={{
											gridColumn: `span ${Math.floor(
												12 / layout.sections[0].columns.length
											)}`,
										}}
									/>
								))}
							</div>
						</div>
					</Card>
				)

			case 'template':
				const template = draggedItem.data
				return (
					<Card className='shadow-lg'>
						<div className='space-y-2'>
							<div className='font-medium'>{template.name}</div>
							<div className='flex gap-2'>
								<Badge value={template.category} />
								<Badge value={`${template.fields.length} fields`} />
							</div>
						</div>
					</Card>
				)

			default:
				return null
		}
	}

	return <div style={previewStyle}>{renderPreview()}</div>
}
