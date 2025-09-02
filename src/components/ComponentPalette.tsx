'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Badge } from 'primereact/badge'
import { ScrollPanel } from 'primereact/scrollpanel'
import { ComponentLibraryMCP } from '@/lib/mcp'
import { FormComponent, ComponentCategory } from '@/types'

interface ComponentPaletteProps {
	className?: string
	onComponentSelect?: (component: FormComponent) => void
	onComponentDrag?: (component: FormComponent) => void
	selectedCategory?: ComponentCategory
	onCategoryChange?: (category: ComponentCategory) => void
	searchQuery?: string
	onSearchChange?: (query: string) => void
}

export default function ComponentPalette({
	className = '',
	onComponentSelect,
	onComponentDrag,
	selectedCategory,
	onCategoryChange,
	searchQuery = '',
	onSearchChange
}: ComponentPaletteProps) {
	const [components, setComponents] = useState<FormComponent[]>([])
	const [categories, setCategories] = useState<ComponentCategory[]>([])
	const [filteredComponents, setFilteredComponents] = useState<FormComponent[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string>('')

	// Initialize component library
	useEffect(() => {
		const initializeLibrary = async () => {
			try {
				setIsLoading(true)
				setError('')

				// Initialize the component library
				const initResult = ComponentLibraryMCP.initialize()
				if (!initResult.success) {
					throw new Error(initResult.error?.message || 'Failed to initialize component library')
				}

				// Get all components
				const componentsResult = ComponentLibraryMCP.getLibraries()
				if (!componentsResult.success) {
					throw new Error(componentsResult.error?.message || 'Failed to get component libraries')
				}

				// Extract components from libraries
				const allComponents: FormComponent[] = []
				componentsResult.data.forEach(library => {
					allComponents.push(...library.components)
				})

				setComponents(allComponents)

				// Get unique categories
				const uniqueCategories = Array.from(new Set(allComponents.map(comp => comp.category)))
				setCategories(uniqueCategories)

				// Set default category if none selected
				if (!selectedCategory && uniqueCategories.length > 0) {
					onCategoryChange?.(uniqueCategories[0])
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load components')
			} finally {
				setIsLoading(false)
			}
		}

		initializeLibrary()
	}, [selectedCategory, onCategoryChange])

	// Filter components based on category and search
	useEffect(() => {
		let filtered = components

		// Filter by category
		if (selectedCategory) {
			filtered = filtered.filter(comp => comp.category === selectedCategory)
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase()
			filtered = filtered.filter(comp =>
				comp.name.toLowerCase().includes(query) ||
				comp.description.toLowerCase().includes(query) ||
				comp.metadata.tags.some(tag => tag.toLowerCase().includes(query))
			)
		}

		setFilteredComponents(filtered)
	}, [components, selectedCategory, searchQuery])

	const handleComponentClick = useCallback((component: FormComponent) => {
		onComponentSelect?.(component)
	}, [onComponentSelect])

	const handleComponentDragStart = useCallback((event: React.DragEvent, component: FormComponent) => {
		event.dataTransfer.setData('application/json', JSON.stringify(component))
		onComponentDrag?.(component)
	}, [onComponentDrag])

	const getCategoryIcon = (category: ComponentCategory): string => {
		switch (category) {
			case 'basic':
				return 'pi pi-cog'
			case 'advanced':
				return 'pi pi-star'
			case 'financial':
				return 'pi pi-dollar'
			case 'contact':
				return 'pi pi-phone'
			case 'media':
				return 'pi pi-image'
			case 'layout':
				return 'pi pi-th-large'
			case 'custom':
				return 'pi pi-palette'
			default:
				return 'pi pi-circle'
		}
	}

	const getCategoryLabel = (category: ComponentCategory): string => {
		switch (category) {
			case 'basic':
				return 'Basic'
			case 'advanced':
				return 'Advanced'
			case 'financial':
				return 'Financial'
			case 'contact':
				return 'Contact'
			case 'media':
				return 'Media'
			case 'layout':
				return 'Layout'
			case 'custom':
				return 'Custom'
			default:
				return category
		}
	}

	const categoryOptions = categories.map(category => ({
		label: getCategoryLabel(category),
		value: category,
		icon: getCategoryIcon(category)
	}))

	if (isLoading) {
		return (
			<Card className={`form-flow-card ${className}`}>
				<div className='flex align-items-center justify-content-center p-4'>
					<i className='pi pi-spinner pi-spin text-2xl text-blue-400 mr-2' />
					<span className='text-white'>Loading components...</span>
				</div>
			</Card>
		)
	}

	if (error) {
		return (
			<Card className={`form-flow-card ${className}`}>
				<div className='text-center p-4'>
					<i className='pi pi-exclamation-triangle text-3xl text-red-400 mb-3' />
					<h3 className='text-white mb-2'>Error Loading Components</h3>
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
				<h3 className='text-xl font-semibold text-white'>Component Library</h3>
				<Badge value={filteredComponents.length} severity='info' />
			</div>

			{/* Search and Filter Controls */}
			<div className='space-y-3 mb-4'>
				<div className='field'>
					<label className='block text-sm font-medium text-gray-300 mb-2'>
						Search Components
					</label>
					<InputText
						value={searchQuery}
						onChange={(e) => onSearchChange?.(e.target.value)}
						placeholder='Search components...'
						className='w-full'
						icon='pi pi-search'
					/>
				</div>

				<div className='field'>
					<label className='block text-sm font-medium text-gray-300 mb-2'>
						Category
					</label>
					<Dropdown
						value={selectedCategory}
						options={categoryOptions}
						onChange={(e) => onCategoryChange?.(e.value)}
						optionLabel='label'
						optionValue='value'
						className='w-full'
						placeholder='Select category'
					/>
				</div>
			</div>

			{/* Components Grid */}
			<ScrollPanel style={{ height: '400px' }} className='custom-scrollbar'>
				<div className='grid'>
					{filteredComponents.map((component) => (
						<div key={component.id} className='col-12 md:col-6 lg:col-4'>
							<Card
								className='component-card cursor-pointer hover:shadow-lg transition-all duration-200'
								onClick={() => handleComponentClick(component)}
								draggable
								onDragStart={(e) => handleComponentDragStart(e, component)}
							>
								<div className='text-center p-3'>
									<div className='mb-3'>
										<i className={`${component.icon} text-3xl text-blue-400`} />
									</div>
									
									<h4 className='text-white font-medium mb-2'>{component.name}</h4>
									
									<p className='text-gray-300 text-sm mb-3 line-clamp-2'>
										{component.description}
									</p>
									
									<div className='flex justify-center gap-1 mb-3'>
										{component.metadata.tags.slice(0, 3).map((tag, index) => (
											<Badge
												key={index}
												value={tag}
												severity='secondary'
												size='small'
											/>
										))}
									</div>
									
									<div className='flex justify-between items-center text-xs text-gray-400'>
										<span>Type: {component.type}</span>
										<span>v{component.metadata.version}</span>
									</div>
								</div>
							</Card>
						</div>
					))}
				</div>

				{filteredComponents.length === 0 && (
					<div className='text-center p-6'>
						<i className='pi pi-search text-4xl text-gray-400 mb-3' />
						<h4 className='text-white mb-2'>No Components Found</h4>
						<p className='text-gray-300'>
							{searchQuery.trim() 
								? 'Try adjusting your search terms or category filter'
								: 'No components available in this category'
							}
						</p>
					</div>
				)}
			</ScrollPanel>

			{/* Component Info Footer */}
			<div className='border-t border-gray-700 pt-3 mt-4'>
				<div className='flex justify-between items-center text-sm text-gray-400'>
					<span>
						{filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''} available
					</span>
					<span>
						{selectedCategory ? getCategoryLabel(selectedCategory) : 'All Categories'}
					</span>
				</div>
			</div>
		</Card>
	)
}
