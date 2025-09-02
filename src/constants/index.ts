import { FieldType } from '@/types'

export const FIELD_TYPES: {
	value: FieldType
	label: string
	category: string
}[] = [
	// Basic Input Types
	{ value: 'text', label: 'Text Input', category: 'basic' },
	{ value: 'email', label: 'Email', category: 'basic' },
	{ value: 'password', label: 'Password', category: 'basic' },
	{ value: 'number', label: 'Number', category: 'basic' },
	{ value: 'url', label: 'URL', category: 'basic' },
	{ value: 'search', label: 'Search', category: 'basic' },

	// Date & Time Types
	{ value: 'date', label: 'Date', category: 'date-time' },
	{ value: 'datetime', label: 'Date & Time', category: 'date-time' },
	{ value: 'time', label: 'Time', category: 'date-time' },
	{ value: 'month', label: 'Month', category: 'date-time' },
	{ value: 'week', label: 'Week', category: 'date-time' },
	{ value: 'year', label: 'Year', category: 'date-time' },

	// Text Area Types
	{ value: 'textarea', label: 'Text Area', category: 'text-advanced' },
	{ value: 'rich-text', label: 'Rich Text', category: 'text-advanced' },
	{ value: 'markdown', label: 'Markdown', category: 'text-advanced' },

	// Selection Types
	{ value: 'select', label: 'Dropdown', category: 'selection' },
	{ value: 'multiselect', label: 'Multi-Select', category: 'selection' },
	{ value: 'checkbox', label: 'Checkbox Group', category: 'selection' },
	{ value: 'radio', label: 'Radio Buttons', category: 'selection' },
	{ value: 'yesno', label: 'Yes/No Question', category: 'selection' },
	{ value: 'toggle', label: 'Toggle Switch', category: 'selection' },

	// Financial Types
	{ value: 'money', label: 'Money/Currency', category: 'financial' },
	{ value: 'percentage', label: 'Percentage', category: 'financial' },
	{ value: 'currency', label: 'Currency', category: 'financial' },

	// Contact Types
	{ value: 'phone', label: 'Phone Number', category: 'contact' },
	{ value: 'address', label: 'Address', category: 'contact' },
	{ value: 'country', label: 'Country', category: 'contact' },
	{ value: 'state', label: 'State/Province', category: 'contact' },
	{ value: 'zipcode', label: 'ZIP/Postal Code', category: 'contact' },

	// File & Media Types
	{ value: 'file', label: 'File Upload', category: 'file-media' },
	{ value: 'image', label: 'Image Upload', category: 'file-media' },
	{ value: 'signature', label: 'Signature', category: 'file-media' },
	{ value: 'audio', label: 'Audio Upload', category: 'file-media' },
	{ value: 'video', label: 'Video Upload', category: 'file-media' },

	// Rating & Scale Types
	{ value: 'rating', label: 'Rating', category: 'rating-scale' },
	{ value: 'slider', label: 'Slider', category: 'rating-scale' },
	{ value: 'range', label: 'Range', category: 'rating-scale' },
	{ value: 'likert', label: 'Likert Scale', category: 'rating-scale' },

	// Specialized Types
	{ value: 'color', label: 'Color Picker', category: 'specialized' },
	{ value: 'tags', label: 'Tags', category: 'specialized' },
	{ value: 'autocomplete', label: 'Autocomplete', category: 'specialized' },
	{ value: 'location', label: 'Location', category: 'specialized' },
	{ value: 'matrix', label: 'Matrix', category: 'specialized' },
]

export const FIELD_CATEGORIES = [
	{ id: 'basic', name: 'Basic Inputs', icon: 'pi pi-font' },
	{ id: 'date-time', name: 'Date & Time', icon: 'pi pi-calendar' },
	{ id: 'text-advanced', name: 'Advanced Text', icon: 'pi pi-align-left' },
	{ id: 'selection', name: 'Selection', icon: 'pi pi-list' },
	{ id: 'financial', name: 'Financial', icon: 'pi pi-dollar' },
	{ id: 'contact', name: 'Contact', icon: 'pi pi-phone' },
	{ id: 'file-media', name: 'File & Media', icon: 'pi pi-upload' },
	{ id: 'rating-scale', name: 'Rating & Scale', icon: 'pi pi-star' },
	{ id: 'specialized', name: 'Specialized', icon: 'pi pi-cog' },
]

export const VALIDATION_PATTERNS = {
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	phone: /^[\+]?[1-9][\d]{0,15}$/,
	zipCode: /^\d{5}(-\d{4})?$/,
	money: /^\$?[\d,]+(\.\d{2})?$/,
	address: /^[\w\s,.-]+$/,
	file: /\.(pdf|doc|docx|jpg|jpeg|png|txt)$/i,
}

export const APP_NAME = 'Form Flow'
export const APP_DESCRIPTION = 'Class Action Lawsuit Form Management Tool'

// Hardcoded users for demo purposes
export const DEMO_USERS = [
	{
		id: '1',
		email: 'admin@lawfirm.com',
		companyName: 'Smith & Associates Law Firm',
		createdAt: new Date('2024-01-01'),
	},
	{
		id: '2',
		email: 'manager@classaction.com',
		companyName: 'Class Action Management LLC',
		createdAt: new Date('2024-01-15'),
	},
]
