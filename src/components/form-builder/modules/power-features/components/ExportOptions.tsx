'use client'

import React, { useState, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { Dropdown } from 'primereact/dropdown'
import { FormField } from '@/types'

interface ExportConfig {
	format: 'json' | 'pdf' | 'word' | 'excel' | 'html' | 'xml'
	includeFields: boolean
	includeLayout: boolean
	includeValidation: boolean
	includeDependencies: boolean
	includeAnalytics: boolean
	includeMetadata: boolean
	compressOutput: boolean
	passwordProtected: boolean
	password: string
}

interface ExportOptionsProps {
	fields: FormField[]
	onExport: (config: ExportConfig) => void
	className?: string
}

export default function ExportOptions({
	fields,
	onExport,
	className = '',
}: ExportOptionsProps) {
	const [config, setConfig] = useState<ExportConfig>({
		format: 'json',
		includeFields: true,
		includeLayout: true,
		includeValidation: true,
		includeDependencies: false,
		includeAnalytics: false,
		includeMetadata: true,
		compressOutput: false,
		passwordProtected: false,
		password: '',
	})
	const [exporting, setExporting] = useState(false)

	const formatOptions = [
		{ label: 'JSON', value: 'json', description: 'Structured data format' },
		{ label: 'PDF', value: 'pdf', description: 'Printable document' },
		{ label: 'Word', value: 'word', description: 'Editable document' },
		{ label: 'Excel', value: 'excel', description: 'Spreadsheet format' },
		{ label: 'HTML', value: 'html', description: 'Web page format' },
		{ label: 'XML', value: 'xml', description: 'Markup language' },
	]

	const handleConfigChange = useCallback(
		(key: keyof ExportConfig, value: unknown) => {
			setConfig(prev => ({ ...prev, [key]: value }))
		},
		[]
	)

	const handleExport = useCallback(async () => {
		setExporting(true)

		try {
			// Simulate export process
			await new Promise(resolve => setTimeout(resolve, 2000))
			onExport(config)
			console.log('Export completed:', config)
		} catch (error) {
			console.error('Export failed:', error)
		} finally {
			setExporting(false)
		}
	}, [config, onExport])

	const getExportSize = () => {
		const baseSize = fields.length * 0.5 // KB per field
		let totalSize = baseSize

		if (config.includeLayout) totalSize += 2
		if (config.includeValidation) totalSize += 1
		if (config.includeDependencies) totalSize += 0.5
		if (config.includeAnalytics) totalSize += 5
		if (config.includeMetadata) totalSize += 0.5

		return `${totalSize.toFixed(1)} KB`
	}

	const getFormatDescription = () => {
		const option = formatOptions.find(opt => opt.value === config.format)
		return option ? option.description : ''
	}

	return (
		<Card className={`mb-4 ${className}`}>
			<div className='p-4 border-b border-gray-600'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<i className='pi pi-download text-purple-400' />
						<h3 className='text-sm font-medium text-white'>Export Options</h3>
					</div>
					<div className='flex items-center gap-2'>
						<span className='text-xs text-gray-400'>
							Est. Size: {getExportSize()}
						</span>
					</div>
				</div>
			</div>

			<div className='p-4 space-y-4'>
				{/* Export Format */}
				<div>
					<label className='block text-xs text-gray-400 mb-2'>
						Export Format
					</label>
					<Dropdown
						value={config.format}
						options={formatOptions}
						onChange={e => handleConfigChange('format', e.value)}
						className='w-full'
					/>
					<div className='text-xs text-gray-500 mt-1'>
						{getFormatDescription()}
					</div>
				</div>

				{/* Export Content Options */}
				<div className='space-y-3'>
					<h4 className='text-sm font-medium text-gray-300'>
						Include in Export
					</h4>

					<div className='space-y-2'>
						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='includeFields'
								checked={config.includeFields}
								onChange={e => handleConfigChange('includeFields', e.checked)}
							/>
							<label htmlFor='includeFields' className='text-sm text-gray-300'>
								Form Fields ({fields.length} fields)
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='includeLayout'
								checked={config.includeLayout}
								onChange={e => handleConfigChange('includeLayout', e.checked)}
							/>
							<label htmlFor='includeLayout' className='text-sm text-gray-300'>
								Layout Configuration
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='includeValidation'
								checked={config.includeValidation}
								onChange={e =>
									handleConfigChange('includeValidation', e.checked)
								}
							/>
							<label
								htmlFor='includeValidation'
								className='text-sm text-gray-300'
							>
								Validation Rules
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='includeDependencies'
								checked={config.includeDependencies}
								onChange={e =>
									handleConfigChange('includeDependencies', e.checked)
								}
							/>
							<label
								htmlFor='includeDependencies'
								className='text-sm text-gray-300'
							>
								Field Dependencies
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='includeAnalytics'
								checked={config.includeAnalytics}
								onChange={e =>
									handleConfigChange('includeAnalytics', e.checked)
								}
							/>
							<label
								htmlFor='includeAnalytics'
								className='text-sm text-gray-300'
							>
								Analytics Data
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='includeMetadata'
								checked={config.includeMetadata}
								onChange={e => handleConfigChange('includeMetadata', e.checked)}
							/>
							<label
								htmlFor='includeMetadata'
								className='text-sm text-gray-300'
							>
								Form Metadata
							</label>
						</div>
					</div>
				</div>

				{/* Export Options */}
				<div className='space-y-3'>
					<h4 className='text-sm font-medium text-gray-300'>Export Options</h4>

					<div className='space-y-2'>
						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='compressOutput'
								checked={config.compressOutput}
								onChange={e => handleConfigChange('compressOutput', e.checked)}
							/>
							<label htmlFor='compressOutput' className='text-sm text-gray-300'>
								Compress Output
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='passwordProtected'
								checked={config.passwordProtected}
								onChange={e =>
									handleConfigChange('passwordProtected', e.checked)
								}
							/>
							<label
								htmlFor='passwordProtected'
								className='text-sm text-gray-300'
							>
								Password Protect
							</label>
						</div>
					</div>

					{config.passwordProtected && (
						<div>
							<label className='block text-xs text-gray-400 mb-1'>
								Password
							</label>
							<input
								type='password'
								value={config.password}
								onChange={e => handleConfigChange('password', e.target.value)}
								placeholder='Enter password...'
								className='w-full p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm'
							/>
						</div>
					)}
				</div>

				{/* Export Preview */}
				<div className='space-y-3'>
					<h4 className='text-sm font-medium text-gray-300'>Export Preview</h4>

					<div className='p-3 bg-gray-800/50 rounded border border-gray-600'>
						<div className='text-xs text-gray-400 mb-2'>Export Summary:</div>
						<div className='space-y-1 text-xs text-gray-300'>
							<div>
								Format:{' '}
								{formatOptions.find(opt => opt.value === config.format)?.label}
							</div>
							<div>Fields: {config.includeFields ? fields.length : 0}</div>
							<div>Layout: {config.includeLayout ? 'Yes' : 'No'}</div>
							<div>Validation: {config.includeValidation ? 'Yes' : 'No'}</div>
							<div>
								Dependencies: {config.includeDependencies ? 'Yes' : 'No'}
							</div>
							<div>Analytics: {config.includeAnalytics ? 'Yes' : 'No'}</div>
							<div>Metadata: {config.includeMetadata ? 'Yes' : 'No'}</div>
							<div>Compressed: {config.compressOutput ? 'Yes' : 'No'}</div>
							<div>Protected: {config.passwordProtected ? 'Yes' : 'No'}</div>
						</div>
					</div>
				</div>

				{/* Export Button */}
				<div className='pt-4 border-t border-gray-600'>
					<Button
						label='Export Form'
						icon='pi pi-download'
						className='w-full'
						loading={exporting}
						onClick={handleExport}
					/>
				</div>
			</div>
		</Card>
	)
}
