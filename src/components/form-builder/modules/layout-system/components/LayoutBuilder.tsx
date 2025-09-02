import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Dropdown } from 'primereact/dropdown'
import { Badge } from 'primereact/badge'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { LayoutSystemMCP } from '@/lib/mcp'
import { FormLayout, LayoutType } from '@/types'
import { CustomizableBackground } from '../../../shared/components/CustomizableBackground'
import { LayoutPreview } from './LayoutPreview'
import { Draggable } from '../../../shared/components/Draggable'
import { DragPreview } from '../../../shared/components/DragPreview'
import '../../../shared/styles/transitions.css'

interface LayoutBuilderProps {
	selectedLayout: FormLayout | undefined
	onLayoutSelect: (layout: FormLayout) => void
}

export default function LayoutBuilder({
	selectedLayout,
	onLayoutSelect,
}: LayoutBuilderProps) {
	const [layouts, setLayouts] = useState<FormLayout[]>([])
	const [selectedType, setSelectedType] = useState<LayoutType>('responsive')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [customStyles, setCustomStyles] = useState<
		Record<string, { background: string; opacity: number }>
	>({})

	useEffect(() => {
		const initializeLayouts = async () => {
			setLoading(true)
			setError(null)

			const initResult = await LayoutSystemMCP.initialize()
			if (!initResult.success) {
				setError(
					initResult.errors?.[0]?.message ||
						'Failed to initialize layout system'
				)
				setLoading(false)
				return
			}

			const layoutsResult = await LayoutSystemMCP.getLayoutsByType(selectedType)
			if (!layoutsResult.success || !layoutsResult.data) {
				setError(layoutsResult.errors?.[0]?.message || 'Failed to load layouts')
				setLoading(false)
				return
			}

			setLayouts(layoutsResult.data)
			setLoading(false)
		}

		initializeLayouts()
	}, [selectedType])

	const handleCustomizeBackground = (
		layoutId: string,
		style: { background: string; opacity: number }
	) => {
		setCustomStyles(prev => ({
			...prev,
			[layoutId]: style,
		}))
	}

	if (error) {
		return <div className='p-4 text-red-500'>{error}</div>
	}

	return (
		<>
			<DragPreview />
			<div className='space-y-4'>
				<div className='flex justify-end'>
					<Dropdown
						value={selectedType}
						options={[
							{ label: 'Responsive', value: 'responsive' },
							{ label: 'Fixed', value: 'fixed' },
							{ label: 'Grid', value: 'grid' },
							{ label: 'Flex', value: 'flex' },
						]}
						onChange={e => setSelectedType(e.value)}
						placeholder='Select Layout Type'
					/>
				</div>

				<TransitionGroup className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				{loading ? (
					<div className='col-span-full text-center'>Loading layouts...</div>
				) : layouts.length === 0 ? (
					<div className='col-span-full text-center'>No layouts found</div>
				) : (
					layouts.map(layout => (
						<CSSTransition key={layout.id} timeout={300} classNames='fade'>
							<Draggable
								type="layout"
								data={layout}
								className="w-full"
							>
								<CustomizableBackground
									className={`layout-preview ${
										selectedLayout?.id === layout.id
											? 'ring-2 ring-primary'
											: 'hover:shadow-lg'
									}`}
									defaultBackground={
										customStyles[layout.id]?.background || '#ffffff'
									}
									defaultOpacity={customStyles[layout.id]?.opacity || 1}
									onCustomize={style =>
										handleCustomizeBackground(layout.id, style)
									}
								>
									<Card
										className='cursor-pointer transition-all'
										onClick={() => onLayoutSelect(layout)}
									>
									<div className='space-y-3'>
										<div className='flex items-start justify-between'>
											<div className='flex items-center justify-between'>
												<div>
													<h3 className='text-lg font-semibold'>
														{layout.name}
													</h3>
													<p className='text-sm text-gray-600'>
														{layout.description}
													</p>
												</div>
												<div className='flex items-center gap-2'>
													<Badge value={layout.type} />
													<LayoutPreview
														layout={layout}
														onUse={onLayoutSelect}
													/>
												</div>
											</div>
										</div>

										<div className='grid grid-cols-12 gap-2 p-2 bg-gray-50 rounded'>
											{layout.sections.map((section, index) => (
												<div
													key={section.id}
													className={`col-span-${
														12 / section.columns.length
													} p-2 bg-white rounded shadow-sm`}
												>
													<div className='text-xs text-center text-gray-500'>
														Section {index + 1}
													</div>
												</div>
											))}
										</div>

										<div className='flex flex-wrap gap-2'>
											<Badge value={`${layout.sections.length} sections`} />
											<Badge
												value={`${layout.sections.reduce(
													(acc, s) => acc + s.columns.length,
													0
												)} columns`}
											/>
											{layout.metadata?.source && (
												<Badge value={layout.metadata.source} />
											)}
										</div>
									</div>
								</Card>
							</CustomizableBackground>
						</CSSTransition>
					))
				)}
			</TransitionGroup>
		</div>
	)
}
