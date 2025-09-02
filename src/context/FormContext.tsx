'use client'

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react'
import { Form, CreateFormData } from '@/types'
import { FormMCP, MCPLogger } from '@/lib/mcp'

interface FormContextType {
	forms: Form[]
	createForm: (formData: CreateFormData, userId: string) => Form | null
	updateForm: (formId: string, formData: Partial<CreateFormData>) => Form | null
	deleteForm: (formId: string) => boolean
	getFormById: (formId: string) => Form | undefined
	getFormsByUserId: (userId: string) => Form[]
	errors: string[]
	warnings: string[]
}

const FormContext = createContext<FormContextType | undefined>(undefined)

interface FormProviderProps {
	children: ReactNode
}

export function FormProvider({ children }: FormProviderProps) {
	const [forms, setForms] = useState<Form[]>([])
	const [errors, setErrors] = useState<string[]>([])
	const [warnings, setWarnings] = useState<string[]>([])

	// Load forms from localStorage on mount
	useEffect(() => {
		const savedForms = localStorage.getItem('formFlowForms')
		if (savedForms) {
			try {
				const parsedForms = JSON.parse(savedForms).map(
					(form: Form & { createdAt: string; updatedAt: string }) => ({
						...form,
						createdAt: new Date(form.createdAt),
						updatedAt: new Date(form.updatedAt),
					})
				)
				setForms(parsedForms)
			} catch (error) {
				console.error('Error loading forms from localStorage:', error)
				setErrors(['Failed to load saved forms'])
			}
		}
	}, [])

	// Save forms to localStorage whenever forms change
	useEffect(() => {
		try {
			localStorage.setItem('formFlowForms', JSON.stringify(forms))
		} catch (error) {
			console.error('Error saving forms to localStorage:', error)
			setErrors(['Failed to save forms'])
		}
	}, [forms])

	const createForm = (
		formData: CreateFormData,
		userId: string
	): Form | null => {
		// Use MCP to create form with validation
		const result = FormMCP.createForm(formData)

		if (!result.success) {
			// Handle errors
			const errorMessages = result.errors?.map(e => e.message) || [
				'Failed to create form',
			]
			setErrors(errorMessages)
			MCPLogger.error(
				'createForm',
				result.errors?.[0] || new Error('Unknown error')
			)
			return null
		}

		// Add user ID and timestamps
		const newForm: Form = {
			...result.data!,
			userId,
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		setForms(prev => [...prev, newForm])

		// Clear errors on success
		setErrors([])
		if (result.warnings) {
			setWarnings(result.warnings)
		}

		return newForm
	}

	const updateForm = (
		formId: string,
		formData: Partial<CreateFormData>
	): Form | null => {
		const existingForm = forms.find(form => form.id === formId)
		if (!existingForm) {
			setErrors(['Form not found'])
			return null
		}

		// Use MCP to update form with validation
		const result = FormMCP.updateForm(existingForm, formData)

		if (!result.success) {
			// Handle errors
			const errorMessages = result.errors?.map(e => e.message) || [
				'Failed to update form',
			]
			setErrors(errorMessages)
			MCPLogger.error(
				'updateForm',
				result.errors?.[0] || new Error('Unknown error')
			)
			return null
		}

		// Update forms state
		setForms(prev =>
			prev.map(form => (form.id === formId ? result.data! : form))
		)

		// Clear errors on success
		setErrors([])
		if (result.warnings) {
			setWarnings(result.warnings)
		}

		return result.data!
	}

	const deleteForm = (formId: string): boolean => {
		const formExists = forms.some(form => form.id === formId)
		if (!formExists) {
			setErrors(['Form not found'])
			return false
		}

		setForms(prev => prev.filter(form => form.id !== formId))
		setErrors([])
		return true
	}

	const getFormById = (formId: string): Form | undefined => {
		return forms.find(form => form.id === formId)
	}

	const getFormsByUserId = (userId: string): Form[] => {
		return forms.filter(form => form.userId === userId)
	}

	const value: FormContextType = {
		forms,
		createForm,
		updateForm,
		deleteForm,
		getFormById,
		getFormsByUserId,
		errors,
		warnings,
	}

	return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

export function useForms(): FormContextType {
	const context = useContext(FormContext)
	if (context === undefined) {
		throw new Error('useForms must be used within a FormProvider')
	}
	return context
}
