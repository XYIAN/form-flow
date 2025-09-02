import { useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Card } from 'primereact/card'
import { Badge } from 'primereact/badge'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { ComponentLibraryMCP } from '@/lib/mcp'
import { FormComponent, ComponentCategory } from '@/types'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import { CustomizableBackground } from '../../../shared/components/CustomizableBackground'
import { ComponentPreview } from './ComponentPreview'
import { Draggable } from '../../../shared/components/Draggable'
import { DragPreview } from '../../../shared/components/DragPreview'
import '../../../shared/styles/transitions.css'

interface ComponentPaletteProps {
	selectedCategory: ComponentCategory
	onCategoryChange: (category: ComponentCategory) => void
	searchQuery: string
	onSearchChange: (query: string) => void
	onComponentSelect: (component: FormComponent) => void
}

export default function ComponentPalette({
	selectedCategory,
	onCategoryChange,
	searchQuery,
	onSearchChange,
	onComponentSelect,
}: ComponentPaletteProps) {
	const [components, setComponents] = useState<FormComponent[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [customStyles, setCustomStyles] = useState<
		Record<string, { background: string; opacity: number }>
	>({})
	const debouncedSearch = useDebounce(searchQuery, 300)

	useEffect(() => {
		const initializeLibrary = async () => {
			setLoading(true)
			setError(null)

			const initResult = await ComponentLibraryMCP.initialize()
			if (!initResult.success) {
				setError(
					initResult.errors?.[0]?.message ||
						'Failed to initialize component library'
				)
				setLoading(false)
				return
			}

			const componentsResult =
				await ComponentLibraryMCP.getComponentsByCategory(selectedCategory)
			if (!componentsResult.success || !componentsResult.data) {
				setError(
					componentsResult.errors?.[0]?.message || 'Failed to load components'
				)
				setLoading(false)
				return
			}

			setComponents(componentsResult.data)
			setLoading(false)
		}

		initializeLibrary()
	}, [selectedCategory])

	useEffect(() => {
		const searchComponents = async () => {
			if (!debouncedSearch) {
				const componentsResult =
					await ComponentLibraryMCP.getComponentsByCategory(selectedCategory)
				if (componentsResult.success && componentsResult.data) {
					setComponents(componentsResult.data)
				}
				return
			}

			const searchResult = await ComponentLibraryMCP.searchComponents(
				debouncedSearch
			)
			if (searchResult.success && searchResult.data) {
				setComponents(
					searchResult.data.filter(c => c.category === selectedCategory)
				)
			}
		}

		searchComponents()
	}, [debouncedSearch, selectedCategory])

	const handleCustomizeBackground = (
		componentId: string,
		style: { background: string; opacity: number }
	) => {
		setCustomStyles(prev => ({
			...prev,
			[componentId]: style,
		}))
	}

	if (error) {
		return <div className='p-4 text-red-500'>{error}</div>
	}

	return (
		<>
			<DragPreview />
			<div className='space-y-4'>
				<div className='flex flex-wrap gap-4'>
					<div className='flex-grow'>
						<div className='p-input-icon-left w-full'>
							<i className='pi pi-search' />
							<InputText
								className='w-full'
								placeholder='Search components...'
								value={searchQuery}
								onChange={e => onSearchChange(e.target.value)}
							/>
						</div>
					</div>
					<Dropdown
						value={selectedCategory}
						options={[
							{ label: 'Basic', value: 'basic' },
							{ label: 'Contact', value: 'contact' },
							{ label: 'Financial', value: 'financial' },
							{ label: 'DateTime', value: 'datetime' },
							{ label: 'Choice', value: 'choice' },
							{ label: 'Media', value: 'media' },
						]}
						onChange={e => onCategoryChange(e.value)}
						placeholder='Select Category'
					/>
				</div>

				<TransitionGroup className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{loading ? (
					<div className='col-span-full text-center'>Loading components...</div>
				) : components.length === 0 ? (
					<div className='col-span-full text-center'>No components found</div>
				) : (
					components.map(component => (
						<CSSTransition key={component.id} timeout={300} classNames='fade'>
							<Draggable
								type="component"
								data={component}
								className="w-full"
							>
								<CustomizableBackground
									className='component-hover'
									defaultBackground={
										customStyles[component.id]?.background || '#ffffff'
									}
									defaultOpacity={customStyles[component.id]?.opacity || 1}
									onCustomize={style =>
										handleCustomizeBackground(component.id, style)
									}
								>
									<Card
										className='cursor-pointer transition-all'
										onClick={() => onComponentSelect(component)}
									>
										<div className='flex items-start gap-3'>
											<i className={`${component.icon} text-2xl`} />
											<div className='flex-grow'>
												<div className='flex items-center justify-between mb-2'>
													<h3 className='text-lg font-semibold'>
														{component.name}
													</h3>
													<ComponentPreview
														component={component}
														onUse={onComponentSelect}
													/>
												</div>
												<p className='text-sm text-gray-600 mb-2'>
													{component.description}
												</p>
												<div className='flex flex-wrap gap-2'>
													{component.metadata.tags.map(tag => (
														<Badge key={tag} value={tag} />
													))}
												</div>
											</div>
										</div>
									</Card>
								</CustomizableBackground>
							</Draggable>
						</CSSTransition>
					))
				)}
			</TransitionGroup>
		</div>
	)
}
