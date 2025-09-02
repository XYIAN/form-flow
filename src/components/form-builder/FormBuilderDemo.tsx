'use client'

import React, { useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { FormField } from '@/types'
import FormBuilder from './FormBuilder'

export default function FormBuilderDemo() {
	const [fields, setFields] = useState<FormField[]>([])
	const [showBuilder, setShowBuilder] = useState(false)
	const [message, setMessage] = useState<{
		severity: 'success' | 'info' | 'warn' | 'error'
		text: string
	} | null>(null)

	const handleFieldsChange = (newFields: FormField[]) => {
		setFields(newFields)
		console.log('📝 Fields updated:', newFields.length, 'fields')
	}

	const handleFormSave = (savedFields: FormField[]) => {
		setMessage({
			severity: 'success',
			text: `Form saved with ${savedFields.length} fields!`,
		})
		console.log('💾 Form saved:', savedFields)
	}

	const handleStartBuilding = () => {
		setShowBuilder(true)
		setMessage({
			severity: 'info',
			text: 'Form builder opened! Drag fields from the left palette to start building.',
		})
	}

	const handleReset = () => {
		setFields([])
		setShowBuilder(false)
		setMessage(null)
	}

	if (!showBuilder) {
		return (
			<Card className='max-w-2xl mx-auto'>
				<div className='p-6 text-center'>
					<div className='mb-6'>
						<i className='pi pi-wrench text-6xl text-purple-400 mb-4' />
						<h1 className='text-3xl font-bold text-white mb-2'>
							Advanced Form Builder
						</h1>
						<p className='text-gray-400 text-lg'>
							Create powerful forms with drag-and-drop functionality, 25+ field
							types, and advanced customization options.
						</p>
					</div>

					<div className='grid mb-6'>
						<div className='col-12 md:col-4'>
							<div className='p-4 border border-gray-600 rounded-lg'>
								<i className='pi pi-mouse-pointer text-2xl text-purple-400 mb-2' />
								<h3 className='text-lg font-semibold text-white mb-2'>
									Drag & Drop
								</h3>
								<p className='text-gray-400 text-sm'>
									Intuitive drag-and-drop interface for building forms
								</p>
							</div>
						</div>
						<div className='col-12 md:col-4'>
							<div className='p-4 border border-gray-600 rounded-lg'>
								<i className='pi pi-list text-2xl text-purple-400 mb-2' />
								<h3 className='text-lg font-semibold text-white mb-2'>
									25+ Field Types
								</h3>
								<p className='text-gray-400 text-sm'>
									Comprehensive field library with advanced options
								</p>
							</div>
						</div>
						<div className='col-12 md:col-4'>
							<div className='p-4 border border-gray-600 rounded-lg'>
								<i className='pi pi-cog text-2xl text-purple-400 mb-2' />
								<h3 className='text-lg font-semibold text-white mb-2'>
									Customization
								</h3>
								<p className='text-gray-400 text-sm'>
									Advanced properties panel for field configuration
								</p>
							</div>
						</div>
					</div>

					<div className='flex gap-3 justify-center'>
						<Button
							label='Start Building'
							icon='pi pi-play'
							onClick={handleStartBuilding}
							className='p-button-lg'
						/>
						<Button
							label='Learn More'
							icon='pi pi-info-circle'
							className='p-button-outlined p-button-lg'
							onClick={() =>
								setMessage({
									severity: 'info',
									text: 'This is the Phase 1 implementation of the Advanced Form Builder with drag-and-drop functionality!',
								})
							}
						/>
					</div>

					{message && (
						<div className='mt-4'>
							<Message
								severity={message.severity}
								text={message.text}
								className='w-full'
							/>
						</div>
					)}
				</div>
			</Card>
		)
	}

	return (
		<div className='h-screen flex flex-column'>
			{/* Header */}
			<div className='p-4 border-b border-gray-600 bg-gray-800'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<Button
							icon='pi pi-arrow-left'
							className='p-button-text p-button-sm'
							onClick={() => setShowBuilder(false)}
							tooltip='Back to Demo'
						/>
						<h1 className='text-xl font-semibold text-white'>
							Advanced Form Builder
						</h1>
						<span className='text-sm text-gray-400'>
							{fields.length} fields
						</span>
					</div>
					<div className='flex items-center gap-2'>
						<Button
							label='Reset'
							icon='pi pi-refresh'
							className='p-button-outlined p-button-sm'
							onClick={handleReset}
						/>
						<Button
							label='Save Form'
							icon='pi pi-save'
							className='p-button-sm'
							onClick={() => handleFormSave(fields)}
						/>
					</div>
				</div>
			</div>

			{/* Form Builder */}
			<div className='flex-1 overflow-hidden'>
				<FormBuilder
					initialFields={fields}
					onFieldsChange={handleFieldsChange}
					onFormSave={handleFormSave}
					className='h-full'
				/>
			</div>

			{/* Status Message */}
			{message && (
				<div className='p-4 border-t border-gray-600 bg-gray-800'>
					<Message
						severity={message.severity}
						text={message.text}
						className='w-full'
					/>
				</div>
			)}
		</div>
	)
}
