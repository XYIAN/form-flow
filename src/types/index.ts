export interface User {
	id: string
	email: string
	companyName: string
	createdAt: Date
}

export type FieldType = 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'money' | 'phone' | 'address' | 'yesno' | 'file' | 'signature'

export interface FormField {
	id: string
	label: string
	type: FieldType
	required: boolean
	options?: string[] // For select, radio, checkbox, yesno
	placeholder?: string
	validation?: {
		min?: number
		max?: number
		pattern?: string
	}
	// File upload specific properties
	maxFileSize?: number
	allowedExtensions?: string[]
	// Money field specific properties
	currency?: string
	// Address field specific properties
	addressType?: 'full' | 'street' | 'city' | 'state' | 'zip'
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