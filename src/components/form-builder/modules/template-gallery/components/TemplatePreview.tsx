import { useState } from 'react'
import { Card } from 'primereact/card'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { TabView, TabPanel } from 'primereact/tabview'
import { FormTemplate, FormField } from '@/types'
import { FieldMCP } from '@/lib/mcp'
import { CustomizableBackground } from '../../../shared/components/CustomizableBackground'

interface TemplatePreviewProps {
	template: FormTemplate
	onUse: (template: FormTemplate) => void
}

export default function TemplatePreview({
	template,
	onUse,
}: TemplatePreviewProps) {
	const [showPreview, setShowPreview] = useState(false)
	const [sampleValues, setSampleValues] = useState<Record<string, unknown>>({})

	const renderField = (field: FormField) => {
		const value = sampleValues[field.id]
		return (
			<div key={field.id} className='mb-4'>
				{FieldMCP.render({
					...field,
					value,
					onChange: (newValue: unknown) =>
						setSampleValues(prev => ({ ...prev, [field.id]: newValue })),
				})}
			</div>
		)
	}

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case 'beginner':
				return 'success'
			case 'intermediate':
				return 'warning'
			case 'advanced':
				return 'danger'
			default:
				return 'info'
		}
	}

	const renderSectionPreview = (section: unknown) => (
		<div
			key={section.id}
			className='border border-dashed border-gray-300 rounded-lg p-4 space-y-4'
		>
			{section.title && (
				<div className='flex items-center justify-between'>
					<h4 className='text-lg font-medium'>{section.title}</h4>
					{section.collapsible && (
						<Button
							icon='pi pi-chevron-down'
							className='p-button-text p-button-rounded'
						/>
					)}
				</div>
			)}

			<div
				className='grid gap-4'
				style={{
					gridTemplateColumns: section.columns
						.map((col: unknown) => (col as { width?: string }).width || '1fr')
						.join(' '),
				}}
			>
				{section.columns.map((column: unknown) => (
					<div key={column.id}>
						{column.field && (
							<div className='border border-dotted border-gray-200 rounded p-3'>
								{renderField(
									template.fields.find(f => f.id === column.field) as FormField
								)}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	)

	return (
		<>
			<Button
				icon='pi pi-eye'
				className='p-button-rounded p-button-text'
				onClick={() => setShowPreview(true)}
				tooltip='Preview Template'
			/>

			<Dialog
				header={`Preview: ${template.name}`}
				visible={showPreview}
				onHide={() => setShowPreview(false)}
				className='w-full max-w-6xl'
				modal
			>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4'>
					{/* Preview Panel */}
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<h3 className='text-lg font-semibold'>Live Preview</h3>
							<Badge
								value={template.difficulty}
								severity={getDifficultyColor(template.difficulty)}
							/>
						</div>

						<CustomizableBackground className='p-4 rounded-lg'>
							<div className='space-y-6'>
								<div className='space-y-2'>
									<h2 className='text-2xl font-bold'>{template.name}</h2>
									<p className='text-gray-600'>{template.description}</p>
								</div>

								{template.layout.sections.map(section =>
									renderSectionPreview(section)
								)}

								<div className='flex justify-end gap-2'>
									<Button
										label='Reset'
										icon='pi pi-refresh'
										className='p-button-text'
										onClick={() => setSampleValues({})}
									/>
									<Button
										label='Use Template'
										icon='pi pi-check'
										onClick={() => {
											onUse(template)
											setShowPreview(false)
										}}
									/>
								</div>
							</div>
						</CustomizableBackground>
					</div>

					{/* Details Panel */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold'>Template Details</h3>
						<TabView>
							<TabPanel header='Fields'>
								<div className='space-y-3'>
									{template.fields.map((field, idx) => (
										<Card key={idx} className='shadow-none'>
											<div className='space-y-2'>
												<div className='flex items-center justify-between'>
													<span className='font-medium'>{field.label}</span>
													<Badge value={field.type} />
												</div>
												<div className='flex flex-wrap gap-2'>
													{field.required && (
														<Badge value='Required' severity='danger' />
													)}
													{field.placeholder && (
														<div className='text-sm text-gray-600'>
															Placeholder: {field.placeholder}
														</div>
													)}
													{field.options && (
														<div className='flex flex-wrap gap-1'>
															{field.options.map((opt, optIdx) => (
																<Badge key={optIdx} value={opt} />
															))}
														</div>
													)}
												</div>
											</div>
										</Card>
									))}
								</div>
							</TabPanel>

							<TabPanel header='Layout'>
								<div className='space-y-3'>
									<div>
										<label className='block text-sm font-medium mb-1'>
											Layout Type
										</label>
										<Badge value={template.layout.type} />
									</div>
									<div>
										<label className='block text-sm font-medium mb-1'>
											Sections
										</label>
										<div className='space-y-2'>
											{template.layout.sections.map((section, idx) => (
												<Card key={idx} className='shadow-none'>
													<div className='space-y-2'>
														<div className='flex items-center justify-between'>
															<span className='font-medium'>
																{section.title || `Section ${idx + 1}`}
															</span>
															<Badge
																value={`${section.columns.length} columns`}
															/>
														</div>
														<div className='flex gap-1'>
															{section.columns.map((col, colIdx) => (
																<div
																	key={colIdx}
																	className='flex-1 h-2 bg-gray-200 rounded'
																	style={{
																		flexGrow: parseInt(
																			col.width?.replace('%', '') || '1'
																		),
																	}}
																/>
															))}
														</div>
													</div>
												</Card>
											))}
										</div>
									</div>
								</div>
							</TabPanel>

							<TabPanel header='Metadata'>
								<div className='space-y-3'>
									<div>
										<label className='block text-sm font-medium mb-1'>
											Category
										</label>
										<Badge value={template.category} />
									</div>
									<div>
										<label className='block text-sm font-medium mb-1'>
											Difficulty
										</label>
										<Badge
											value={template.difficulty}
											severity={getDifficultyColor(template.difficulty)}
										/>
									</div>
									{template.metadata?.source && (
										<div>
											<label className='block text-sm font-medium mb-1'>
												Source
											</label>
											<Badge value={template.metadata.source} />
										</div>
									)}
									{template.metadata?.generated && (
										<div>
											<label className='block text-sm font-medium mb-1'>
												Generation
											</label>
											<Badge value='Auto-generated' severity='info' />
										</div>
									)}
									{template.metadata?.originalHeaders && (
										<div>
											<label className='block text-sm font-medium mb-1'>
												Original Headers
											</label>
											<div className='flex flex-wrap gap-1'>
												{template.metadata.originalHeaders.map(
													(header, idx) => (
														<Badge key={idx} value={header} />
													)
												)}
											</div>
										</div>
									)}
								</div>
							</TabPanel>
						</TabView>
					</div>
				</div>
			</Dialog>
		</>
	)
}
