import { FormField, FieldType } from '@/types'

/**
 * Generate a unique ID for form fields
 */
export function generateId(): string {
	return Math.random().toString(36).substr(2, 9)
}

/**
 * Convert CSV headers to form fields
 */
export function csvHeadersToFields(headers: string[]): FormField[] {
	return headers.map(header => ({
		id: generateId(),
		label: header.trim(),
		type: 'text' as FieldType,
		required: false,
		placeholder: `Enter ${header.toLowerCase()}`,
	}))
}

/**
 * Parse CSV file content
 */
export function parseCSV(csvContent: string): string[] {
	const lines = csvContent.split('\n')
	if (lines.length === 0) return []

	// Get headers from first line
	const headers = lines[0].split(',').map(header => header.trim())
	return headers.filter(header => header.length > 0)
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}

/**
 * Get field type display name
 */
export function getFieldTypeLabel(type: FieldType): string {
	const typeMap: Record<FieldType, string> = {
		// Basic Input Types
		text: 'Text Input',
		email: 'Email',
		password: 'Password',
		number: 'Number',
		url: 'URL',
		search: 'Search',

		// Date & Time Types
		date: 'Date',
		datetime: 'Date & Time',
		time: 'Time',
		month: 'Month',
		week: 'Week',
		year: 'Year',

		// Text Area Types
		textarea: 'Text Area',
		'rich-text': 'Rich Text',
		markdown: 'Markdown',

		// Selection Types
		select: 'Dropdown',
		multiselect: 'Multi-Select',
		checkbox: 'Checkbox',
		radio: 'Radio Button',
		yesno: 'Yes/No Question',
		toggle: 'Toggle Switch',

		// Financial Types
		money: 'Money/Currency',
		percentage: 'Percentage',
		currency: 'Currency',

		// Contact Types
		phone: 'Phone Number',
		address: 'Address',
		country: 'Country',
		state: 'State/Province',
		zipcode: 'ZIP/Postal Code',

		// File & Media Types
		file: 'File Upload',
		image: 'Image Upload',
		signature: 'Signature',
		audio: 'Audio Upload',
		video: 'Video Upload',

		// Rating & Scale Types
		rating: 'Rating Scale',
		slider: 'Slider',
		range: 'Range Input',
		likert: 'Likert Scale',

		// Specialized Types
		color: 'Color Picker',
		tags: 'Tags/Keywords',
		autocomplete: 'Autocomplete',
		location: 'Location',
		matrix: 'Matrix Grid',
	}
	return typeMap[type]
}
