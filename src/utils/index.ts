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
	return headers.map((header) => ({
		id: generateId(),
		label: header.trim(),
		type: 'text' as FieldType,
		required: false,
		placeholder: `Enter ${header.toLowerCase()}`
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
		minute: '2-digit'
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
		text: 'Text Input',
		email: 'Email',
		number: 'Number',
		date: 'Date',
		textarea: 'Text Area',
		select: 'Dropdown',
		checkbox: 'Checkbox',
		radio: 'Radio Button'
	}
	return typeMap[type]
} 