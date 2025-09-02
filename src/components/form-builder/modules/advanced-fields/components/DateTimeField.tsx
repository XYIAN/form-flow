'use client'

import React, { useState, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { Dropdown } from 'primereact/dropdown'
import { FormField } from '@/types'

interface DateTimeFieldProps {
	field: FormField
	onFieldUpdate: (field: FormField) => void
	onFieldRemove: (fieldId: string) => void
	selectedFieldId?: string
	className?: string
}

interface DateTimeConfig {
	type: 'date' | 'time' | 'datetime' | 'month' | 'week' | 'year'
	minDate?: Date
	maxDate?: Date
	showTime: boolean
	showSeconds: boolean
	timeOnly: boolean
	dateFormat: string
	timeFormat: string
	placeholder: string
	disabledDays: number[]
	disabledDates: Date[]
	weekStartsOn: number
	locale: string
}

export default function DateTimeField({
	field,
	onFieldUpdate,
	onFieldRemove,
	selectedFieldId,
	className = '',
}: DateTimeFieldProps) {
	const [value, setValue] = useState<Date | Date[] | null>(null)

	const config: DateTimeConfig = {
		type: field.dateType || 'date',
		minDate: field.minDate ? new Date(field.minDate) : undefined,
		maxDate: field.maxDate ? new Date(field.maxDate) : undefined,
		showTime: field.showTime || false,
		showSeconds: field.showSeconds || false,
		timeOnly: field.timeOnly || false,
		dateFormat: field.dateFormat || 'mm/dd/yy',
		timeFormat: field.timeFormat || '12',
		placeholder: field.placeholder || 'Select date...',
		disabledDays: field.disabledDays || [],
		disabledDates: field.disabledDates || [],
		weekStartsOn: field.weekStartsOn || 0,
		locale: field.locale || 'en',
	}

	const handleConfigChange = useCallback((key: keyof DateTimeConfig, value: unknown) => {
		const updatedField = {
			...field,
			[key]: value,
		}
		onFieldUpdate(updatedField)
	}, [field, onFieldUpdate])

	const handleValueChange = useCallback((newValue: Date | Date[] | null) => {
		setValue(newValue)
		const updatedField = {
			...field,
			defaultValue: newValue,
		}
		onFieldUpdate(updatedField)
	}, [field, onFieldUpdate])

	const dateTypeOptions = [
		{ label: 'Date', value: 'date' },
		{ label: 'Time', value: 'time' },
		{ label: 'Date & Time', value: 'datetime' },
		{ label: 'Month', value: 'month' },
		{ label: 'Week', value: 'week' },
		{ label: 'Year', value: 'year' },
	]

	const dateFormatOptions = [
		{ label: 'MM/DD/YYYY', value: 'mm/dd/yy' },
		{ label: 'DD/MM/YYYY', value: 'dd/mm/yy' },
		{ label: 'YYYY-MM-DD', value: 'yy-mm-dd' },
		{ label: 'Month DD, YYYY', value: 'MM dd, yy' },
		{ label: 'DD Month YYYY', value: 'dd MM yy' },
	]

	const timeFormatOptions = [
		{ label: '12 Hour (AM/PM)', value: '12' },
		{ label: '24 Hour', value: '24' },
	]

	const weekStartOptions = [
		{ label: 'Sunday', value: 0 },
		{ label: 'Monday', value: 1 },
		{ label: 'Tuesday', value: 2 },
		{ label: 'Wednesday', value: 3 },
		{ label: 'Thursday', value: 4 },
		{ label: 'Friday', value: 5 },
		{ label: 'Saturday', value: 6 },
	]

	const dayOptions = [
		{ label: 'Sunday', value: 0 },
		{ label: 'Monday', value: 1 },
		{ label: 'Tuesday', value: 2 },
		{ label: 'Wednesday', value: 3 },
		{ label: 'Thursday', value: 4 },
		{ label: 'Friday', value: 5 },
		{ label: 'Saturday', value: 6 },
	]

	const getCalendarProps = () => {
		const props: any = {
			value: value,
			onChange: (e: any) => handleValueChange(e.value),
			placeholder: config.placeholder,
			dateFormat: config.dateFormat,
			showTime: config.showTime,
			showSeconds: config.showSeconds,
			timeOnly: config.timeOnly,
			hourFormat: config.timeFormat,
			weekStartsOn: config.weekStartsOn,
			disabledDays: config.disabledDays,
			disabledDates: config.disabledDates,
			className: 'w-full',
		}

		if (config.minDate) props.minDate = config.minDate
		if (config.maxDate) props.maxDate = config.maxDate

		return props
	}

	return (
		<Card className={`mb-4 ${className}`}>
			<div className='p-4 border-b border-gray-600'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<i className='pi pi-calendar text-purple-400' />
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
				{/* Date/Time Picker */}
				<div className='border border-gray-600 rounded p-3 bg-gray-800'>
					<Calendar {...getCalendarProps()} />
				</div>

				{/* Configuration Options */}
				<div className='space-y-3 pt-4 border-t border-gray-600'>
					<h4 className='text-sm font-medium text-gray-300'>Configuration:</h4>
					
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-xs text-gray-400 mb-1'>
								Date Type
							</label>
							<Dropdown
								value={config.type}
								options={dateTypeOptions}
								onChange={(e) => handleConfigChange('type', e.value)}
								className='w-full'
							/>
						</div>
						
						<div>
							<label className='block text-xs text-gray-400 mb-1'>
								Date Format
							</label>
							<Dropdown
								value={config.dateFormat}
								options={dateFormatOptions}
								onChange={(e) => handleConfigChange('dateFormat', e.value)}
								className='w-full'
							/>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-xs text-gray-400 mb-1'>
								Min Date
							</label>
							<InputText
								type='date'
								value={config.minDate?.toISOString().split('T')[0] || ''}
								onChange={(e) => handleConfigChange('minDate', e.target.value ? new Date(e.target.value) : undefined)}
								className='w-full'
							/>
						</div>
						
						<div>
							<label className='block text-xs text-gray-400 mb-1'>
								Max Date
							</label>
							<InputText
								type='date'
								value={config.maxDate?.toISOString().split('T')[0] || ''}
								onChange={(e) => handleConfigChange('maxDate', e.target.value ? new Date(e.target.value) : undefined)}
								className='w-full'
							/>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-xs text-gray-400 mb-1'>
								Time Format
							</label>
							<Dropdown
								value={config.timeFormat}
								options={timeFormatOptions}
								onChange={(e) => handleConfigChange('timeFormat', e.value)}
								className='w-full'
							/>
						</div>
						
						<div>
							<label className='block text-xs text-gray-400 mb-1'>
								Week Starts On
							</label>
							<Dropdown
								value={config.weekStartsOn}
								options={weekStartOptions}
								onChange={(e) => handleConfigChange('weekStartsOn', e.value)}
								className='w-full'
							/>
						</div>
					</div>

					<div>
						<label className='block text-xs text-gray-400 mb-2'>
							Disabled Days
						</label>
						<div className='grid grid-cols-4 gap-2'>
							{dayOptions.map((day) => (
								<div key={day.value} className='flex items-center gap-2'>
									<Checkbox
										inputId={`day-${day.value}`}
										checked={config.disabledDays.includes(day.value)}
										onChange={(e) => {
											const newDisabledDays = e.checked
												? [...config.disabledDays, day.value]
												: config.disabledDays.filter(d => d !== day.value)
											handleConfigChange('disabledDays', newDisabledDays)
										}}
									/>
									<label htmlFor={`day-${day.value}`} className='text-xs text-gray-300'>
										{day.label}
									</label>
								</div>
							))}
						</div>
					</div>

					<div className='flex items-center gap-4'>
						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='showTime'
								checked={config.showTime}
								onChange={(e) => handleConfigChange('showTime', e.checked)}
							/>
							<label htmlFor='showTime' className='text-sm text-gray-300'>
								Show Time
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='showSeconds'
								checked={config.showSeconds}
								onChange={(e) => handleConfigChange('showSeconds', e.checked)}
							/>
							<label htmlFor='showSeconds' className='text-sm text-gray-300'>
								Show Seconds
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='timeOnly'
								checked={config.timeOnly}
								onChange={(e) => handleConfigChange('timeOnly', e.checked)}
							/>
							<label htmlFor='timeOnly' className='text-sm text-gray-300'>
								Time Only
							</label>
						</div>
					</div>
				</div>
			</div>
		</Card>
	)
}
