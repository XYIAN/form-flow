'use client'

import React, { useState, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { InputMask } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { Dropdown } from 'primereact/dropdown'
import { FormField } from '@/types'

interface InputMaskFieldProps {
	field: FormField
	onFieldUpdate: (field: FormField) => void
	onFieldRemove: (fieldId: string) => void
	selectedFieldId?: string
	className?: string
}

interface InputMaskConfig {
	mask: string
	placeholder: string
	unmask: boolean
	showMask: boolean
	slotChar: string
	autoClear: boolean
	clearOnBlur: boolean
	clearIncomplete: boolean
	pattern: string
	validation: boolean
}

export default function InputMaskField({
	field,
	onFieldUpdate,
	onFieldRemove,
	selectedFieldId,
	className = '',
}: InputMaskFieldProps) {
	const [value, setValue] = useState(field.defaultValue || '')

	const config: InputMaskConfig = {
		mask: field.mask || '(999) 999-9999',
		placeholder: field.placeholder || 'Enter value...',
		unmask: field.unmask || false,
		showMask: field.showMask || true,
		slotChar: field.slotChar || '_',
		autoClear: field.autoClear || false,
		clearOnBlur: field.clearOnBlur || false,
		clearIncomplete: field.clearIncomplete || false,
		pattern: field.pattern || '',
		validation: field.validation || false,
	}

	const handleConfigChange = useCallback(
		(key: keyof InputMaskConfig, value: unknown) => {
			const updatedField = {
				...field,
				[key]: value,
			}
			onFieldUpdate(updatedField)
		},
		[field, onFieldUpdate]
	)

	const handleValueChange = useCallback(
		(e: any) => {
			const newValue = e.target.value
			setValue(newValue)
			const updatedField = {
				...field,
				defaultValue: newValue,
			}
			onFieldUpdate(updatedField)
		},
		[field, onFieldUpdate]
	)

	const predefinedMasks = [
		{ label: 'Phone Number', value: '(999) 999-9999' },
		{ label: 'Phone (US)', value: '(999) 999-9999' },
		{ label: 'Phone (International)', value: '+99 999 999 9999' },
		{ label: 'Social Security', value: '999-99-9999' },
		{ label: 'Credit Card', value: '9999 9999 9999 9999' },
		{ label: 'Date (MM/DD/YYYY)', value: '99/99/9999' },
		{ label: 'Date (DD/MM/YYYY)', value: '99/99/9999' },
		{ label: 'Time (HH:MM)', value: '99:99' },
		{ label: 'Time (HH:MM:SS)', value: '99:99:99' },
		{ label: 'ZIP Code (US)', value: '99999' },
		{ label: 'ZIP Code (US+4)', value: '99999-9999' },
		{ label: 'License Plate', value: 'AAA-9999' },
		{ label: 'IP Address', value: '999.999.999.999' },
		{ label: 'MAC Address', value: 'AA:AA:AA:AA:AA:AA' },
		{ label: 'Custom', value: 'custom' },
	]

	const getMaskProps = () => {
		return {
			value: value,
			onChange: handleValueChange,
			mask: config.mask,
			placeholder: config.placeholder,
			unmask: config.unmask,
			showMask: config.showMask,
			slotChar: config.slotChar,
			autoClear: config.autoClear,
			clearOnBlur: config.clearOnBlur,
			clearIncomplete: config.clearIncomplete,
			className: 'w-full',
		}
	}

	const validatePattern = (inputValue: string) => {
		if (!config.pattern || !config.validation) return true
		const regex = new RegExp(config.pattern)
		return regex.test(inputValue)
	}

	const isValid = validatePattern(value)

	return (
		<Card className={`mb-4 ${className}`}>
			<div className='p-4 border-b border-gray-600'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<i className='pi pi-key text-purple-400' />
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
				{/* Input Mask Field */}
				<div className='space-y-2'>
					<InputMask {...getMaskProps()} />
					{config.validation && (
						<div
							className={`text-xs ${
								isValid ? 'text-green-400' : 'text-red-400'
							}`}
						>
							{isValid ? '✓ Valid format' : '✗ Invalid format'}
						</div>
					)}
				</div>

				{/* Configuration Options */}
				<div className='space-y-3 pt-4 border-t border-gray-600'>
					<h4 className='text-sm font-medium text-gray-300'>Configuration:</h4>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-xs text-gray-400 mb-1'>
								Predefined Masks
							</label>
							<Dropdown
								value={config.mask}
								options={predefinedMasks}
								onChange={e => {
									if (e.value !== 'custom') {
										handleConfigChange('mask', e.value)
									}
								}}
								className='w-full'
							/>
						</div>

						<div>
							<label className='block text-xs text-gray-400 mb-1'>
								Custom Mask
							</label>
							<InputText
								value={config.mask}
								onChange={e => handleConfigChange('mask', e.target.value)}
								placeholder='Enter custom mask...'
								className='w-full'
							/>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-xs text-gray-400 mb-1'>
								Placeholder
							</label>
							<InputText
								value={config.placeholder}
								onChange={e =>
									handleConfigChange('placeholder', e.target.value)
								}
								className='w-full'
							/>
						</div>

						<div>
							<label className='block text-xs text-gray-400 mb-1'>
								Slot Character
							</label>
							<InputText
								value={config.slotChar}
								onChange={e => handleConfigChange('slotChar', e.target.value)}
								maxLength={1}
								className='w-full'
							/>
						</div>
					</div>

					<div>
						<label className='block text-xs text-gray-400 mb-1'>
							Validation Pattern (Regex)
						</label>
						<InputText
							value={config.pattern}
							onChange={e => handleConfigChange('pattern', e.target.value)}
							placeholder='^[0-9]+$'
							className='w-full'
						/>
						<div className='text-xs text-gray-500 mt-1'>
							Leave empty to disable pattern validation
						</div>
					</div>

					<div className='flex items-center gap-4'>
						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='unmask'
								checked={config.unmask}
								onChange={e => handleConfigChange('unmask', e.checked)}
							/>
							<label htmlFor='unmask' className='text-sm text-gray-300'>
								Unmask Value
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='showMask'
								checked={config.showMask}
								onChange={e => handleConfigChange('showMask', e.checked)}
							/>
							<label htmlFor='showMask' className='text-sm text-gray-300'>
								Show Mask
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='autoClear'
								checked={config.autoClear}
								onChange={e => handleConfigChange('autoClear', e.checked)}
							/>
							<label htmlFor='autoClear' className='text-sm text-gray-300'>
								Auto Clear
							</label>
						</div>
					</div>

					<div className='flex items-center gap-4'>
						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='clearOnBlur'
								checked={config.clearOnBlur}
								onChange={e => handleConfigChange('clearOnBlur', e.checked)}
							/>
							<label htmlFor='clearOnBlur' className='text-sm text-gray-300'>
								Clear on Blur
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='clearIncomplete'
								checked={config.clearIncomplete}
								onChange={e => handleConfigChange('clearIncomplete', e.checked)}
							/>
							<label
								htmlFor='clearIncomplete'
								className='text-sm text-gray-300'
							>
								Clear Incomplete
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='validation'
								checked={config.validation}
								onChange={e => handleConfigChange('validation', e.checked)}
							/>
							<label htmlFor='validation' className='text-sm text-gray-300'>
								Enable Validation
							</label>
						</div>
					</div>
				</div>

				{/* Mask Help */}
				<div className='pt-4 border-t border-gray-600'>
					<h4 className='text-sm font-medium text-gray-300 mb-2'>
						Mask Characters:
					</h4>
					<div className='grid grid-cols-2 gap-2 text-xs text-gray-400'>
						<div>
							<code className='text-purple-400'>9</code> - Digit (0-9)
						</div>
						<div>
							<code className='text-purple-400'>A</code> - Letter (A-Z, a-z)
						</div>
						<div>
							<code className='text-purple-400'>*</code> - Alphanumeric
						</div>
						<div>
							<code className='text-purple-400'>?</code> - Optional character
						</div>
						<div>
							<code className='text-purple-400'>#</code> - Optional digit
						</div>
						<div>
							<code className='text-purple-400'>~</code> - Optional letter
						</div>
					</div>
				</div>
			</div>
		</Card>
	)
}
