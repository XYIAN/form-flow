/**
 * Create Form Page - Refactored
 *
 * Main page for creating forms with improved component structure
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Message } from 'primereact/message'
import { useAuth } from '@/context/AuthContext'
import { useForms } from '@/context/FormContext'
import { FormField } from '@/types'
// import { FieldMCP, MCPLogger } from '@/lib/mcp' // Available for future use
import Navigation from '@/components/Navigation'
import FormBuilderTabs from '@/components/form-builder/FormBuilderTabs'
import MCPStatusIndicator from '@/components/MCPStatusIndicator'
import MCPErrorDisplay from '@/components/MCPErrorDisplay'
import MCPPerformanceDisplay from '@/components/MCPPerformanceDisplay'
import MCPHealthDashboard from '@/components/MCPHealthDashboard'
import MCPDebugPanel from '@/components/MCPDebugPanel'
import ConsoleLogViewer from '@/components/ConsoleLogViewer'
import MCPStatusBanner from '@/components/MCPStatusBanner'

interface CreateFormProps {
	params: Promise<{
		userid: string
	}>
}

export default function CreateForm({ params }: CreateFormProps) {
	const { user, isAuthenticated } = useAuth()
	const { createForm } = useForms()
	const router = useRouter()
	const [resolvedParams, setResolvedParams] = useState<{
		userid: string
	} | null>(null)
	const hasRedirected = useRef(false)

	// Form data
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [fields, setFields] = useState<FormField[]>([])

	// CSV data
	const [csvTitle, setCsvTitle] = useState('')
	const [csvDescription, setCsvDescription] = useState('')
	const [csvHeaders, setCsvHeaders] = useState<string[]>([])
	const [generatedFields, setGeneratedFields] = useState<FormField[]>([])
	const [csvProcessing, setCsvProcessing] = useState(false)

	// UI state
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	// MCP Status
	const [mcpStatus, setMcpStatus] = useState<
		'idle' | 'running' | 'success' | 'error'
	>('idle')
	const [mcpExecutionTime, setMcpExecutionTime] = useState<number>()
	const [mcpError, setMcpError] = useState<string>('')

	// Resolve params promise
	useEffect(() => {
		params.then(setResolvedParams)
	}, [params])

	// Redirect if not authenticated
	useEffect(() => {
		if (!isAuthenticated && !hasRedirected.current) {
			hasRedirected.current = true
			router.push('/')
		}
	}, [isAuthenticated, router])

	// Field management
	const handleAddField = (field: FormField) => {
		console.log('➕ Form Creation: Adding field to form...')
		console.log('📝 Field details:', field)
		setFields(prev => [...prev, field])
		setError('')
	}

	const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
		console.log('✏️ Form Creation: Updating field...')
		console.log('🆔 Field ID:', fieldId)
		console.log('📝 Updates:', updates)
		setFields(prev =>
			prev.map(f => (f.id === fieldId ? { ...f, ...updates } : f))
		)
		setError('')
	}

	const handleDeleteField = (fieldId: string) => {
		console.log('🗑️ Form Creation: Deleting field...')
		console.log('🆔 Field ID:', fieldId)
		setFields(prev => prev.filter(f => f.id !== fieldId))
	}

	// Form saving
	const handleSaveForm = () => {
		console.log('💾 Form Creation: Starting manual form save...')
		console.log('📝 Form title:', title.trim())
		console.log('📊 Field count:', fields.length)
		console.log('👤 User ID:', user?.id)

		if (!title.trim()) {
			console.error('❌ Validation failed: Form title is required')
			setError('Form title is required')
			return
		}

		if (fields.length === 0) {
			console.error('❌ Validation failed: At least one field is required')
			setError('At least one field is required')
			return
		}

		if (!resolvedParams) {
			console.error('❌ Validation failed: Invalid user session')
			setError('Invalid user session')
			return
		}

		console.log('✅ Validation passed, creating form...')
		setIsLoading(true)

		const formData = {
			title: title.trim(),
			description: description.trim() || undefined,
			fields: fields,
		}

		console.log('📋 Form data to create:', formData)
		const result = createForm(formData, user!.id)

		if (result) {
			console.log('✅ Form created successfully, redirecting...')
			router.push(`/user/${resolvedParams.userid}?created=true`)
		} else {
			console.error('❌ Form creation failed')
			setError('Failed to create form. Please try again.')
		}

		setIsLoading(false)
	}

	const handleCreateFromCsv = () => {
		console.log('💾 Form Creation: Starting CSV form save...')
		console.log('📝 Form title:', csvTitle.trim())
		console.log('📊 Generated field count:', generatedFields.length)
		console.log('👤 User ID:', user?.id)

		if (!csvTitle.trim()) {
			console.error('❌ Validation failed: Form title is required')
			setError('Form title is required')
			return
		}

		if (generatedFields.length === 0) {
			console.error(
				'❌ Validation failed: Please upload and process a CSV file first'
			)
			setError('Please upload and process a CSV file first')
			return
		}

		if (!resolvedParams) {
			console.error('❌ Validation failed: Invalid user session')
			setError('Invalid user session')
			return
		}

		console.log('✅ Validation passed, creating form from CSV...')
		setIsLoading(true)

		const formData = {
			title: csvTitle.trim(),
			description: csvDescription.trim() || undefined,
			fields: generatedFields,
		}

		console.log('📋 CSV form data to create:', formData)
		const result = createForm(formData, user!.id)

		if (result) {
			console.log('✅ CSV form created successfully, redirecting...')
			router.push(`/user/${resolvedParams.userid}?created=true`)
		} else {
			console.error('❌ CSV form creation failed')
			setError('Failed to create form. Please try again.')
		}

		setIsLoading(false)
	}

	// MCP status handlers
	const handleMcpStatusChange = (
		status: 'idle' | 'running' | 'success' | 'error'
	) => {
		console.log('🔧 MCP Status Change:', status)
		setMcpStatus(status)
	}

	const handleMcpExecutionTime = (time: number) => {
		console.log('⏱️ MCP Execution Time:', time, 'ms')
		setMcpExecutionTime(time)
	}

	const handleMcpError = (error: string) => {
		console.error('❌ MCP Error:', error)
		setMcpError(error)
	}

	if (!isAuthenticated || !user || !resolvedParams) {
		return null
	}

	return (
		<div className='form-flow-container'>
			<Navigation userEmail={user.email} companyName={user.companyName} />

			<div className='p-4'>
				<div className='w-full max-w-7xl mx-auto'>
					{/* MCP Status Banner */}
					<MCPStatusBanner className='mb-4' />

					<div className='grid'>
						{/* Main Form Builder */}
						<div className='col-12 lg:col-8'>
							{error && (
								<Message severity='error' text={error} className='mb-4' />
							)}

							<FormBuilderTabs
								// Form data
								title={title}
								setTitle={setTitle}
								description={description}
								setDescription={setDescription}
								fields={fields}
								onAddField={handleAddField}
								onUpdateField={handleUpdateField}
								onDeleteField={handleDeleteField}
								onSaveForm={handleSaveForm}
								isLoading={isLoading}
								// CSV data
								csvTitle={csvTitle}
								setCsvTitle={setCsvTitle}
								csvDescription={csvDescription}
								setCsvDescription={setCsvDescription}
								csvHeaders={csvHeaders}
								setCsvHeaders={setCsvHeaders}
								generatedFields={generatedFields}
								setGeneratedFields={setGeneratedFields}
								csvProcessing={csvProcessing}
								setCsvProcessing={setCsvProcessing}
								onCreateFromCsv={handleCreateFromCsv}
								// Error handling
								onError={setError}
								onMcpStatusChange={handleMcpStatusChange}
								onMcpExecutionTime={handleMcpExecutionTime}
								onMcpError={handleMcpError}
							/>
						</div>

						{/* MCP Status and Performance Panel */}
						<div className='col-12 lg:col-4'>
							<div className='space-y-4'>
								<MCPStatusIndicator
									operation='Field Validation'
									status={mcpStatus}
									executionTime={mcpExecutionTime}
								/>

								<MCPPerformanceDisplay
									operation='Form Generation'
									executionTime={mcpExecutionTime}
									status={mcpStatus}
								/>

								<MCPHealthDashboard
									operations={[
										'Field Validation',
										'Form Generation',
										'CSV Processing',
									]}
									lastChecked={new Date()}
								/>

								{mcpError && (
									<MCPErrorDisplay
										error={mcpError}
										operation='Form Builder'
										onDismiss={() => setMcpError('')}
									/>
								)}

								{/* MCP Debug Panel - Only show in development */}
								{process.env.NODE_ENV === 'development' && <MCPDebugPanel />}

								{/* Console Log Viewer - Only show in development */}
								{process.env.NODE_ENV === 'development' && <ConsoleLogViewer />}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
