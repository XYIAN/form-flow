import { useState } from 'react'
import { Card } from 'primereact/card'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { TabView, TabPanel } from 'primereact/tabview'
import { Dropdown } from 'primereact/dropdown'
import { FormLayout, FormSection, FormColumn } from '@/types'
import { CustomizableBackground } from '../../../shared/components/CustomizableBackground'

interface LayoutPreviewProps {
	layout: FormLayout
	onUse: (layout: FormLayout) => void
}

export default function LayoutPreview({ layout, onUse }: LayoutPreviewProps) {
	const [showPreview, setShowPreview] = useState(false)
	const [selectedBreakpoint, setSelectedBreakpoint] = useState<string>('lg')

	const breakpointClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
	}

	const renderSection = (section: FormSection) => (
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
				className={`grid gap-4`}
				style={{
					gridTemplateColumns: section.columns
						.map(col => col.width || '1fr')
						.join(' '),
				}}
			>
				{section.columns.map((column: FormColumn) => (
					<div
						key={column.id}
						className='border border-dotted border-gray-200 rounded p-3 bg-gray-50'
					>
						<div className='text-sm text-gray-500 text-center'>
							{column.field || 'Empty Column'}
						</div>
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
				tooltip='Preview Layout'
			/>

			<Dialog
				header={`Preview: ${layout.name}`}
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
							<Dropdown
								value={selectedBreakpoint}
								options={[
									{ label: 'Small (sm)', value: 'sm' },
									{ label: 'Medium (md)', value: 'md' },
									{ label: 'Large (lg)', value: 'lg' },
									{ label: 'Extra Large (xl)', value: 'xl' },
								]}
								onChange={e => setSelectedBreakpoint(e.value)}
								className='w-40'
							/>
						</div>

						<div
							className={`mx-auto ${
								breakpointClasses[
									selectedBreakpoint as keyof typeof breakpointClasses
								]
							}`}
						>
							<CustomizableBackground className='p-4 rounded-lg'>
								<div className='space-y-6'>
									{layout.sections.map(section => renderSection(section))}
								</div>
							</CustomizableBackground>
						</div>

						<div className='flex justify-end'>
							<Button
								label='Use Layout'
								icon='pi pi-check'
								onClick={() => {
									onUse(layout)
									setShowPreview(false)
								}}
							/>
						</div>
					</div>

					{/* Details Panel */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold'>Layout Details</h3>
						<TabView>
							<TabPanel header='Structure'>
								<div className='space-y-3'>
									<div>
										<label className='block text-sm font-medium mb-1'>
											Type
										</label>
										<Badge value={layout.type} />
									</div>
									<div>
										<label className='block text-sm font-medium mb-1'>
											Sections
										</label>
										<div className='space-y-2'>
											{layout.sections.map((section, idx) => (
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

							<TabPanel header='Styles'>
								<div className='space-y-3'>
									<div>
										<label className='block text-sm font-medium mb-1'>
											Breakpoints
										</label>
										<div className='flex flex-wrap gap-2'>
											{Object.entries(layout.breakpoints).map(
												([size, value]) => (
													<div key={size} className='flex items-center gap-1'>
														<Badge value={size} />
														<span className='text-sm text-gray-600'>
															{value}
														</span>
													</div>
												)
											)}
										</div>
									</div>
									<div>
										<label className='block text-sm font-medium mb-1'>
											Layout Styles
										</label>
										<pre className='bg-gray-50 p-2 rounded text-sm'>
											{JSON.stringify(layout.styles, null, 2)}
										</pre>
									</div>
								</div>
							</TabPanel>

							<TabPanel header='Metadata'>
								<div className='space-y-3'>
									{layout.metadata?.source && (
										<div>
											<label className='block text-sm font-medium mb-1'>
												Source
											</label>
											<Badge value={layout.metadata.source} />
										</div>
									)}
									{layout.metadata?.generated && (
										<div>
											<label className='block text-sm font-medium mb-1'>
												Generation
											</label>
											<Badge value='Auto-generated' severity='info' />
										</div>
									)}
									{layout.metadata?.compatibility && (
										<div>
											<label className='block text-sm font-medium mb-1'>
												Compatibility
											</label>
											<div className='flex flex-wrap gap-1'>
												{layout.metadata.compatibility.map((item, idx) => (
													<Badge key={idx} value={item} />
												))}
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
