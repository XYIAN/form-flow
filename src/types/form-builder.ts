/**
 * Form Builder Types
 *
 * Types and interfaces for the form builder components
 */

import { FormField, FieldType } from './index'

export interface FormComponent {
	id: string
	name: string
	type: FieldType
	props: {
		placeholder?: string
		required?: boolean
		options?: string[]
		[key: string]: unknown
	}
	category: string
	description?: string
}

export interface FormLayout {
	id: string
	name: string
	type: 'single-column' | 'two-column' | 'three-column' | 'custom'
	description?: string
	sections: FormSection[]
}

export interface FormSection {
	id: string
	type: 'header' | 'fields' | 'footer'
	columns: FormColumn[]
}

export interface FormColumn {
	id: string
	width: number
	fields: FormField[]
}

export interface FormTemplate {
	id: string
	name: string
	category: string
	difficulty: 'beginner' | 'intermediate' | 'advanced'
	description?: string
	fields: FormField[]
	layout?: FormLayout
}

export interface CSVTemplate {
	name: string
	description: string
	headers: string[]
	sampleData: string[][]
	fieldTypes: FieldType[]
	instructions: string
}

export interface FormBuilderState {
	activeTab: 'manual' | 'csv' | 'components' | 'layouts' | 'templates'
	title: string
	description: string
	fields: FormField[]
	selectedComponent: FormComponent | null
	selectedLayout: FormLayout | null
	selectedTemplate: FormTemplate | null
}

export interface FormBuilderActions {
	setActiveTab: (tab: FormBuilderState['activeTab']) => void
	setTitle: (title: string) => void
	setDescription: (description: string) => void
	setFields: (fields: FormField[]) => void
	addField: (field: FormField) => void
	updateField: (fieldId: string, updates: Partial<FormField>) => void
	removeField: (fieldId: string) => void
	selectComponent: (component: FormComponent) => void
	selectLayout: (layout: FormLayout) => void
	selectTemplate: (template: FormTemplate) => void
}
