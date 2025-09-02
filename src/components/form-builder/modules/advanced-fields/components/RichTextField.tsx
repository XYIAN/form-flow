'use client'

import React, { useState, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { Dropdown } from 'primereact/dropdown'
import { FormField } from '@/types'

interface RichTextFieldProps {
	field: FormField
	onFieldUpdate: (field: FormField) => void
	onFieldRemove: (fieldId: string) => void
	selectedFieldId?: string
	className?: string
}

interface RichTextConfig {
	toolbar: string[]
	height: number
	placeholder: string
	allowHtml: boolean
	allowMarkdown: boolean
	wordCount: boolean
	characterCount: boolean
}

export default function RichTextField({
	field,
	onFieldUpdate,
	onFieldRemove,
	selectedFieldId,
	className = '',
}: RichTextFieldProps) {
	const [content, setContent] = useState(field.defaultValue || '')
	const [isEditing, setIsEditing] = useState(false)

	const config: RichTextConfig = {
		toolbar: field.toolbar || [
			'bold',
			'italic',
			'underline',
			'link',
			'list',
			'quote',
		],
		height: field.height || 200,
		placeholder: field.placeholder || 'Enter your text here...',
		allowHtml: field.allowHtml || true,
		allowMarkdown: field.allowMarkdown || false,
		wordCount: field.wordCount || false,
		characterCount: field.characterCount || false,
	}

	const handleConfigChange = useCallback(
		(key: keyof RichTextConfig, value: unknown) => {
			const updatedField = {
				...field,
				[key]: value,
			}
			onFieldUpdate(updatedField)
		},
		[field, onFieldUpdate]
	)

	const handleContentChange = useCallback(
		(newContent: string) => {
			setContent(newContent)
			const updatedField = {
				...field,
				defaultValue: newContent,
			}
			onFieldUpdate(updatedField)
		},
		[field, onFieldUpdate]
	)

	const toolbarOptions = [
		{ label: 'Bold', value: 'bold' },
		{ label: 'Italic', value: 'italic' },
		{ label: 'Underline', value: 'underline' },
		{ label: 'Strikethrough', value: 'strikethrough' },
		{ label: 'Link', value: 'link' },
		{ label: 'Image', value: 'image' },
		{ label: 'List', value: 'list' },
		{ label: 'Numbered List', value: 'orderedList' },
		{ label: 'Quote', value: 'quote' },
		{ label: 'Code', value: 'code' },
		{ label: 'Table', value: 'table' },
		{ label: 'Undo', value: 'undo' },
		{ label: 'Redo', value: 'redo' },
	]

	const getWordCount = (text: string) => {
		return text
			.trim()
			.split(/\s+/)
			.filter(word => word.length > 0).length
	}

	const getCharacterCount = (text: string) => {
		return text.length
	}

	const renderToolbar = () => {
		return (
			<div className='flex items-center gap-1 p-2 border-b border-gray-600 bg-gray-800'>
				{config.toolbar.map(tool => {
					const option = toolbarOptions.find(opt => opt.value === tool)
					if (!option) return null

					return (
						<Button
							key={tool}
							icon={`pi pi-${
								tool === 'bold'
									? 'bold'
									: tool === 'italic'
									? 'italic'
									: tool === 'underline'
									? 'underline'
									: tool === 'link'
									? 'link'
									: tool === 'list'
									? 'list'
									: tool === 'quote'
									? 'quote'
									: 'cog'
							}`}
							className='p-button-text p-button-sm text-gray-400 hover:text-white'
							tooltip={option.label}
							onClick={() => {
								// In a real implementation, this would apply formatting
								console.log(`Apply ${tool} formatting`)
							}}
						/>
					)
				})}
			</div>
		)
	}

	const renderEditor = () => {
		if (isEditing) {
			return (
				<div className='border border-gray-600 rounded'>
					{renderToolbar()}
					<textarea
						value={content}
						onChange={e => handleContentChange(e.target.value)}
						placeholder={config.placeholder}
						className='w-full p-3 bg-gray-800 text-white border-0 resize-none focus:outline-none'
						style={{ height: `${config.height}px` }}
					/>
					{/* Word/Character Count */}
					{(config.wordCount || config.characterCount) && (
						<div className='flex items-center justify-between p-2 border-t border-gray-600 bg-gray-800/50 text-xs text-gray-400'>
							<div className='flex items-center gap-4'>
								{config.wordCount && (
									<span>Words: {getWordCount(content)}</span>
								)}
								{config.characterCount && (
									<span>Characters: {getCharacterCount(content)}</span>
								)}
							</div>
							<Button
								label='Done'
								className='p-button-sm'
								onClick={() => setIsEditing(false)}
							/>
						</div>
					)}
				</div>
			)
		} else {
			return (
				<div
					className='p-3 border border-gray-600 rounded bg-gray-800 cursor-pointer hover:border-gray-500 transition-colors'
					style={{ height: `${config.height}px` }}
					onClick={() => setIsEditing(true)}
				>
					{content ? (
						<div
							className='text-white'
							dangerouslySetInnerHTML={{ __html: content }}
						/>
					) : (
						<div className='text-gray-500 italic'>{config.placeholder}</div>
					)}
				</div>
			)
		}
	}

	return (
		<Card className={`mb-4 ${className}`}>
			<div className='p-4 border-b border-gray-600'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<i className='pi pi-file-edit text-purple-400' />
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
				{/* Rich Text Editor */}
				{renderEditor()}

				{/* Configuration Options */}
				<div className='space-y-3 pt-4 border-t border-gray-600'>
					<h4 className='text-sm font-medium text-gray-300'>Configuration:</h4>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-xs text-gray-400 mb-1'>
								Editor Height (px)
							</label>
							<InputText
								type='number'
								value={config.height}
								onChange={e =>
									handleConfigChange('height', parseInt(e.target.value) || 200)
								}
								className='w-full'
							/>
						</div>

						<div>
							<label className='block text-xs text-gray-400 mb-1'>
								Placeholder Text
							</label>
							<InputText
								value={config.placeholder}
								onChange={e =>
									handleConfigChange('placeholder', e.target.value)
								}
								className='w-full'
							/>
						</div>
					</div>

					<div>
						<label className='block text-xs text-gray-400 mb-2'>
							Toolbar Options
						</label>
						<div className='grid grid-cols-3 gap-2'>
							{toolbarOptions.map(option => (
								<div key={option.value} className='flex items-center gap-2'>
									<Checkbox
										inputId={option.value}
										checked={config.toolbar.includes(option.value)}
										onChange={e => {
											const newToolbar = e.checked
												? [...config.toolbar, option.value]
												: config.toolbar.filter(tool => tool !== option.value)
											handleConfigChange('toolbar', newToolbar)
										}}
									/>
									<label
										htmlFor={option.value}
										className='text-xs text-gray-300'
									>
										{option.label}
									</label>
								</div>
							))}
						</div>
					</div>

					<div className='flex items-center gap-4'>
						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='allowHtml'
								checked={config.allowHtml}
								onChange={e => handleConfigChange('allowHtml', e.checked)}
							/>
							<label htmlFor='allowHtml' className='text-sm text-gray-300'>
								Allow HTML
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='allowMarkdown'
								checked={config.allowMarkdown}
								onChange={e => handleConfigChange('allowMarkdown', e.checked)}
							/>
							<label htmlFor='allowMarkdown' className='text-sm text-gray-300'>
								Allow Markdown
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='wordCount'
								checked={config.wordCount}
								onChange={e => handleConfigChange('wordCount', e.checked)}
							/>
							<label htmlFor='wordCount' className='text-sm text-gray-300'>
								Show Word Count
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='characterCount'
								checked={config.characterCount}
								onChange={e => handleConfigChange('characterCount', e.checked)}
							/>
							<label htmlFor='characterCount' className='text-sm text-gray-300'>
								Show Character Count
							</label>
						</div>
					</div>
				</div>
			</div>
		</Card>
	)
}
