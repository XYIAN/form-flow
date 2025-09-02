export interface User {
	id: string
	email: string
	companyName: string
	createdAt: Date
}

export type FieldType =
	// Basic Input Types
	| 'text'
	| 'email'
	| 'number'
	| 'password'
	| 'url'
	| 'search'
	// Date & Time Types
	| 'date'
	| 'datetime'
	| 'time'
	| 'month'
	| 'week'
	| 'year'
	// Text Area Types
	| 'textarea'
	| 'rich-text'
	| 'markdown'
	// Selection Types
	| 'select'
	| 'multiselect'
	| 'checkbox'
	| 'radio'
	| 'yesno'
	| 'toggle'
	// Financial Types
	| 'money'
	| 'percentage'
	| 'currency'
	// Contact Types
	| 'phone'
	| 'address'
	| 'country'
	| 'state'
	| 'zipcode'
	// File & Media Types
	| 'file'
	| 'image'
	| 'signature'
	| 'audio'
	| 'video'
	// Rating & Scale Types
	| 'rating'
	| 'slider'
	| 'range'
	| 'likert'
	// Specialized Types
	| 'color'
	| 'tags'
	| 'autocomplete'
	| 'location'
	| 'matrix'

export interface FormField {
	id: string
	label: string
	type: FieldType
	required: boolean
	options?: string[] // For select, radio, checkbox, yesno, multiselect
	placeholder?: string
	validation?: {
		min?: number
		max?: number
		pattern?: string
		minLength?: number
		maxLength?: number
		step?: number
	}
	// File upload specific properties
	maxFileSize?: number
	allowedExtensions?: string[]
	// Money/Currency field specific properties
	currency?: string
	currencyCode?: string
	// Address field specific properties
	addressType?: 'full' | 'street' | 'city' | 'state' | 'zip'
	// Rating/Slider specific properties
	ratingMax?: number
	ratingIcons?: string
	sliderMin?: number
	sliderMax?: number
	sliderStep?: number
	// Range specific properties
	rangeMin?: number
	rangeMax?: number
	rangeStep?: number
	// Likert scale properties
	likertScale?: string[]
	likertLabels?: { left: string; right: string }
	// Matrix properties
	matrixRows?: string[]
	matrixColumns?: string[]
	// Autocomplete properties
	autocompleteSource?: string[]
	autocompleteMinLength?: number
	// Tags properties
	tagSuggestions?: string[]
	maxTags?: number
	// Rich text properties
	richTextToolbar?: string[]
	// Location properties
	locationType?: 'coordinates' | 'address' | 'both'
	// Color properties
	colorFormat?: 'hex' | 'rgb' | 'hsl'
	// Date/Time properties
	dateFormat?: string
	timeFormat?: '12h' | '24h'
	// Text area properties
	textareaRows?: number
	textareaMaxLength?: number
	// Toggle properties
	toggleLabels?: { on: string; off: string }
	// Percentage properties
	percentageDecimals?: number
	// URL properties
	urlProtocols?: string[]
}

export interface Form {
	id: string
	userId: string
	title: string
	description?: string
	fields: FormField[]
	createdAt: Date
	updatedAt: Date
}

export interface FormSubmission {
	id: string
	formId: string
	data: Record<string, string | number | boolean | string[]>
	submittedAt: Date
}

export interface AuthContextType {
	user: User | null
	login: (email: string, companyName: string) => Promise<boolean>
	logout: () => void
	isAuthenticated: boolean
}

export interface CreateFormData {
	title: string
	description?: string
	fields: FormField[]
}

export interface CSVFormData {
	title: string
	description?: string
	headers: string[]
}
