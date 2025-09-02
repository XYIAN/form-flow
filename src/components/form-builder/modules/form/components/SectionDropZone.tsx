import { useState } from 'react'
import { Card } from 'primereact/card'
import { DropZone } from '../../../shared/components/DropZone'
import { FormComponent } from '@/types'

interface SectionDropZoneProps {
	sectionId: string
	onDropComponent: (component: FormComponent, sectionId: string) => void
	className?: string
}

export default function SectionDropZone({
	sectionId,
	onDropComponent,
	className = '',
}: SectionDropZoneProps) {
	const [isActive] = useState(false) // Available for future use

	const handleDrop = (component: FormComponent) => {
		onDropComponent(component, sectionId)
	}

	return (
		<DropZone
			accepts={['component']}
			onDrop={handleDrop}
			className={`transition-all duration-200 ${className}`}
			activeClassName='ring-2 ring-primary bg-primary-50 scale-102'
		>
			<Card
				className={`h-full min-h-[100px] flex items-center justify-center ${
					isActive ? 'bg-primary-50' : 'bg-gray-50'
				} transition-colors duration-200`}
			>
				<div className='text-center space-y-2'>
					<i className='pi pi-plus text-2xl text-gray-400' />
					<p className='text-sm text-gray-500'>Drop component here</p>
				</div>
			</Card>
		</DropZone>
	)
}
