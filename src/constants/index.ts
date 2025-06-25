import { FieldType } from '@/types'

export const FIELD_TYPES: { value: FieldType; label: string }[] = [
	{ value: 'text', label: 'Text Input' },
	{ value: 'email', label: 'Email' },
	{ value: 'number', label: 'Number' },
	{ value: 'money', label: 'Money/Currency' },
	{ value: 'phone', label: 'Phone Number' },
	{ value: 'date', label: 'Date' },
	{ value: 'textarea', label: 'Text Area' },
	{ value: 'address', label: 'Address' },
	{ value: 'select', label: 'Dropdown' },
	{ value: 'yesno', label: 'Yes/No Question' },
	{ value: 'checkbox', label: 'Checkbox' },
	{ value: 'radio', label: 'Radio Button' },
	{ value: 'file', label: 'File Upload' },
	{ value: 'signature', label: 'Signature' }
]

export const VALIDATION_PATTERNS = {
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	phone: /^[\+]?[1-9][\d]{0,15}$/,
	zipCode: /^\d{5}(-\d{4})?$/,
	money: /^\$?[\d,]+(\.\d{2})?$/,
	address: /^[\w\s,.-]+$/,
	file: /\.(pdf|doc|docx|jpg|jpeg|png|txt)$/i
}

export const APP_NAME = 'Form Flow'
export const APP_DESCRIPTION = 'Class Action Lawsuit Form Management Tool'

// Hardcoded users for demo purposes
export const DEMO_USERS = [
	{
		id: '1',
		email: 'admin@lawfirm.com',
		companyName: 'Smith & Associates Law Firm',
		createdAt: new Date('2024-01-01')
	},
	{
		id: '2',
		email: 'manager@classaction.com',
		companyName: 'Class Action Management LLC',
		createdAt: new Date('2024-01-15')
	}
] 