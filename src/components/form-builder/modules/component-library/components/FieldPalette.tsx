'use client'

import React, { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Badge } from 'primereact/badge'
import { ScrollPanel } from 'primereact/scrollpanel'
import { FieldType } from '@/types'

interface FieldTypeConfig {
	id: FieldType
	name: string
	description: string
	category: FieldCategory
	icon: string
	component: string
	requiresOptions: boolean
	hasValidation: boolean
	hasFileUpload: boolean
	hasCustomProps: boolean
}

type FieldCategory =
	| 'basic'
	| 'date-time'
	| 'text-advanced'
	| 'selection'
	| 'financial'
	| 'contact'
	| 'file-media'
	| 'rating-scale'
	| 'specialized'

const FIELD_TYPES: FieldTypeConfig[] = [
	// Basic Input Types
	{
		id: 'text',
		name: 'Text Input',
		description: 'Single-line text input field',
		category: 'basic',
		icon: 'pi pi-font',
		component: 'InputText',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: false,
	},
	{
		id: 'email',
		name: 'Email',
		description: 'Email address input with validation',
		category: 'basic',
		icon: 'pi pi-envelope',
		component: 'InputText',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: false,
	},
	{
		id: 'password',
		name: 'Password',
		description: 'Password input field with masking',
		category: 'basic',
		icon: 'pi pi-lock',
		component: 'Password',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: false,
	},
	{
		id: 'number',
		name: 'Number',
		description: 'Numeric input field',
		category: 'basic',
		icon: 'pi pi-hashtag',
		component: 'InputNumber',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'url',
		name: 'URL',
		description: 'URL input field with validation',
		category: 'basic',
		icon: 'pi pi-link',
		component: 'InputText',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'search',
		name: 'Search',
		description: 'Search input field with suggestions',
		category: 'basic',
		icon: 'pi pi-search',
		component: 'InputText',
		requiresOptions: false,
		hasValidation: false,
		hasFileUpload: false,
		hasCustomProps: false,
	},

	// Date & Time Types
	{
		id: 'date',
		name: 'Date',
		description: 'Date picker with calendar',
		category: 'date-time',
		icon: 'pi pi-calendar',
		component: 'Calendar',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'datetime',
		name: 'Date & Time',
		description: 'Date and time picker',
		category: 'date-time',
		icon: 'pi pi-clock',
		component: 'Calendar',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'time',
		name: 'Time',
		description: 'Time picker',
		category: 'date-time',
		icon: 'pi pi-clock',
		component: 'Calendar',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'month',
		name: 'Month',
		description: 'Month picker',
		category: 'date-time',
		icon: 'pi pi-calendar-plus',
		component: 'Calendar',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'week',
		name: 'Week',
		description: 'Week picker',
		category: 'date-time',
		icon: 'pi pi-calendar-minus',
		component: 'Calendar',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'year',
		name: 'Year',
		description: 'Year picker',
		category: 'date-time',
		icon: 'pi pi-calendar-times',
		component: 'Calendar',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},

	// Text Area Types
	{
		id: 'textarea',
		name: 'Text Area',
		description: 'Multi-line text input',
		category: 'text-advanced',
		icon: 'pi pi-align-left',
		component: 'InputTextarea',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'rich-text',
		name: 'Rich Text',
		description: 'Rich text editor with formatting',
		category: 'text-advanced',
		icon: 'pi pi-file-edit',
		component: 'Editor',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'markdown',
		name: 'Markdown',
		description: 'Markdown text editor',
		category: 'text-advanced',
		icon: 'pi pi-code',
		component: 'InputTextarea',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},

	// Selection Types
	{
		id: 'select',
		name: 'Dropdown',
		description: 'Single selection dropdown',
		category: 'selection',
		icon: 'pi pi-list',
		component: 'Dropdown',
		requiresOptions: true,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: false,
	},
	{
		id: 'multiselect',
		name: 'Multi-Select',
		description: 'Multiple selection dropdown',
		category: 'selection',
		icon: 'pi pi-list',
		component: 'MultiSelect',
		requiresOptions: true,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: false,
	},
	{
		id: 'checkbox',
		name: 'Checkbox Group',
		description: 'Multiple selection checkboxes',
		category: 'selection',
		icon: 'pi pi-check-square',
		component: 'Checkbox',
		requiresOptions: true,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: false,
	},
	{
		id: 'radio',
		name: 'Radio Buttons',
		description: 'Single selection radio buttons',
		category: 'selection',
		icon: 'pi pi-circle-fill',
		component: 'RadioButton',
		requiresOptions: true,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: false,
	},
	{
		id: 'yesno',
		name: 'Yes/No',
		description: 'Yes or No question',
		category: 'selection',
		icon: 'pi pi-question-circle',
		component: 'RadioButton',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: false,
	},
	{
		id: 'toggle',
		name: 'Toggle Switch',
		description: 'On/Off toggle switch',
		category: 'selection',
		icon: 'pi pi-toggle-on',
		component: 'ToggleButton',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},

	// Financial Types
	{
		id: 'money',
		name: 'Money/Currency',
		description: 'Currency input with formatting',
		category: 'financial',
		icon: 'pi pi-dollar',
		component: 'InputMask',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'percentage',
		name: 'Percentage',
		description: 'Percentage input with validation',
		category: 'financial',
		icon: 'pi pi-percentage',
		component: 'InputNumber',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'currency',
		name: 'Currency',
		description: 'Currency input with symbol',
		category: 'financial',
		icon: 'pi pi-money-bill',
		component: 'InputMask',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},

	// Contact Types
	{
		id: 'phone',
		name: 'Phone Number',
		description: 'Phone number with formatting',
		category: 'contact',
		icon: 'pi pi-phone',
		component: 'InputMask',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: false,
	},
	{
		id: 'address',
		name: 'Address',
		description: 'Address input field',
		category: 'contact',
		icon: 'pi pi-map-marker',
		component: 'InputText',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'country',
		name: 'Country',
		description: 'Country selection dropdown',
		category: 'contact',
		icon: 'pi pi-globe',
		component: 'Dropdown',
		requiresOptions: true,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: false,
	},
	{
		id: 'state',
		name: 'State/Province',
		description: 'State or province selection',
		category: 'contact',
		icon: 'pi pi-map',
		component: 'Dropdown',
		requiresOptions: true,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: false,
	},
	{
		id: 'zipcode',
		name: 'ZIP/Postal Code',
		description: 'ZIP or postal code input',
		category: 'contact',
		icon: 'pi pi-home',
		component: 'InputText',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: false,
	},

	// File & Media Types
	{
		id: 'file',
		name: 'File Upload',
		description: 'File upload with restrictions',
		category: 'file-media',
		icon: 'pi pi-upload',
		component: 'FileUpload',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: true,
		hasCustomProps: true,
	},
	{
		id: 'image',
		name: 'Image Upload',
		description: 'Image file upload with preview',
		category: 'file-media',
		icon: 'pi pi-image',
		component: 'FileUpload',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: true,
		hasCustomProps: true,
	},
	{
		id: 'signature',
		name: 'Signature',
		description: 'Digital signature capture',
		category: 'file-media',
		icon: 'pi pi-pencil',
		component: 'InputText',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: false,
	},
	{
		id: 'audio',
		name: 'Audio Upload',
		description: 'Audio file upload',
		category: 'file-media',
		icon: 'pi pi-volume-up',
		component: 'FileUpload',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: true,
		hasCustomProps: true,
	},
	{
		id: 'video',
		name: 'Video Upload',
		description: 'Video file upload',
		category: 'file-media',
		icon: 'pi pi-video',
		component: 'FileUpload',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: true,
		hasCustomProps: true,
	},

	// Rating & Scale Types
	{
		id: 'rating',
		name: 'Rating',
		description: 'Star rating input',
		category: 'rating-scale',
		icon: 'pi pi-star',
		component: 'Rating',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'slider',
		name: 'Slider',
		description: 'Range slider input',
		category: 'rating-scale',
		icon: 'pi pi-sliders-h',
		component: 'Slider',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'range',
		name: 'Range',
		description: 'Range input with min/max',
		category: 'rating-scale',
		icon: 'pi pi-arrows-h',
		component: 'Slider',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'likert',
		name: 'Likert Scale',
		description: 'Likert scale rating',
		category: 'rating-scale',
		icon: 'pi pi-chart-bar',
		component: 'RadioButton',
		requiresOptions: true,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},

	// Specialized Types
	{
		id: 'color',
		name: 'Color Picker',
		description: 'Color selection input',
		category: 'specialized',
		icon: 'pi pi-palette',
		component: 'ColorPicker',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'tags',
		name: 'Tags',
		description: 'Tag input with suggestions',
		category: 'specialized',
		icon: 'pi pi-tags',
		component: 'Chips',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'autocomplete',
		name: 'Autocomplete',
		description: 'Autocomplete input with suggestions',
		category: 'specialized',
		icon: 'pi pi-search-plus',
		component: 'AutoComplete',
		requiresOptions: true,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'location',
		name: 'Location',
		description: 'Location picker with map',
		category: 'specialized',
		icon: 'pi pi-map-marker',
		component: 'InputText',
		requiresOptions: false,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
	{
		id: 'matrix',
		name: 'Matrix',
		description: 'Matrix question with rows and columns',
		category: 'specialized',
		icon: 'pi pi-table',
		component: 'DataTable',
		requiresOptions: true,
		hasValidation: true,
		hasFileUpload: false,
		hasCustomProps: true,
	},
]

const CATEGORY_LABELS: Record<FieldCategory, string> = {
	basic: 'Basic Inputs',
	'date-time': 'Date & Time',
	'text-advanced': 'Advanced Text',
	selection: 'Selection',
	financial: 'Financial',
	contact: 'Contact',
	'file-media': 'File & Media',
	'rating-scale': 'Rating & Scale',
	specialized: 'Specialized',
}

const CATEGORY_ICONS: Record<FieldCategory, string> = {
	basic: 'pi pi-keyboard',
	'date-time': 'pi pi-calendar',
	'text-advanced': 'pi pi-file-edit',
	selection: 'pi pi-list',
	financial: 'pi pi-dollar',
	contact: 'pi pi-phone',
	'file-media': 'pi pi-upload',
	'rating-scale': 'pi pi-star',
	specialized: 'pi pi-cog',
}

interface DraggableFieldProps {
	fieldType: FieldTypeConfig
}

function DraggableField({ fieldType }: DraggableFieldProps) {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id: `field-${fieldType.id}`,
			data: {
				type: 'field',
				fieldType: fieldType.id,
				config: fieldType,
			},
		})

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
		  }
		: undefined

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={`
				p-3 border border-gray-600 rounded-lg cursor-grab active:cursor-grabbing
				hover:border-purple-400 hover:bg-purple-900/20 transition-all duration-200
				${isDragging ? 'opacity-50 scale-105' : ''}
			`}
		>
			<div className='flex items-center gap-3'>
				<i className={`${fieldType.icon} text-purple-400`} />
				<div className='flex-1 min-w-0'>
					<div className='font-medium text-white text-sm truncate'>
						{fieldType.name}
					</div>
					<div className='text-gray-400 text-xs truncate'>
						{fieldType.description}
					</div>
				</div>
				<div className='flex gap-1'>
					{fieldType.requiresOptions && (
						<Badge value='Options' severity='info' size='small' />
					)}
					{fieldType.hasValidation && (
						<Badge value='Validation' severity='success' size='small' />
					)}
					{fieldType.hasFileUpload && (
						<Badge value='File' severity='warning' size='small' />
					)}
				</div>
			</div>
		</div>
	)
}

interface FieldPaletteProps {
	className?: string
}

export default function FieldPalette({ className = '' }: FieldPaletteProps) {
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<
		FieldCategory | 'all'
	>('all')

	// Filter fields based on search and category
	const filteredFields = FIELD_TYPES.filter(field => {
		const matchesSearch =
			field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			field.description.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesCategory =
			selectedCategory === 'all' || field.category === selectedCategory
		return matchesSearch && matchesCategory
	})

	// Group fields by category
	const groupedFields = filteredFields.reduce((acc, field) => {
		if (!acc[field.category]) {
			acc[field.category] = []
		}
		acc[field.category].push(field)
		return acc
	}, {} as Record<FieldCategory, FieldTypeConfig[]>)

	return (
		<Card className={`h-full ${className}`}>
			<div className='p-4 border-b border-gray-600'>
				<h3 className='text-lg font-semibold text-white mb-3'>Field Palette</h3>

				{/* Search */}
				<div className='mb-3'>
					<InputText
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						placeholder='Search fields...'
						className='w-full'
						icon='pi pi-search'
					/>
				</div>

				{/* Category Filter */}
				<div className='flex flex-wrap gap-2'>
					<button
						onClick={() => setSelectedCategory('all')}
						className={`
							px-3 py-1 rounded-full text-xs font-medium transition-colors
							${
								selectedCategory === 'all'
									? 'bg-purple-600 text-white'
									: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
							}
						`}
					>
						All ({FIELD_TYPES.length})
					</button>
					{Object.entries(CATEGORY_LABELS).map(([category, label]) => {
						const count = FIELD_TYPES.filter(
							f => f.category === category
						).length
						return (
							<button
								key={category}
								onClick={() => setSelectedCategory(category as FieldCategory)}
								className={`
									px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1
									${
										selectedCategory === category
											? 'bg-purple-600 text-white'
											: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
									}
								`}
							>
								<i className={CATEGORY_ICONS[category as FieldCategory]} />
								{label} ({count})
							</button>
						)
					})}
				</div>
			</div>

			<ScrollPanel className='h-full'>
				<div className='p-4 space-y-4'>
					{selectedCategory === 'all' ? (
						// Show all categories
						Object.entries(groupedFields).map(([category, fields]) => (
							<div key={category} className='space-y-2'>
								<div className='flex items-center gap-2 text-sm font-medium text-gray-300'>
									<i className={CATEGORY_ICONS[category as FieldCategory]} />
									{CATEGORY_LABELS[category as FieldCategory]} ({fields.length})
								</div>
								<div className='space-y-2'>
									{fields.map(field => (
										<DraggableField key={field.id} fieldType={field} />
									))}
								</div>
							</div>
						))
					) : (
						// Show single category
						<div className='space-y-2'>
							{filteredFields.map(field => (
								<DraggableField key={field.id} fieldType={field} />
							))}
						</div>
					)}

					{filteredFields.length === 0 && (
						<div className='text-center py-8 text-gray-400'>
							<i className='pi pi-search text-2xl mb-2' />
							<div>No fields found matching your search</div>
						</div>
					)}
				</div>
			</ScrollPanel>
		</Card>
	)
}
