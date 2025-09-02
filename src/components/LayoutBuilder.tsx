'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { Badge } from 'primereact/badge'
import { ScrollPanel } from 'primereact/scrollpanel'
import { LayoutSystemMCP } from '@/lib/mcp'
import { FormLayout, LayoutType } from '@/types'

interface LayoutBuilderProps {
	className?: string
	selectedLayout?: FormLayout
	onLayoutSelect?: (layout: FormLayout) => void
}

export default function LayoutBuilder({
	className = '',
	selectedLayout,
	onLayoutSelect,
}: LayoutBuilderProps) {
	const [layouts, setLayouts] = useState<FormLayout[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string>('')
	const [selectedLayoutType, setSelectedLayoutType] =
		useState<LayoutType | null>(null)

	// Initialize layout system
	useEffect(() => {
		const initializeLayouts = async () => {
			try {
				setIsLoading(true)
				setError('')

				// Initialize the layout system
				const initResult = LayoutSystemMCP.initialize()
				if (!initResult.success) {
					throw new Error(
						initResult.errors?.[0]?.message ||
							'Failed to initialize layout system'
					)
				}

				// Get all layouts
				const layoutsResult = LayoutSystemMCP.getLayouts()
				if (!layoutsResult.success) {
					throw new Error(
						layoutsResult.errors?.[0]?.message || 'Failed to get layouts'
					)
				}

				if (layoutsResult.data) {
					setLayouts(layoutsResult.data)
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load layouts')
			} finally {
				setIsLoading(false)
			}
		}

		initializeLayouts()
	}, [])

	// Filter layouts by type
	const filteredLayouts = selectedLayoutType
		? layouts.filter(layout => layout.type === selectedLayoutType)
		: layouts

	const handleLayoutSelect = useCallback(
		(layout: FormLayout) => {
			onLayoutSelect?.(layout)
		},
		[onLayoutSelect]
	)

	const handleLayoutTypeChange = useCallback((type: LayoutType | null) => {
		setSelectedLayoutType(type)
	}, [])

	const getLayoutTypeIcon = (type: LayoutType): string => {
		switch (type) {
			case 'single-column':
				return 'pi pi-align-left'
			case 'two-column':
				return 'pi pi-th-large'
			case 'three-column':
				return 'pi pi-th'
			case 'grid':
				return 'pi pi-table'
			case 'custom':
				return 'pi pi-cog'
			default:
				return 'pi pi-circle'
		}
	}

	const getLayoutTypeLabel = (type: LayoutType): string => {
		switch (type) {
			case 'single-column':
				return 'Single Column'
			case 'two-column':
				return 'Two Column'
			case 'three-column':
				return 'Three Column'
			case 'grid':
				return 'Grid Layout'
			case 'custom':
				return 'Custom'
			default:
				return type
		}
	}

	const layoutTypeOptions = [
		{ label: 'All Types', value: null },
		...Object.values([
			'single-column',
			'two-column',
			'three-column',
			'grid',
			'custom',
		] as LayoutType[]).map(type => ({
			label: getLayoutTypeLabel(type),
			value: type,
			icon: getLayoutTypeIcon(type),
		})),
	]

	const renderLayoutPreview = (layout: FormLayout) => {
		return (
			<div className='layout-preview p-2 border border-gray-600 rounded'>
				<div className='text-xs text-gray-400 mb-2'>{layout.name}</div>
				<div className='space-y-1'>
					{layout.sections.map(section => (
						<div key={section.id} className='section-preview'>
							<div className='text-xs text-gray-500 mb-1'>{section.name}</div>
							<div className='flex gap-1'>
								{section.columns.map(column => (
									<div
										key={column.id}
										className='column-preview bg-blue-100 border border-blue-300 rounded'
										style={{
											width: `${(column.width / 12) * 100}%`,
											height: '20px',
										}}
									>
										<div className='text-xs text-blue-600 text-center leading-5'>
											{column.width}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		)
	}

	if (isLoading) {
		return (
			<Card className={`form-flow-card ${className}`}>
				<div className='flex align-items-center justify-content-center p-4'>
					<i className='pi pi-spinner pi-spin text-2xl text-blue-400 mr-2' />
					<span className='text-white'>Loading layouts...</span>
				</div>
			</Card>
		)
	}

	if (error) {
		return (
			<Card className={`form-flow-card ${className}`}>
				<div className='text-center p-4'>
					<i className='pi pi-exclamation-triangle text-3xl text-red-400 mb-3' />
					<h3 className='text-white mb-2'>Error Loading Layouts</h3>
					<p className='text-gray-300 mb-3'>{error}</p>
					<Button
						label='Retry'
						icon='pi pi-refresh'
						className='p-button-outlined'
						onClick={() => window.location.reload()}
					/>
				</div>
			</Card>
		)
	}

	return (
		<Card className={`form-flow-card ${className}`}>
			<div className='flex justify-between items-center mb-4'>
				<h3 className='text-xl font-semibold text-white'>Layout Builder</h3>
				<Badge value={filteredLayouts.length} severity='info' />
			</div>

			{/* Layout Type Filter */}
			<div className='field mb-4'>
				<label className='block text-sm font-medium text-gray-300 mb-2'>
					Layout Type
				</label>
				<Dropdown
					value={selectedLayoutType}
					options={layoutTypeOptions}
					onChange={e => handleLayoutTypeChange(e.value)}
					optionLabel='label'
					optionValue='value'
					className='w-full'
					placeholder='Select layout type'
				/>
			</div>

			{/* Layouts Grid */}
			<ScrollPanel style={{ height: '400px' }} className='custom-scrollbar'>
				<div className='space-y-3'>
					{filteredLayouts.map(layout => (
						<Card
							key={layout.id}
							className={`layout-card cursor-pointer hover:shadow-lg transition-all duration-200 ${
								selectedLayout?.id === layout.id
									? 'border-blue-400 bg-blue-50'
									: ''
							}`}
							onClick={() => handleLayoutSelect(layout)}
						>
							<div className='p-3'>
								<div className='flex justify-between items-start mb-3'>
									<div>
										<h4 className='text-white font-medium mb-1'>
											{layout.name}
										</h4>
										<p className='text-gray-300 text-sm mb-2'>
											{layout.description}
										</p>
									</div>
									<div className='flex items-center gap-2'>
										<i
											className={`${getLayoutTypeIcon(
												layout.type
											)} text-blue-400`}
										/>
										<Badge
											value={getLayoutTypeLabel(layout.type)}
											severity='secondary'
											size='small'
										/>
									</div>
								</div>

								{/* Layout Preview */}
								<div className='mb-3'>{renderLayoutPreview(layout)}</div>

								{/* Layout Info */}
								<div className='flex justify-between items-center text-xs text-gray-400'>
									<span>
										{layout.sections.length} section
										{layout.sections.length !== 1 ? 's' : ''}
									</span>
									<span>v{layout.metadata.version}</span>
								</div>

								{/* Layout Tags */}
								<div className='flex gap-1 mt-2'>
									{layout.metadata.tags.slice(0, 3).map((tag, index) => (
										<Badge
											key={index}
											value={tag}
											severity='secondary'
											size='small'
										/>
									))}
								</div>
							</div>
						</Card>
					))}
				</div>

				{filteredLayouts.length === 0 && (
					<div className='text-center p-6'>
						<i className='pi pi-th-large text-4xl text-gray-400 mb-3' />
						<h4 className='text-white mb-2'>No Layouts Found</h4>
						<p className='text-gray-300'>
							{selectedLayoutType
								? 'No layouts available for this type'
								: 'No layouts available'}
						</p>
					</div>
				)}
			</ScrollPanel>

			{/* Layout Info Footer */}
			<div className='border-t border-gray-700 pt-3 mt-4'>
				<div className='flex justify-between items-center text-sm text-gray-400'>
					<span>
						{filteredLayouts.length} layout
						{filteredLayouts.length !== 1 ? 's' : ''} available
					</span>
					<span>
						{selectedLayoutType
							? getLayoutTypeLabel(selectedLayoutType)
							: 'All Types'}
					</span>
				</div>
			</div>
		</Card>
	)
}
