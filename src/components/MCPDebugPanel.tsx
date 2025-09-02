/**
 * MCP Debug Panel Component
 *
 * Real-time MCP operations monitoring and debugging interface
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { ScrollPanel } from 'primereact/scrollpanel'
import { ToggleButton } from 'primereact/togglebutton'
import { Divider } from 'primereact/divider'

interface MCPOperation {
	id: string
	operation: string
	status: 'idle' | 'running' | 'success' | 'error'
	startTime?: number
	endTime?: number
	executionTime?: number
	error?: string
	timestamp: Date
	input?: unknown
	output?: unknown
}

export default function MCPDebugPanel() {
	const [operations, setOperations] = useState<MCPOperation[]>([])
	const [isEnabled, setIsEnabled] = useState(true)
	const [autoScroll, setAutoScroll] = useState(true)

	useEffect(() => {
		if (!isEnabled) return

		// Override console methods to capture MCP operations
		const originalLog = console.log
		const originalError = console.error
		const originalWarn = console.warn

		console.log = (...args) => {
			originalLog(...args)
			if (args[0]?.includes?.('MCP:')) {
				handleMCPLog('info', args)
			}
		}

		console.error = (...args) => {
			originalError(...args)
			if (args[0]?.includes?.('MCP')) {
				handleMCPLog('error', args)
			}
		}

		console.warn = (...args) => {
			originalWarn(...args)
			if (args[0]?.includes?.('MCP')) {
				handleMCPLog('warn', args)
			}
		}

		return () => {
			console.log = originalLog
			console.error = originalError
			console.warn = originalWarn
		}
	}, [isEnabled])

	const handleMCPLog = (level: string, args: unknown[]) => {
		const message = args[0] as string
		const operation = extractOperation(message)

		if (operation) {
			const newOperation: MCPOperation = {
				id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
				operation,
				status:
					level === 'error'
						? 'error'
						: level === 'warn'
						? 'running'
						: 'success',
				timestamp: new Date(),
				input: args[1],
				output: args[2],
			}

			setOperations(prev => {
				const updated = [newOperation, ...prev].slice(0, 50) // Keep last 50 operations
				return updated
			})
		}
	}

	const extractOperation = (message: string): string | null => {
		const match = message.match(/MCP:\s*([^✅❌]+)/)
		return match ? match[1].trim() : null
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'success':
				return '✅'
			case 'error':
				return '❌'
			case 'running':
				return '⏳'
			default:
				return '⏸️'
		}
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'success':
				return 'success'
			case 'error':
				return 'danger'
			case 'running':
				return 'warning'
			default:
				return 'info'
		}
	}

	const clearOperations = () => {
		setOperations([])
	}

	const formatTimestamp = (date: Date) => {
		return date.toLocaleTimeString()
	}

	return (
		<Card title='🔧 MCP Debug Panel' className='w-full'>
			<div className='space-y-4'>
				{/* Controls */}
				<div className='flex justify-between items-center'>
					<div className='flex gap-2'>
						<ToggleButton
							checked={isEnabled}
							onChange={e => setIsEnabled(e.value)}
							onLabel='Enabled'
							offLabel='Disabled'
							className='p-button-sm'
						/>
						<ToggleButton
							checked={autoScroll}
							onChange={e => setAutoScroll(e.value)}
							onLabel='Auto Scroll'
							offLabel='Manual'
							className='p-button-sm'
						/>
					</div>
					<Button
						label='Clear'
						icon='pi pi-trash'
						onClick={clearOperations}
						className='p-button-sm p-button-outlined'
					/>
				</div>

				<Divider />

				{/* Operations List */}
				<div className='h-96'>
					<ScrollPanel style={{ height: '100%' }}>
						{operations.length === 0 ? (
							<div className='text-center text-gray-500 py-8'>
								<i className='pi pi-info-circle text-2xl mb-2'></i>
								<p>No MCP operations detected</p>
								<p className='text-sm'>Enable debug mode to see operations</p>
							</div>
						) : (
							<div className='space-y-2'>
								{operations.map(op => (
									<div
										key={op.id}
										className='p-3 bg-gray-800 rounded border-l-4 border-blue-500'
									>
										<div className='flex justify-between items-start'>
											<div className='flex-1'>
												<div className='flex items-center gap-2 mb-1'>
													<span className='text-lg'>
														{getStatusIcon(op.status)}
													</span>
													<span className='font-medium text-white'>
														{op.operation}
													</span>
													<Badge
														value={op.status}
														severity={getStatusColor(op.status)}
														className='text-xs'
													/>
												</div>
												<div className='text-sm text-gray-400'>
													{formatTimestamp(op.timestamp)}
												</div>
												{op.error && (
													<div className='text-sm text-red-400 mt-1'>
														Error: {op.error}
													</div>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</ScrollPanel>
				</div>

				{/* Stats */}
				<div className='grid grid-cols-3 gap-4 text-center'>
					<div className='p-2 bg-gray-800 rounded'>
						<div className='text-lg font-bold text-green-400'>
							{operations.filter(op => op.status === 'success').length}
						</div>
						<div className='text-xs text-gray-400'>Success</div>
					</div>
					<div className='p-2 bg-gray-800 rounded'>
						<div className='text-lg font-bold text-red-400'>
							{operations.filter(op => op.status === 'error').length}
						</div>
						<div className='text-xs text-gray-400'>Errors</div>
					</div>
					<div className='p-2 bg-gray-800 rounded'>
						<div className='text-lg font-bold text-blue-400'>
							{operations.length}
						</div>
						<div className='text-xs text-gray-400'>Total</div>
					</div>
				</div>
			</div>
		</Card>
	)
}
