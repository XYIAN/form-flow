import { useState, useCallback } from 'react'
import { DragProvider } from '../../../shared/context/DragContext'
import { FormDropZone } from './FormDropZone'
import { FormSection } from './FormSection'
import { FormPreview } from './FormPreview'
import {
	FormComponent,
	FormLayout,
	FormTemplate,
	FormSection as FormSectionType,
} from '@/types'
import { DragPreview } from '../../../shared/components/DragPreview'
import { useFormHistory } from '../../../shared/hooks/useFormHistory'
import { useKeyboardShortcuts } from '../../../shared/hooks/useKeyboardShortcuts'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'

interface FormBuilderProps {
	sections: FormSectionType[]
	onAddComponent: (component: FormComponent, sectionId: string) => void
	onApplyLayout: (layout: FormLayout) => void
	onApplyTemplate: (template: FormTemplate) => void
	onRemoveSection: (sectionId: string) => void
	onMoveSection: (sectionId: string, direction: 'up' | 'down') => void
}

export default function FormBuilder({
	sections,
	onAddComponent,
	onApplyLayout,
	onApplyTemplate,
	onRemoveSection,
	onMoveSection,
}: FormBuilderProps) {
	const [isDraggingOver, setIsDraggingOver] = useState(false)
	const [showPreview, setShowPreview] = useState(false)

	const {
		sections: historySections,
		pushState,
		undo,
		redo,
		canUndo,
		canRedo,
	} = useFormHistory(sections)

	const handleChange = useCallback(
		(newSections: FormSectionType[]) => {
			pushState(newSections)
		},
		[pushState]
	)

	useKeyboardShortcuts([
		{ key: 'z', ctrl: true, handler: undo },
		{ key: 'y', ctrl: true, handler: redo },
		{ key: 'p', ctrl: true, handler: () => setShowPreview(true) },
	])

	const toolbarStart = (
		<div className='flex items-center gap-2'>
			<Button
				icon='pi pi-undo'
				className='p-button-text'
				disabled={!canUndo}
				onClick={undo}
				tooltip='Undo (Ctrl+Z)'
			/>
			<Button
				icon='pi pi-redo'
				className='p-button-text'
				disabled={!canRedo}
				onClick={redo}
				tooltip='Redo (Ctrl+Y)'
			/>
		</div>
	)

	const toolbarEnd = (
		<div className='flex items-center gap-2'>
			<Button
				label='Preview'
				icon='pi pi-eye'
				onClick={() => setShowPreview(true)}
				tooltip='Preview Form (Ctrl+P)'
			/>
		</div>
	)

	return (
		<DragProvider>
			<div className='space-y-6'>
				<Toolbar start={toolbarStart} end={toolbarEnd} />
				<DragPreview />
				<FormPreview
					sections={historySections}
					visible={showPreview}
					onHide={() => setShowPreview(false)}
				/>

				{sections.length > 0 ? (
					<div className='space-y-4'>
						{sections.map((section, index) => (
							<FormSection
								key={section.id}
								section={section}
								onDropComponent={onAddComponent}
								onRemoveSection={onRemoveSection}
								onMoveSection={onMoveSection}
								isFirst={index === 0}
								isLast={index === sections.length - 1}
							/>
						))}
						<FormDropZone
							onDropComponent={component => onAddComponent(component, 'new')}
							onDropLayout={onApplyLayout}
							onDropTemplate={onApplyTemplate}
							className={isDraggingOver ? 'scale-102' : ''}
						/>
					</div>
				) : (
					<FormDropZone
						onDropComponent={component => onAddComponent(component, 'new')}
						onDropLayout={onApplyLayout}
						onDropTemplate={onApplyTemplate}
						className='min-h-[400px]'
					/>
				)}
			</div>
		</DragProvider>
	)
}
