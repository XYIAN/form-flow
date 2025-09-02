'use client'

import React, { useState, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'
import { FileUpload } from 'primereact/fileupload'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Checkbox } from 'primereact/checkbox'
import { FormField } from '@/types'

interface FileUploadFieldProps {
	field: FormField
	onFieldUpdate: (field: FormField) => void
	onFieldRemove: (fieldId: string) => void
	selectedFieldId?: string
	className?: string
}

interface FileUploadConfig {
	maxFileSize: number
	allowedExtensions: string[]
	multiple: boolean
	showPreview: boolean
	showProgress: boolean
	accept: string
}

export default function FileUploadField({
	field,
	onFieldUpdate,
	onFieldRemove,
	selectedFieldId,
	className = '',
}: FileUploadFieldProps) {
	const [uploading, setUploading] = useState(false)
	const [uploadProgress, setUploadProgress] = useState(0)
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

	const config: FileUploadConfig = {
		maxFileSize: field.maxFileSize || 5000000, // 5MB default
		allowedExtensions: field.allowedExtensions || ['.pdf', '.doc', '.docx', '.jpg', '.png'],
		multiple: field.multiple || false,
		showPreview: field.showPreview || true,
		showProgress: field.showProgress || true,
		accept: field.accept || '*/*',
	}

	const handleConfigChange = useCallback((key: keyof FileUploadConfig, value: unknown) => {
		const updatedField = {
			...field,
			[key]: value,
		}
		onFieldUpdate(updatedField)
	}, [field, onFieldUpdate])

	const handleFileUpload = useCallback((event: any) => {
		const files = Array.from(event.files) as File[]
		setUploading(true)
		setUploadProgress(0)

		// Simulate upload progress
		const interval = setInterval(() => {
			setUploadProgress(prev => {
				if (prev >= 100) {
					clearInterval(interval)
					setUploading(false)
					setUploadedFiles(prev => [...prev, ...files])
					return 100
				}
				return prev + 10
			})
		}, 200)
	}, [])

	const handleFileRemove = useCallback((fileToRemove: File) => {
		setUploadedFiles(prev => prev.filter(file => file !== fileToRemove))
	}, [])

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const getFileIcon = (fileName: string) => {
		const extension = fileName.split('.').pop()?.toLowerCase()
		switch (extension) {
			case 'pdf':
				return 'pi pi-file-pdf text-red-500'
			case 'doc':
			case 'docx':
				return 'pi pi-file-word text-blue-500'
			case 'jpg':
			case 'jpeg':
			case 'png':
			case 'gif':
				return 'pi pi-image text-green-500'
			case 'zip':
			case 'rar':
				return 'pi pi-file-archive text-orange-500'
			default:
				return 'pi pi-file text-gray-500'
		}
	}

	return (
		<Card className={`mb-4 ${className}`}>
			<div className='p-4 border-b border-gray-600'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<i className='pi pi-upload text-purple-400' />
						<h3 className='text-sm font-medium text-white'>{field.label}</h3>
						{field.required && <span className='text-red-400 text-xs'>*</span>}
					</div>
					<Button
						icon='pi pi-trash'
						className='p-button-text p-button-sm text-red-400 hover:text-red-300'
						onClick={() => onFieldRemove(field.id)}
						tooltip='Remove Field'
					/>
				</div>
			</div>

			<div className='p-4 space-y-4'>
				{/* File Upload Area */}
				<div className='border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-purple-400 transition-colors'>
					<FileUpload
						mode='basic'
						name='demo[]'
						url='/api/upload'
						accept={config.accept}
						maxFileSize={config.maxFileSize}
						multiple={config.multiple}
						onUpload={handleFileUpload}
						onError={(e) => console.error('Upload error:', e)}
						onSelect={(e) => console.log('Files selected:', e.files)}
						chooseLabel='Choose Files'
						uploadLabel='Upload'
						cancelLabel='Cancel'
						className='file-upload-field'
					/>
					
					<div className='mt-2 text-sm text-gray-400'>
						Max file size: {formatFileSize(config.maxFileSize)}
					</div>
					<div className='text-xs text-gray-500'>
						Allowed: {config.allowedExtensions.join(', ')}
					</div>
				</div>

				{/* Upload Progress */}
				{uploading && config.showProgress && (
					<div className='space-y-2'>
						<div className='flex items-center justify-between text-sm'>
							<span className='text-gray-300'>Uploading...</span>
							<span className='text-gray-400'>{uploadProgress}%</span>
						</div>
						<ProgressBar value={uploadProgress} className='w-full' />
					</div>
				)}

				{/* Uploaded Files Preview */}
				{uploadedFiles.length > 0 && config.showPreview && (
					<div className='space-y-2'>
						<h4 className='text-sm font-medium text-gray-300'>Uploaded Files:</h4>
						<div className='space-y-2'>
							{uploadedFiles.map((file, index) => (
								<div
									key={index}
									className='flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-600'
								>
									<div className='flex items-center gap-2'>
										<i className={getFileIcon(file.name)} />
										<div>
											<div className='text-sm text-white'>{file.name}</div>
											<div className='text-xs text-gray-400'>
												{formatFileSize(file.size)}
											</div>
										</div>
									</div>
									<Button
										icon='pi pi-times'
										className='p-button-text p-button-sm text-red-400 hover:text-red-300'
										onClick={() => handleFileRemove(file)}
										tooltip='Remove File'
									/>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Configuration Options */}
				<div className='space-y-3 pt-4 border-t border-gray-600'>
					<h4 className='text-sm font-medium text-gray-300'>Configuration:</h4>
					
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-xs text-gray-400 mb-1'>
								Max File Size (bytes)
							</label>
							<InputNumber
								value={config.maxFileSize}
								onValueChange={(e) => handleConfigChange('maxFileSize', e.value)}
								min={1000}
								max={100000000}
								suffix=' bytes'
								className='w-full'
							/>
						</div>
						
						<div>
							<label className='block text-xs text-gray-400 mb-1'>
								Accept Types
							</label>
							<InputText
								value={config.accept}
								onChange={(e) => handleConfigChange('accept', e.target.value)}
								placeholder='*/*'
								className='w-full'
							/>
						</div>
					</div>

					<div className='flex items-center gap-4'>
						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='multiple'
								checked={config.multiple}
								onChange={(e) => handleConfigChange('multiple', e.checked)}
							/>
							<label htmlFor='multiple' className='text-sm text-gray-300'>
								Allow Multiple Files
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='showPreview'
								checked={config.showPreview}
								onChange={(e) => handleConfigChange('showPreview', e.checked)}
							/>
							<label htmlFor='showPreview' className='text-sm text-gray-300'>
								Show File Preview
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='showProgress'
								checked={config.showProgress}
								onChange={(e) => handleConfigChange('showProgress', e.checked)}
							/>
							<label htmlFor='showProgress' className='text-sm text-gray-300'>
								Show Upload Progress
							</label>
						</div>
					</div>
				</div>
			</div>
		</Card>
	)
}
