/**
 * CSV Upload Tab Component
 * 
 * Handles CSV file upload, processing, and template downloads
 */

import { useState } from 'react'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Button } from 'primereact/button'
import { FileUpload } from 'primereact/fileupload'
import { SplitButton } from 'primereact/splitbutton'
import { Dropdown } from 'primereact/dropdown'
import { FormGeneratorMCP, CSVParserMCP } from '@/lib/mcp'
import { FormField } from '@/types'
import { CSV_TEMPLATES, downloadCSVTemplate } from '@/utils/csv-templates'

interface CSVUploadTabProps {
	csvTitle: string
	setCsvTitle: (title: string) => void
	csvDescription: string
	setCsvDescription: (description: string) => void
	csvHeaders: string[]
	setCsvHeaders: (headers: string[]) => void
	generatedFields: FormField[]
	setGeneratedFields: (fields: FormField[]) => void
	csvProcessing: boolean
	setCsvProcessing: (processing: boolean) => void
	onCreateFromCsv: () => void
	onError: (error: string) => void
	onMcpStatusChange: (status: 'idle' | 'running' | 'success' | 'error') => void
	onMcpExecutionTime: (time: number) => void
	onMcpError: (error: string) => void
}

export default function CSVUploadTab({
	csvTitle,
	setCsvTitle,
	csvDescription,
	setCsvDescription,
	csvHeaders,
	setCsvHeaders,
	generatedFields,
	setGeneratedFields,
	csvProcessing,
	setCsvProcessing,
	onCreateFromCsv,
	onError,
	onMcpStatusChange,
	onMcpExecutionTime,
	onMcpError
}: CSVUploadTabProps) {
	const [csvAnalysis, setCsvAnalysis] = useState<unknown>(null)
	const [selectedTemplate, setSelectedTemplate] = useState<string>('contact')

	const handleCsvUpload = async (event: { files: File[] }) => {
		const file = event.files[0]
		if (!file) return

		setCsvProcessing(true)
		onMcpStatusChange('running')
		onMcpError('')

		try {
			const content = await file.text()

			// Parse CSV using CSVParserMCP
			const parseResult = CSVParserMCP.parseCSV(content)
			if (!parseResult.success || !parseResult.data) {
				onError('Failed to parse CSV file')
				onMcpStatusChange('error')
				onMcpError('Failed to parse CSV file')
				return
			}

			const csvData = parseResult.data
			setCsvHeaders(csvData.headers)

			// Analyze CSV data
			const analysisResult = CSVParserMCP.analyzeCSV(csvData)
			if (analysisResult.success && analysisResult.data) {
				setCsvAnalysis(analysisResult.data)
			}

			// Generate form fields
			const generationResult = FormGeneratorMCP.generateFormFromCSV(content, {
				formTitle: csvTitle || 'Generated Form',
				formDescription: csvDescription || 'Form generated from CSV data',
				includePreview: true
			})

			if (generationResult.success && generationResult.data) {
				setGeneratedFields(generationResult.data.fields)
				onMcpStatusChange('success')
				onMcpExecutionTime(generationResult.metadata?.executionTime || 0)
			} else {
				onError('Failed to generate form from CSV')
				onMcpStatusChange('error')
				onMcpError('Failed to generate form from CSV')
			}
		} catch {
			onError('Error processing CSV file')
			onMcpStatusChange('error')
			onMcpError('Error processing CSV file')
		} finally {
			setCsvProcessing(false)
		}
	}

	const handleDownloadTemplate = () => {
		const template = CSV_TEMPLATES[selectedTemplate]
		if (template) {
			downloadCSVTemplate(template)
		}
	}

	const templateOptions = Object.entries(CSV_TEMPLATES).map(([key, template]) => ({
		label: template.name,
		value: key
	}))

	const uploadButtonItems = [
		{
			label: 'Download Contact Template',
			icon: 'pi pi-download',
			command: () => {
				setSelectedTemplate('contact')
				handleDownloadTemplate()
			}
		},
		{
			label: 'Download Registration Template',
			icon: 'pi pi-download',
			command: () => {
				setSelectedTemplate('registration')
				handleDownloadTemplate()
			}
		},
		{
			label: 'Download Survey Template',
			icon: 'pi pi-download',
			command: () => {
				setSelectedTemplate('survey')
				handleDownloadTemplate()
			}
		},
		{
			label: 'Download Application Template',
			icon: 'pi pi-download',
			command: () => {
				setSelectedTemplate('application')
				handleDownloadTemplate()
			}
		},
		{
			label: 'Download Feedback Template',
			icon: 'pi pi-download',
			command: () => {
				setSelectedTemplate('feedback')
				handleDownloadTemplate()
			}
		}
	]

	return (
		<div className='space-y-4'>
			<Card title='Create Form from CSV' className='w-full'>
				<div className='space-y-4'>
					{/* Template Selection */}
					<div>
						<label className='block text-sm font-medium text-white mb-2'>
							Choose a Template (Optional)
						</label>
						<Dropdown
							value={selectedTemplate}
							options={templateOptions}
							onChange={(e) => setSelectedTemplate(e.value)}
							placeholder='Select a template'
							className='w-full'
						/>
						{selectedTemplate && (
							<div className='mt-2 p-3 bg-gray-800 rounded'>
								<h4 className='text-white font-medium mb-1'>
									{CSV_TEMPLATES[selectedTemplate].name}
								</h4>
								<p className='text-gray-300 text-sm mb-2'>
									{CSV_TEMPLATES[selectedTemplate].description}
								</p>
								<p className='text-gray-400 text-xs'>
									{CSV_TEMPLATES[selectedTemplate].instructions}
								</p>
							</div>
						)}
					</div>

					{/* File Upload with Split Button */}
					<div>
						<label className='block text-sm font-medium text-white mb-2'>
							Upload CSV File
						</label>
						<SplitButton
							label={csvProcessing ? 'Processing CSV...' : 'Upload CSV'}
							icon={csvProcessing ? 'pi pi-spin pi-spinner' : 'pi pi-upload'}
							onClick={() => {
								// This will be handled by the FileUpload component
							}}
							model={uploadButtonItems}
							className='w-full'
							disabled={csvProcessing}
						/>
						<FileUpload
							mode='basic'
							accept='.csv'
							maxFileSize={10000000}
							onUpload={handleCsvUpload}
							chooseLabel='Choose CSV File'
							className='mt-2'
							disabled={csvProcessing}
						/>
					</div>

					{/* Form Details */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-medium text-white mb-2'>
								Form Title
							</label>
							<InputText
								value={csvTitle}
								onChange={(e) => setCsvTitle(e.target.value)}
								placeholder='Enter form title...'
								className='w-full'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium text-white mb-2'>
								Form Description
							</label>
							<InputTextarea
								value={csvDescription}
								onChange={(e) => setCsvDescription(e.target.value)}
								placeholder='Enter form description...'
								rows={3}
								className='w-full'
							/>
						</div>
					</div>

					{/* Detected Fields */}
					{csvHeaders.length > 0 && (
						<div>
							<h4 className='text-lg font-medium text-white mb-2'>
								Detected Fields:
							</h4>
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
								{csvHeaders.map((header, index) => (
									<div key={index} className='p-3 bg-gray-800 rounded'>
										<span className='text-white'>
											{index + 1}. {header}
										</span>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Generated Fields Preview */}
					{generatedFields.length > 0 && (
						<div>
							<h4 className='text-lg font-medium text-white mb-2'>
								Generated Form Fields:
							</h4>
							<div className='space-y-2'>
								{generatedFields.map((field, index) => (
									<div
										key={field.id}
										className='p-3 bg-gray-800 rounded flex justify-between items-center'
									>
										<div>
											<span className='font-medium text-white'>
												{index + 1}. {field.label}
											</span>
											<span className='ml-2 text-sm text-gray-400'>
												({field.type})
											</span>
											{field.required && (
												<span className='ml-2 text-red-400'>*</span>
											)}
										</div>
										<div className='text-sm text-gray-300'>
											{field.placeholder && (
												<span>Placeholder: {field.placeholder}</span>
											)}
											{field.options && field.options.length > 0 && (
												<span className='ml-2'>
													Options: {field.options.length}
												</span>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* CSV Analysis Results */}
					{csvAnalysis && (
						<div>
							<h4 className='text-lg font-medium text-white mb-2'>
								Data Analysis:
							</h4>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='p-3 bg-gray-800 rounded'>
									<div className='text-sm text-gray-300 mb-1'>Data Quality</div>
									<div className='text-white'>
										Completeness:{' '}
										{Math.round(
											(csvAnalysis as { quality: { completeness: number } }).quality.completeness * 100
										)}
										%
									</div>
									<div className='text-white'>
										Consistency:{' '}
										{Math.round(
											(csvAnalysis as { quality: { consistency: number } }).quality.consistency * 100
										)}
										%
									</div>
								</div>
								<div className='p-3 bg-gray-800 rounded'>
									<div className='text-sm text-gray-300 mb-1'>Field Types Detected</div>
									<div className='text-white'>
										{Object.entries(
											(csvAnalysis as { dataTypes: Array<{ detectedType: string }> }).dataTypes.reduce(
												(acc: Record<string, number>, dt: { detectedType: string }) => {
													acc[dt.detectedType] = (acc[dt.detectedType] || 0) + 1
													return acc
												},
												{}
											)
										).map(([type, count]) => (
											<div key={type}>
												{type}: {count as number}
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Create Form Button */}
					<div className='flex justify-end'>
						<Button
							label={csvProcessing ? 'Processing CSV...' : 'Create Form from CSV'}
							icon={csvProcessing ? 'pi pi-spin pi-spinner' : 'pi pi-save'}
							onClick={onCreateFromCsv}
							className='p-button-primary'
							disabled={csvProcessing || generatedFields.length === 0}
						/>
					</div>
				</div>
			</Card>
		</div>
	)
}
