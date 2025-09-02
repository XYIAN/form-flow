'use client'

import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Badge } from 'primereact/badge'
import { MCPLogger } from '@/lib/mcp'

interface MCPStatusIndicatorProps {
	operation: string
	status: 'idle' | 'running' | 'success' | 'error'
	executionTime?: number
	error?: string
	className?: string
}

interface MCPOperation {
	id: string
	operation: string
	status: 'idle' | 'running' | 'success' | 'error'
	startTime?: number
	endTime?: number
	executionTime?: number
	error?: string
}

export default function MCPStatusIndicator({
	operation,
	status,
	executionTime,
	error,
	className = '',
}: MCPStatusIndicatorProps) {
	const [operations, setOperations] = useState<MCPOperation[]>([])
	const [isExpanded, setIsExpanded] = useState(false)

	// Listen for MCP operations
	useEffect(() => {
		const originalConfigure = MCPLogger.configure
		MCPLogger.configure = config => {
			originalConfigure(config)

			// Override the onLog callback to track operations
			if (config.onLog) {
				const originalOnLog = config.onLog
				config.onLog = (level, op, message, data, execTime) => {
					originalOnLog(level, op, message, data, execTime)

					// Track operation status
					const operationId = `${op}-${Date.now()}`

					if (level === 'info' && message.includes('Starting')) {
						setOperations(prev => [
							...prev,
							{
								id: operationId,
								operation: op,
								status: 'running',
								startTime: Date.now(),
							},
						])
					} else if (level === 'info' && message.includes('completed')) {
						setOperations(prev =>
							prev.map(op =>
								op.operation === op.operation && op.status === 'running'
									? {
											...op,
											status: 'success',
											endTime: Date.now(),
											executionTime: execTime,
									  }
									: op
							)
						)
					} else if (level === 'error') {
						setOperations(prev =>
							prev.map(op =>
								op.operation === op.operation && op.status === 'running'
									? {
											...op,
											status: 'error',
											endTime: Date.now(),
											error: message,
									  }
									: op
							)
						)
					}
				}
			}
		}
	}, [])

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'running':
				return 'bg-blue-500'
			case 'success':
				return 'bg-green-500'
			case 'error':
				return 'bg-red-500'
			default:
				return 'bg-gray-500'
		}
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'running':
				return 'pi pi-spin pi-spinner'
			case 'success':
				return 'pi pi-check'
			case 'error':
				return 'pi pi-times'
			default:
				return 'pi pi-circle'
		}
	}

	const formatExecutionTime = (time?: number) => {
		if (!time) return 'N/A'
		return `${time.toFixed(2)}ms`
	}

	const recentOperations = operations.slice(-5) // Show last 5 operations
	const runningOperations = operations.filter(op => op.status === 'running')
	const successCount = operations.filter(op => op.status === 'success').length
	const errorCount = operations.filter(op => op.status === 'error').length

	return (
		<Card className={`mcp-status-indicator ${className}`}>
			<div className='flex justify-between items-center mb-3'>
				<h4 className='text-lg font-semibold text-white'>MCP Status</h4>
				<div className='flex items-center gap-2'>
					{runningOperations.length > 0 && (
						<Badge value={runningOperations.length} severity='info' />
					)}
					<Button
						icon={isExpanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'}
						className='p-button-text p-button-sm'
						onClick={() => setIsExpanded(!isExpanded)}
					/>
				</div>
			</div>

			{/* Current Operation Status */}
			<div className='mb-3'>
				<div className='flex items-center gap-2 mb-2'>
					<span
						className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}
					></span>
					<span className='text-white font-medium'>{operation}</span>
					{status === 'running' && (
						<ProgressSpinner style={{ width: '16px', height: '16px' }} />
					)}
				</div>

				{executionTime && (
					<div className='text-sm text-gray-400'>
						Execution time: {formatExecutionTime(executionTime)}
					</div>
				)}

				{error && (
					<div className='text-sm text-red-400 mt-1'>Error: {error}</div>
				)}
			</div>

			{/* Operation Statistics */}
			<div className='grid grid-cols-3 gap-2 mb-3'>
				<div className='text-center p-2 bg-gray-800 rounded'>
					<div className='text-green-400 font-bold'>{successCount}</div>
					<div className='text-xs text-gray-400'>Success</div>
				</div>
				<div className='text-center p-2 bg-gray-800 rounded'>
					<div className='text-red-400 font-bold'>{errorCount}</div>
					<div className='text-xs text-gray-400'>Errors</div>
				</div>
				<div className='text-center p-2 bg-gray-800 rounded'>
					<div className='text-blue-400 font-bold'>
						{runningOperations.length}
					</div>
					<div className='text-xs text-gray-400'>Running</div>
				</div>
			</div>

			{/* Recent Operations */}
			{isExpanded && (
				<div className='mt-3'>
					<h5 className='text-sm font-medium text-white mb-2'>
						Recent Operations
					</h5>
					<div className='space-y-2 max-h-40 overflow-y-auto'>
						{recentOperations.length === 0 ? (
							<div className='text-sm text-gray-400 text-center py-2'>
								No recent operations
							</div>
						) : (
							recentOperations.map(op => (
								<div
									key={op.id}
									className='flex items-center justify-between p-2 bg-gray-800 rounded'
								>
									<div className='flex items-center gap-2'>
										<i
											className={`pi ${getStatusIcon(op.status)} text-sm ${
												op.status === 'success'
													? 'text-green-400'
													: op.status === 'error'
													? 'text-red-400'
													: op.status === 'running'
													? 'text-blue-400'
													: 'text-gray-400'
											}`}
										></i>
										<span className='text-sm text-white'>{op.operation}</span>
									</div>
									<div className='text-xs text-gray-400'>
										{op.executionTime
											? formatExecutionTime(op.executionTime)
											: 'Running...'}
									</div>
								</div>
							))
						)}
					</div>
				</div>
			)}
		</Card>
	)
}
