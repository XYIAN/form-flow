import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { FormSection, FormField } from '@/types'
import { FieldMCP } from '@/lib/mcp'

interface FormPreviewProps {
	sections: FormSection[]
	visible: boolean
	onHide: () => void
}

export default function FormPreview({
	sections,
	visible,
	onHide,
}: FormPreviewProps) {
	const [formData, setFormData] = useState<Record<string, any>>({})
	const [isSubmitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		if (visible) {
			setFormData({})
		}
	}, [visible])

	const handleFieldChange = (fieldId: string, value: any) => {
		setFormData(prev => ({
			...prev,
			[fieldId]: value,
		}))
	}

	const handleSubmit = async () => {
		setIsSubmitting(true)
		try {
			// Simulate form submission
			await new Promise(resolve => setTimeout(resolve, 1000))
			console.log('Form Data:', formData)
		} finally {
			setIsSubmitting(false)
		}
	}

	const renderField = (field: FormField) => {
		return FieldMCP.render({
			...field,
			value: formData[field.id],
			onChange: value => handleFieldChange(field.id, value),
		})
	}

	return (
		<Dialog
			header='Form Preview'
			visible={visible}
			onHide={onHide}
			modal
			className='w-full max-w-4xl'
			contentClassName='p-0'
		>
			<div className='p-4 space-y-6'>
				{sections.map(section => (
					<Card key={section.id} className='shadow-sm'>
						<div className='space-y-4'>
							{section.title && (
								<h3 className='text-lg font-medium'>{section.title}</h3>
							)}
							<div
								className='grid gap-4'
								style={{
									gridTemplateColumns: section.columns
										.map(col => col.width || '1fr')
										.join(' '),
								}}
							>
								{section.columns.map(
									column =>
										column.field && (
											<div key={column.id} className='space-y-2'>
												{renderField(column.field as FormField)}
											</div>
										)
								)}
							</div>
						</div>
					</Card>
				))}

				<div className='flex justify-end gap-2 pt-4'>
					<Button label='Cancel' className='p-button-text' onClick={onHide} />
					<Button
						label='Submit'
						icon='pi pi-check'
						loading={isSubmitting}
						onClick={handleSubmit}
					/>
				</div>
			</div>
		</Dialog>
	)
}
