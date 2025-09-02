'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Badge } from 'primereact/badge'
import { ScrollPanel } from 'primereact/scrollpanel'
import { TemplateLibraryMCP } from '@/lib/mcp'
import { FormTemplate, TemplateCategory } from '@/types'

interface TemplateGalleryProps {
	className?: string
	selectedTemplate?: FormTemplate
	onTemplateSelect?: (template: FormTemplate) => void
	onTemplateUse?: (template: FormTemplate) => void
	selectedCategory?: TemplateCategory
	onCategoryChange?: (category: TemplateCategory) => void
	searchQuery?: string
	onSearchChange?: (query: string) => void
	difficultyFilter?: 'beginner' | 'intermediate' | 'advanced' | null
	onDifficultyChange?: (
		difficulty: 'beginner' | 'intermediate' | 'advanced' | null
	) => void
}

export default function TemplateGallery({
	className = '',
	selectedTemplate,
	onTemplateSelect,
	onTemplateUse,
	selectedCategory,
	onCategoryChange,
	searchQuery = '',
	onSearchChange,
	difficultyFilter,
	onDifficultyChange,
}: TemplateGalleryProps) {
	const [templates, setTemplates] = useState<FormTemplate[]>([])
	const [categories, setCategories] = useState<TemplateCategory[]>([])
	const [filteredTemplates, setFilteredTemplates] = useState<FormTemplate[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string>('')

	// Initialize template library
	useEffect(() => {
		const initializeTemplates = async () => {
			try {
				setIsLoading(true)
				setError('')

				// Initialize the template library
				const initResult = TemplateLibraryMCP.initialize()
				if (!initResult.success) {
					throw new Error(
						initResult.errors?.[0]?.message ||
							'Failed to initialize template library'
					)
				}

				// Get all templates
				const templatesResult = TemplateLibraryMCP.getTemplates()
				if (!templatesResult.success) {
					throw new Error(
						templatesResult.errors?.[0]?.message || 'Failed to get templates'
					)
				}

				if (templatesResult.data) {
					setTemplates(templatesResult.data)
				}

				// Get categories
				const categoriesResult = TemplateLibraryMCP.getTemplateCategories()
				if (categoriesResult.success && categoriesResult.data) {
					setCategories(categoriesResult.data)

					// Set default category if none selected
					if (!selectedCategory && categoriesResult.data.length > 0) {
						onCategoryChange?.(categoriesResult.data[0])
					}
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'Failed to load templates'
				)
			} finally {
				setIsLoading(false)
			}
		}

		initializeTemplates()
	}, [selectedCategory, onCategoryChange])

	// Filter templates based on category, search, and difficulty
	useEffect(() => {
		let filtered = templates

		// Filter by category
		if (selectedCategory) {
			filtered = filtered.filter(
				template => template.category === selectedCategory
			)
		}

		// Filter by difficulty
		if (difficultyFilter) {
			filtered = filtered.filter(
				template => template.metadata.difficulty === difficultyFilter
			)
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase()
			filtered = filtered.filter(
				template =>
					template.name.toLowerCase().includes(query) ||
					template.description.toLowerCase().includes(query) ||
					template.metadata.tags.some(tag => tag.toLowerCase().includes(query))
			)
		}

		setFilteredTemplates(filtered)
	}, [templates, selectedCategory, difficultyFilter, searchQuery])

	const handleTemplateSelect = useCallback(
		(template: FormTemplate) => {
			onTemplateSelect?.(template)
		},
		[onTemplateSelect]
	)

	const handleTemplateUse = useCallback(
		(template: FormTemplate) => {
			onTemplateUse?.(template)
		},
		[onTemplateUse]
	)

	const getCategoryIcon = (category: TemplateCategory): string => {
		switch (category) {
			case 'legal':
				return 'pi pi-briefcase'
			case 'medical':
				return 'pi pi-heart'
			case 'business':
				return 'pi pi-building'
			case 'education':
				return 'pi pi-book'
			case 'survey':
				return 'pi pi-chart-bar'
			case 'contact':
				return 'pi pi-phone'
			case 'registration':
				return 'pi pi-user-plus'
			case 'feedback':
				return 'pi pi-comment'
			case 'custom':
				return 'pi pi-palette'
			default:
				return 'pi pi-circle'
		}
	}

	const getCategoryLabel = (category: TemplateCategory): string => {
		switch (category) {
			case 'legal':
				return 'Legal'
			case 'medical':
				return 'Medical'
			case 'business':
				return 'Business'
			case 'education':
				return 'Education'
			case 'survey':
				return 'Survey'
			case 'contact':
				return 'Contact'
			case 'registration':
				return 'Registration'
			case 'feedback':
				return 'Feedback'
			case 'custom':
				return 'Custom'
			default:
				return category
		}
	}

	const getDifficultyColor = (
		difficulty: 'beginner' | 'intermediate' | 'advanced'
	): string => {
		switch (difficulty) {
			case 'beginner':
				return 'success'
			case 'intermediate':
				return 'warning'
			case 'advanced':
				return 'danger'
			default:
				return 'secondary'
		}
	}

	const categoryOptions = categories.map(category => ({
		label: getCategoryLabel(category),
		value: category,
		icon: getCategoryIcon(category),
	}))

	const difficultyOptions = [
		{ label: 'All Levels', value: null },
		{ label: 'Beginner', value: 'beginner' },
		{ label: 'Intermediate', value: 'intermediate' },
		{ label: 'Advanced', value: 'advanced' },
	]

	if (isLoading) {
		return (
			<Card className={`form-flow-card ${className}`}>
				<div className='flex align-items-center justify-content-center p-4'>
					<i className='pi pi-spinner pi-spin text-2xl text-blue-400 mr-2' />
					<span className='text-white'>Loading templates...</span>
				</div>
			</Card>
		)
	}

	if (error) {
		return (
			<Card className={`form-flow-card ${className}`}>
				<div className='text-center p-4'>
					<i className='pi pi-exclamation-triangle text-3xl text-red-400 mb-3' />
					<h3 className='text-white mb-2'>Error Loading Templates</h3>
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
				<h3 className='text-xl font-semibold text-white'>Template Gallery</h3>
				<Badge value={filteredTemplates.length} severity='info' />
			</div>

			{/* Search and Filter Controls */}
			<div className='space-y-3 mb-4'>
				<div className='field'>
					<label className='block text-sm font-medium text-gray-300 mb-2'>
						Search Templates
					</label>
					<div className='p-input-icon-left'>
						<i className='pi pi-search' />
						<InputText
							value={searchQuery}
							onChange={e => onSearchChange?.(e.target.value)}
							placeholder='Search templates...'
							className='w-full'
						/>
					</div>
				</div>

				<div className='grid'>
					<div className='col-6'>
						<div className='field'>
							<label className='block text-sm font-medium text-gray-300 mb-2'>
								Category
							</label>
							<Dropdown
								value={selectedCategory}
								options={categoryOptions}
								onChange={e => onCategoryChange?.(e.value)}
								optionLabel='label'
								optionValue='value'
								className='w-full'
								placeholder='Select category'
							/>
						</div>
					</div>
					<div className='col-6'>
						<div className='field'>
							<label className='block text-sm font-medium text-gray-300 mb-2'>
								Difficulty
							</label>
							<Dropdown
								value={difficultyFilter}
								options={difficultyOptions}
								onChange={e => onDifficultyChange?.(e.value)}
								optionLabel='label'
								optionValue='value'
								className='w-full'
								placeholder='Select difficulty'
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Templates Grid */}
			<ScrollPanel style={{ height: '400px' }} className='custom-scrollbar'>
				<div className='space-y-3'>
					{filteredTemplates.map(template => (
						<Card
							key={template.id}
							className={`template-card cursor-pointer hover:shadow-lg transition-all duration-200 ${
								selectedTemplate?.id === template.id
									? 'border-blue-400 bg-blue-50'
									: ''
							}`}
							onClick={() => handleTemplateSelect(template)}
						>
							<div className='p-3'>
								<div className='flex justify-between items-start mb-3'>
									<div className='flex-1'>
										<div className='flex items-center gap-2 mb-2'>
											<i
												className={`${getCategoryIcon(
													template.category
												)} text-blue-400`}
											/>
											<h4 className='text-white font-medium'>
												{template.name}
											</h4>
										</div>
										<p className='text-gray-300 text-sm mb-2'>
											{template.description}
										</p>
									</div>
									<div className='flex flex-col items-end gap-2'>
										<Badge
											value={template.metadata.difficulty}
											severity={getDifficultyColor(
												template.metadata.difficulty
											)}
										/>
										<Button
											label='Use Template'
											icon='pi pi-play'
											size='small'
											className='p-button-sm'
											onClick={e => {
												e.stopPropagation()
												handleTemplateUse(template)
											}}
										/>
									</div>
								</div>

								{/* Template Info */}
								<div className='grid mb-3'>
									<div className='col-6'>
										<div className='text-xs text-gray-400'>
											<i className='pi pi-clock mr-1' />
											{template.metadata.estimatedTime} min
										</div>
									</div>
									<div className='col-6'>
										<div className='text-xs text-gray-400'>
											<i className='pi pi-list mr-1' />
											{template.fields.length} fields
										</div>
									</div>
								</div>

								{/* Template Features */}
								<div className='mb-3'>
									<div className='text-xs text-gray-400 mb-1'>Features:</div>
									<div className='flex flex-wrap gap-1'>
										{template.metadata.features
											.slice(0, 3)
											.map((feature, index) => (
												<Badge
													key={index}
													value={feature}
													severity='secondary'
												/>
											))}
										{template.metadata.features.length > 3 && (
											<Badge
												value={`+${template.metadata.features.length - 3} more`}
												severity='secondary'
												size='small'
											/>
										)}
									</div>
								</div>

								{/* Template Tags */}
								<div className='flex gap-1'>
									{template.metadata.tags.slice(0, 3).map((tag, index) => (
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

				{filteredTemplates.length === 0 && (
					<div className='text-center p-6'>
						<i className='pi pi-search text-4xl text-gray-400 mb-3' />
						<h4 className='text-white mb-2'>No Templates Found</h4>
						<p className='text-gray-300'>
							{searchQuery.trim() || selectedCategory || difficultyFilter
								? 'Try adjusting your search terms or filters'
								: 'No templates available'}
						</p>
					</div>
				)}
			</ScrollPanel>

			{/* Template Info Footer */}
			<div className='border-t border-gray-700 pt-3 mt-4'>
				<div className='flex justify-between items-center text-sm text-gray-400'>
					<span>
						{filteredTemplates.length} template
						{filteredTemplates.length !== 1 ? 's' : ''} available
					</span>
					<span>
						{selectedCategory
							? getCategoryLabel(selectedCategory)
							: 'All Categories'}
					</span>
				</div>
			</div>
		</Card>
	)
}
