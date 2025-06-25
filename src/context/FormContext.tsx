'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Form, CreateFormData } from '@/types'
import { generateId } from '@/utils'

interface FormContextType {
	forms: Form[]
	createForm: (formData: CreateFormData, userId: string) => Form
	updateForm: (formId: string, formData: Partial<Form>) => void
	deleteForm: (formId: string) => void
	getFormById: (formId: string) => Form | undefined
	getFormsByUserId: (userId: string) => Form[]
}

const FormContext = createContext<FormContextType | undefined>(undefined)

interface FormProviderProps {
	children: ReactNode
}

export function FormProvider({ children }: FormProviderProps) {
	const [forms, setForms] = useState<Form[]>([])

	// Load forms from localStorage on mount
	useEffect(() => {
		const savedForms = localStorage.getItem('formFlowForms')
		if (savedForms) {
			const parsedForms = JSON.parse(savedForms).map((form: Form & { createdAt: string; updatedAt: string }) => ({
				...form,
				createdAt: new Date(form.createdAt),
				updatedAt: new Date(form.updatedAt)
			}))
			setForms(parsedForms)
		}
	}, [])

	// Save forms to localStorage whenever forms change
	useEffect(() => {
		localStorage.setItem('formFlowForms', JSON.stringify(forms))
	}, [forms])

	const createForm = (formData: CreateFormData, userId: string): Form => {
		const newForm: Form = {
			id: generateId(),
			userId,
			title: formData.title,
			description: formData.description,
			fields: formData.fields,
			createdAt: new Date(),
			updatedAt: new Date()
		}

		setForms(prev => [...prev, newForm])
		return newForm
	}

	const updateForm = (formId: string, formData: Partial<Form>) => {
		setForms(prev => prev.map(form => 
			form.id === formId 
				? { ...form, ...formData, updatedAt: new Date() }
				: form
		))
	}

	const deleteForm = (formId: string) => {
		setForms(prev => prev.filter(form => form.id !== formId))
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
		getFormsByUserId
	}

	return (
		<FormContext.Provider value={value}>
			{children}
		</FormContext.Provider>
	)
}

export function useForms(): FormContextType {
	const context = useContext(FormContext)
	if (context === undefined) {
		throw new Error('useForms must be used within a FormProvider')
	}
	return context
} 