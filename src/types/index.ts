export interface User {
	id: string
	email: string
	companyName: string
	createdAt: Date
}

export type FieldType = 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox' | 'radio'

export interface FormField {
	id: string
	label: string
	type: FieldType
	required: boolean
	options?: string[] // For select, radio, checkbox
	placeholder?: string
	validation?: {
		min?: number
		max?: number
		pattern?: string
	}
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