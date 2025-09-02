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

// Component Library Types
export interface ComponentLibrary {
	id: string
	name: string
	description: string
	version: string
	category: ComponentCategory
	components: FormComponent[]
	createdAt: Date
	updatedAt: Date
}

export type ComponentCategory = 
	| 'basic'
	| 'advanced'
	| 'financial'
	| 'contact'
	| 'media'
	| 'layout'
	| 'custom'

export interface FormComponent {
	id: string
	name: string
	description: string
	category: ComponentCategory
	type: FieldType
	icon: string
	preview: string
	props: ComponentProps
	validation: ComponentValidation
	metadata: ComponentMetadata
}

export interface ComponentProps {
	required: boolean
	placeholder?: string
	options?: string[]
	validation?: ComponentValidation
	style?: ComponentStyle
	behavior?: ComponentBehavior
}

export interface ComponentValidation {
	rules: ValidationRule[]
	messages: ValidationMessages
}

export interface ValidationRule {
	type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'url' | 'number'
	value?: any
	message: string
}

export interface ValidationMessages {
	required: string
	invalid: string
	custom: Record<string, string>
}

export interface ComponentStyle {
	width?: string
	height?: string
	backgroundColor?: string
	borderColor?: string
	textColor?: string
	fontSize?: string
	padding?: string
	margin?: string
}

export interface ComponentBehavior {
	showOn?: string
	hideOn?: string
	enableOn?: string
	disableOn?: string
	clearOn?: string
}

export interface ComponentMetadata {
	author: string
	version: string
	tags: string[]
	documentation: string
	examples: ComponentExample[]
}

export interface ComponentExample {
	title: string
	description: string
	props: Record<string, any>
	code: string
}

// Layout System Types
export interface FormLayout {
	id: string
	name: string
	description: string
	type: LayoutType
	sections: FormSection[]
	metadata: LayoutMetadata
}

export type LayoutType = 
	| 'single-column'
	| 'two-column'
	| 'three-column'
	| 'grid'
	| 'custom'

export interface FormSection {
	id: string
	name: string
	type: SectionType
	columns: FormColumn[]
	style: SectionStyle
	behavior: SectionBehavior
}

export type SectionType = 
	| 'header'
	| 'content'
	| 'footer'
	| 'sidebar'
	| 'custom'

export interface FormColumn {
	id: string
	width: number // 1-12 grid system
	fields: string[] // Field IDs
	style: ColumnStyle
}

export interface SectionStyle {
	backgroundColor?: string
	borderColor?: string
	borderRadius?: string
	padding?: string
	margin?: string
	textAlign?: 'left' | 'center' | 'right'
}

export interface ColumnStyle {
	backgroundColor?: string
	borderColor?: string
	padding?: string
	margin?: string
}

export interface SectionBehavior {
	showOn?: string
	hideOn?: string
	enableOn?: string
	disableOn?: string
}

export interface LayoutMetadata {
	author: string
	version: string
	tags: string[]
	responsive: boolean
	accessibility: boolean
}

// Template Library Types
export interface FormTemplate {
	id: string
	name: string
	description: string
	category: TemplateCategory
	preview: string
	layout: FormLayout
	fields: FormField[]
	metadata: TemplateMetadata
}

export type TemplateCategory = 
	| 'legal'
	| 'medical'
	| 'business'
	| 'education'
	| 'survey'
	| 'contact'
	| 'registration'
	| 'feedback'
	| 'custom'

export interface TemplateMetadata {
	author: string
	version: string
	tags: string[]
	difficulty: 'beginner' | 'intermediate' | 'advanced'
	estimatedTime: number // minutes
	features: string[]
	requirements: string[]
}
