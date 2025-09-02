'use client'

import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { FieldMCP, FormMCP, MCPLogger } from '@/lib/mcp'
import { FormField, FieldType } from '@/types'
import { FIELD_TYPES } from '@/constants'

interface MCPDebugPanelProps {
	className?: string
}

interface MCPLogEntry {
	timestamp: Date
	operation: string
	level: 'info' | 'warn' | 'error' | 'debug'
	message: string
	data?: unknown
	executionTime?: number
}

export default function MCPDebugPanel({ className = '' }: MCPDebugPanelProps) {
	const [isVisible, setIsVisible] = useState(false)
	const [logs, setLogs] = useState<MCPLogEntry[]>([])
	const [testField, setTestField] = useState<FormField>({
		id: 'test-field',
		label: 'Test Field',
		type: 'text',
		required: false,
		placeholder: 'Enter test value',
	})
	const [testValue, setTestValue] = useState('')
	const [selectedFieldType, setSelectedFieldType] = useState<FieldType>('text')

	// Use all available field types from constants
	const fieldTypes = FIELD_TYPES

	// Configure MCP Logger to capture logs
	useEffect(() => {
		MCPLogger.configure({
			debug: true,
			logLevel: 'debug',
			enablePerformanceTracking: true,
			onLog: (level, operation, message, data, executionTime) => {
				setLogs(prev => [
					...prev.slice(-19),
					{
						timestamp: new Date(),
						operation,
						level: level as 'info' | 'warn' | 'error' | 'debug',
						message,
						data,
						executionTime,
					},
				])
			},
		})
	}, [])

	const testFieldValidation = () => {
		const updatedField = { ...testField, type: selectedFieldType }
		setTestField(updatedField)

		MCPLogger.debug(
			'testFieldValidation',
			'Testing field validation',
			updatedField
		)

		const result = FieldMCP.validateField(updatedField)
		if (result.success) {
			MCPLogger.debug('testFieldValidation', 'Field validation passed', result)
		} else {
			MCPLogger.error(
				'testFieldValidation',
				result.errors?.[0] || new Error('Validation failed')
			)
		}
	}

	const testFieldValueValidation = () => {
		MCPLogger.debug(
			'testFieldValueValidation',
			'Testing field value validation',
			{ field: testField, value: testValue }
		)

		const result = FieldMCP.validateFieldValue(testField, testValue)
		if (result.success) {
			MCPLogger.debug(
				'testFieldValueValidation',
				'Field value validation passed',
				result
			)
		} else {
			MCPLogger.error(
				'testFieldValueValidation',
				result.errors?.[0] || new Error('Validation failed')
			)
		}
	}

	const testFieldRendering = () => {
		MCPLogger.debug('testFieldRendering', 'Testing field rendering', testField)

		const result = FieldMCP.render({
			field: testField,
			control: {
				[testField.id]: {
					value: testValue,
					onChange: (value: unknown) => setTestValue(String(value)),
					onBlur: () => {},
				},
			},
			errors: {},
		})

		if (result.success) {
			MCPLogger.debug(
				'testFieldRendering',
				'Field rendering successful',
				result.metadata
			)
		} else {
			MCPLogger.error(
				'testFieldRendering',
				result.errors?.[0] || new Error('Rendering failed')
			)
		}
	}

	const testFormCreation = () => {
		MCPLogger.debug('testFormCreation', 'Testing form creation', {
			title: 'Test Form',
			fields: [testField],
		})

		const result = FormMCP.createForm({
			title: 'Test Form',
			description: 'A test form created from MCP Debug Panel',
			fields: [testField],
		}, 'test-user-id')

		if (result.success) {
			MCPLogger.debug(
				'testFormCreation',
				'Form creation successful',
				result.data
			)
		} else {
			MCPLogger.error(
				'testFormCreation',
				result.errors?.[0] || new Error('Form creation failed')
			)
		}
	}

	const clearLogs = () => {
		setLogs([])
		MCPLogger.debug('clearLogs', 'Debug logs cleared')
	}

	const getLogLevelColor = (level: string) => {
		switch (level) {
			case 'error':
				return 'text-red-400'
			case 'warn':
				return 'text-yellow-400'
			case 'info':
				return 'text-blue-400'
			case 'debug':
				return 'text-gray-400'
			default:
				return 'text-white'
		}
	}

	// If not visible, show a button to open the panel
	if (!isVisible) {
		return (
			<Button
				icon='pi pi-bug'
				label='MCP Debug'
				className={`p-button-outlined p-button-sm ${className}`}
				onClick={() => setIsVisible(true)}
			/>
		)
	}

	return (
		<Card className={`form-flow-card ${className}`}>
			<div className='flex justify-between items-center mb-4'>
				<h3 className='text-xl font-semibold text-white'>MCP Debug Panel</h3>
				<Button
					icon='pi pi-times'
					className='p-button-text p-button-sm'
					onClick={() => setIsVisible(false)}
				/>
			</div>

			<div className='grid'>
				<div className='col-12 md:col-6'>
					<h4 className='text-lg font-medium text-white mb-3'>Field Testing</h4>

					<div className='field mb-3'>
						<label className='block text-sm font-medium text-gray-300 mb-2'>
							Field Type
						</label>
						<Dropdown
							value={selectedFieldType}
							options={fieldTypes}
							onChange={e => setSelectedFieldType(e.value)}
							optionLabel='label'
							optionValue='value'
							className='w-full'
						/>
					</div>

					<div className='field mb-3'>
						<label className='block text-sm font-medium text-gray-300 mb-2'>
							Test Value
						</label>
						<InputText
							value={testValue}
							onChange={e => setTestValue(e.target.value)}
							placeholder='Enter test value'
							className='w-full'
						/>
					</div>

					<div className='flex flex-wrap gap-2 mb-4'>
						<Button
							label='Test Field Validation'
							icon='pi pi-check'
							className='p-button-sm p-button-outlined'
							onClick={testFieldValidation}
						/>
						<Button
							label='Test Value Validation'
							icon='pi pi-check-circle'
							className='p-button-sm p-button-outlined'
							onClick={testFieldValueValidation}
						/>
						<Button
							label='Test Rendering'
							icon='pi pi-eye'
							className='p-button-sm p-button-outlined'
							onClick={testFieldRendering}
						/>
						<Button
							label='Test Form Creation'
							icon='pi pi-plus'
							className='p-button-sm p-button-outlined'
							onClick={testFormCreation}
						/>
					</div>
				</div>

				<div className='col-12 md:col-6'>
					<div className='flex justify-between items-center mb-3'>
						<h4 className='text-lg font-medium text-white'>MCP Logs</h4>
						<Button
							label='Clear'
							icon='pi pi-trash'
							className='p-button-sm p-button-outlined p-button-danger'
							onClick={clearLogs}
						/>
					</div>

					<div className='bg-gray-900 rounded p-3 h-64 overflow-y-auto'>
						{logs.length === 0 ? (
							<p className='text-gray-400 text-sm'>
								No MCP operations logged yet...
							</p>
						) : (
							logs.map((log, index) => (
								<div key={index} className='mb-2 text-xs'>
									<div className='flex items-center gap-2'>
										<span className='text-gray-500'>
											{log.timestamp.toLocaleTimeString()}
										</span>
										<span
											className={`font-medium ${getLogLevelColor(log.level)}`}
										>
											[{log.level.toUpperCase()}]
										</span>
										<span className='text-blue-300'>{log.operation}</span>
									</div>
									<div className='text-gray-300 ml-4'>{log.message}</div>
									{log.executionTime && (
										<div className='text-gray-500 ml-4'>
											⏱️ {log.executionTime.toFixed(2)}ms
										</div>
									)}
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</Card>
	)
}
