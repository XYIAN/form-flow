import { useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Card } from 'primereact/card'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { TemplateLibraryMCP } from '@/lib/mcp'
import { FormTemplate, TemplateCategory } from '@/types'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import { CustomizableBackground } from '../../../shared/components/CustomizableBackground'
import { TemplatePreview } from './TemplatePreview'
import { Draggable } from '../../../shared/components/Draggable'
import { DragPreview } from '../../../shared/components/DragPreview'
import '../../../shared/styles/transitions.css'

interface TemplateGalleryProps {
	selectedTemplate: FormTemplate | undefined
	selectedCategory: TemplateCategory
	onCategoryChange: (category: TemplateCategory) => void
	searchQuery: string
	onSearchChange: (query: string) => void
	difficultyFilter: 'beginner' | 'intermediate' | 'advanced' | null
	onDifficultyChange: (
		difficulty: 'beginner' | 'intermediate' | 'advanced' | null
	) => void
	onTemplateSelect: (template: FormTemplate) => void
	onTemplateUse: (template: FormTemplate) => void
}

export default function TemplateGallery({
	selectedTemplate,
	selectedCategory,
	onCategoryChange,
	searchQuery,
	onSearchChange,
	difficultyFilter,
	onDifficultyChange,
	onTemplateSelect,
	onTemplateUse,
}: TemplateGalleryProps) {
	const [templates, setTemplates] = useState<FormTemplate[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [customStyles, setCustomStyles] = useState<
		Record<string, { background: string; opacity: number }>
	>({})
	const debouncedSearch = useDebounce(searchQuery, 300)

	useEffect(() => {
		const initializeTemplates = async () => {
			setLoading(true)
			setError(null)

			const initResult = await TemplateLibraryMCP.initialize()
			if (!initResult.success) {
				setError(
					initResult.errors?.[0]?.message ||
						'Failed to initialize template library'
				)
				setLoading(false)
				return
			}

			const templatesResult = await TemplateLibraryMCP.getTemplatesByCategory(
				selectedCategory
			)
			if (!templatesResult.success || !templatesResult.data) {
				setError(
					templatesResult.errors?.[0]?.message || 'Failed to load templates'
				)
				setLoading(false)
				return
			}

			setTemplates(
				difficultyFilter
					? templatesResult.data.filter(t => t.difficulty === difficultyFilter)
					: templatesResult.data
			)
			setLoading(false)
		}

		initializeTemplates()
	}, [selectedCategory, difficultyFilter])

	useEffect(() => {
		const searchTemplates = async () => {
			if (!debouncedSearch) {
				const templatesResult = await TemplateLibraryMCP.getTemplatesByCategory(
					selectedCategory
				)
				if (templatesResult.success && templatesResult.data) {
					setTemplates(
						difficultyFilter
							? templatesResult.data.filter(
									t => t.difficulty === difficultyFilter
							  )
							: templatesResult.data
					)
				}
				return
			}

			const searchResult = await TemplateLibraryMCP.searchTemplates(
				debouncedSearch
			)
			if (searchResult.success && searchResult.data) {
				setTemplates(
					searchResult.data
						.filter(t => t.category === selectedCategory)
						.filter(t => !difficultyFilter || t.difficulty === difficultyFilter)
				)
			}
		}

		searchTemplates()
	}, [debouncedSearch, selectedCategory, difficultyFilter])

	const handleCustomizeBackground = (
		templateId: string,
		style: { background: string; opacity: number }
	) => {
		setCustomStyles(prev => ({
			...prev,
			[templateId]: style,
		}))
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
								placeholder='Search templates...'
								value={searchQuery}
								onChange={e => onSearchChange(e.target.value)}
							/>
						</div>
					</div>
					<Dropdown
						value={selectedCategory}
						options={[
							{ label: 'Contact', value: 'contact' },
							{ label: 'Financial', value: 'financial' },
							{ label: 'Survey', value: 'survey' },
							{ label: 'Application', value: 'application' },
							{ label: 'General', value: 'general' },
						]}
						onChange={e => onCategoryChange(e.value)}
						placeholder='Select Category'
					/>
					<Dropdown
						value={difficultyFilter}
						options={[
							{ label: 'All Levels', value: null },
							{ label: 'Beginner', value: 'beginner' },
							{ label: 'Intermediate', value: 'intermediate' },
							{ label: 'Advanced', value: 'advanced' },
						]}
						onChange={e => onDifficultyChange(e.value)}
						placeholder='Select Difficulty'
					/>
				</div>

				<TransitionGroup className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{loading ? (
						<div className='col-span-full text-center'>
							Loading templates...
						</div>
					) : templates.length === 0 ? (
						<div className='col-span-full text-center'>No templates found</div>
					) : (
						templates.map(template => (
							<CSSTransition key={template.id} timeout={300} classNames='fade'>
								<Draggable type='template' data={template} className='w-full'>
									<CustomizableBackground
										className='template-card'
										defaultBackground={
											customStyles[template.id]?.background || '#ffffff'
										}
										defaultOpacity={customStyles[template.id]?.opacity || 1}
										onCustomize={style =>
											handleCustomizeBackground(template.id, style)
										}
									>
										<Card
											className={`cursor-pointer transition-all ${
												selectedTemplate?.id === template.id
													? 'ring-2 ring-primary'
													: ''
											}`}
											onClick={() => onTemplateSelect(template)}
										>
											<div className='space-y-3'>
												<div className='flex items-start justify-between'>
													<div>
														<h3 className='text-lg font-semibold'>
															{template.name}
														</h3>
														<p className='text-sm text-gray-600'>
															{template.description}
														</p>
													</div>
													<div className='flex items-center gap-2'>
														<Badge
															value={template.difficulty}
															severity={getDifficultyColor(template.difficulty)}
														/>
														<TemplatePreview
															template={template}
															onUse={onTemplateUse}
														/>
													</div>
												</div>

												<div className='grid grid-cols-12 gap-2 p-2 bg-gray-50 rounded'>
													{template.layout.sections.map((section, index) => (
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
													<Badge value={`${template.fields.length} fields`} />
													<Badge
														value={`${template.layout.sections.length} sections`}
													/>
													{template.metadata?.source && (
														<Badge value={template.metadata.source} />
													)}
												</div>

												<Button
													label='Use Template'
													icon='pi pi-check'
													className='w-full p-button-outlined'
													onClick={e => {
														e.stopPropagation()
														onTemplateUse(template)
													}}
												/>
											</div>
										</Card>
									</CustomizableBackground>
								</Draggable>
							</CSSTransition>
						))
					)}
				</TransitionGroup>
			</div>
		</>
	)
}
