import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { TabView, TabPanel } from 'primereact/tabview'
import { FormComponent } from '@/types'
import { FieldMCP } from '@/lib/mcp'
import { CustomizableBackground } from '../../../shared/components/CustomizableBackground'

interface ComponentPreviewProps {
	component: FormComponent
	onUse: (component: FormComponent) => void
}

export default function ComponentPreview({
	component,
	onUse,
}: ComponentPreviewProps) {
	const [showPreview, setShowPreview] = useState(false)
	const [previewValue, setPreviewValue] = useState<unknown>(null)

	useEffect(() => {
		// Generate sample value based on component type
		const sampleValue = FieldMCP.generateSampleValue(component.type)
		setPreviewValue(sampleValue)
	}, [component.type])

	return (
		<>
			<Button
				icon='pi pi-eye'
				className='p-button-rounded p-button-text'
				onClick={() => setShowPreview(true)}
				tooltip='Preview Component'
			/>

			<Dialog
				header={`Preview: ${component.name}`}
				visible={showPreview}
				onHide={() => setShowPreview(false)}
				className='w-full max-w-4xl'
				modal
			>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4'>
					{/* Preview Panel */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold'>Live Preview</h3>
						<CustomizableBackground className='p-4 rounded-lg'>
							<div className='space-y-4'>
								{/* Component Preview */}
								<div className='preview-container'>
									{FieldMCP.render({
										id: 'preview',
										label: component.name,
										type: component.type,
										required: component.props.required,
										placeholder: component.props.placeholder,
										options: component.props.options,
										value: previewValue,
										onChange: setPreviewValue,
										validation: component.validation,
									})}
								</div>

								{/* Preview Controls */}
								<div className='flex gap-2'>
									<Button
										label='Reset'
										icon='pi pi-refresh'
										className='p-button-text'
										onClick={() => setPreviewValue(null)}
									/>
									<Button
										label='Use Component'
										icon='pi pi-check'
										onClick={() => {
											onUse(component)
											setShowPreview(false)
										}}
									/>
								</div>
							</div>
						</CustomizableBackground>
					</div>

					{/* Details Panel */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold'>Component Details</h3>
						<TabView>
							<TabPanel header='Properties'>
								<div className='space-y-3'>
									<div>
										<label className='block text-sm font-medium mb-1'>
											Type
										</label>
										<Badge value={component.type} />
									</div>
									<div>
										<label className='block text-sm font-medium mb-1'>
											Category
										</label>
										<Badge value={component.category} />
									</div>
									<div>
										<label className='block text-sm font-medium mb-1'>
											Required
										</label>
										<Badge
											value={component.props.required ? 'Yes' : 'No'}
											severity={component.props.required ? 'danger' : 'info'}
										/>
									</div>
									{component.props.placeholder && (
										<div>
											<label className='block text-sm font-medium mb-1'>
												Placeholder
											</label>
											<div className='text-sm bg-gray-50 p-2 rounded'>
												{component.props.placeholder}
											</div>
										</div>
									)}
									{component.props.options && (
										<div>
											<label className='block text-sm font-medium mb-1'>
												Options
											</label>
											<div className='flex flex-wrap gap-1'>
												{component.props.options.map((opt, idx) => (
													<Badge key={idx} value={opt} />
												))}
											</div>
										</div>
									)}
								</div>
							</TabPanel>

							<TabPanel header='Validation'>
								<div className='space-y-3'>
									{component.validation.rules.map((rule, idx) => (
										<Card key={idx} className='shadow-none'>
											<div className='space-y-2'>
												<div className='flex items-center justify-between'>
													<span className='font-medium'>{rule.type}</span>
													{rule.value && (
														<Badge value={rule.value.toString()} />
													)}
												</div>
												<p className='text-sm text-gray-600'>{rule.message}</p>
											</div>
										</Card>
									))}
								</div>
							</TabPanel>

							<TabPanel header='Documentation'>
								<div className='space-y-4'>
									<div>
										<h4 className='font-medium mb-2'>Description</h4>
										<p className='text-sm text-gray-600'>
											{component.metadata.documentation}
										</p>
									</div>
									{component.metadata.examples?.map((example, idx) => (
										<Card key={idx} className='shadow-none'>
											<div className='space-y-2'>
												<h5 className='font-medium'>{example.title}</h5>
												<p className='text-sm text-gray-600'>
													{example.description}
												</p>
												<pre className='bg-gray-50 p-2 rounded text-sm'>
													{example.code}
												</pre>
											</div>
										</Card>
									))}
								</div>
							</TabPanel>

							<TabPanel header='Metadata'>
								<div className='space-y-3'>
									<div>
										<label className='block text-sm font-medium mb-1'>
											Author
										</label>
										<div className='text-sm'>{component.metadata.author}</div>
									</div>
									<div>
										<label className='block text-sm font-medium mb-1'>
											Version
										</label>
										<Badge value={component.metadata.version} />
									</div>
									<div>
										<label className='block text-sm font-medium mb-1'>
											Tags
										</label>
										<div className='flex flex-wrap gap-1'>
											{component.metadata.tags.map((tag, idx) => (
												<Badge key={idx} value={tag} />
											))}
										</div>
									</div>
									{component.metadata.source && (
										<div>
											<label className='block text-sm font-medium mb-1'>
												Source
											</label>
											<div className='text-sm'>
												<Badge value={component.metadata.source.type} />
												{component.metadata.source.columnName && (
													<span className='ml-2 text-gray-600'>
														Column: {component.metadata.source.columnName}
													</span>
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
