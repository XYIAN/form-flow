import { useState } from 'react'
import { Card } from 'primereact/card'
import { DropZone } from '../../../shared/components/DropZone'
import { FormComponent, FormLayout, FormTemplate } from '@/types'

interface FormDropZoneProps {
	onDropComponent: (component: FormComponent) => void
	onDropLayout: (layout: FormLayout) => void
	onDropTemplate: (template: FormTemplate) => void
	className?: string
}

export default function FormDropZone({
	onDropComponent,
	onDropLayout,
	onDropTemplate,
	className = '',
}: FormDropZoneProps) {
	const [isActive] = useState(false) // Available for future use

	const handleDrop = (item: unknown) => {
		switch (item.type) {
			case 'component':
				onDropComponent(item as FormComponent)
				break
			case 'layout':
				onDropLayout(item as FormLayout)
				break
			case 'template':
				onDropTemplate(item as FormTemplate)
				break
		}
	}

	return (
		<DropZone
			accepts={['component', 'layout', 'template']}
			onDrop={handleDrop}
			className={`transition-all duration-200 ${className}`}
			activeClassName='ring-2 ring-primary bg-primary-50 scale-102'
		>
			<Card
				className={`h-full min-h-[200px] flex items-center justify-center ${
					isActive ? 'bg-primary-50' : 'bg-gray-50'
				} transition-colors duration-200`}
			>
				<div className='text-center space-y-2'>
					<i className='pi pi-plus-circle text-3xl text-gray-400' />
					<p className='text-gray-500'>
						Drag and drop components, layouts, or templates here
					</p>
				</div>
			</Card>
		</DropZone>
	)
}
