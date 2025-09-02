/**
 * Console Log Viewer Component
 *
 * Displays MCP console logs in the UI for better debugging experience
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { ScrollPanel } from 'primereact/scrollpanel'
import { ToggleButton } from 'primereact/togglebutton'
import { Badge } from 'primereact/badge'
import { Divider } from 'primereact/divider'

interface LogEntry {
	id: string
	timestamp: Date
	level: 'log' | 'info' | 'warn' | 'error' | 'debug'
	message: string
	data?: unknown
}

export default function ConsoleLogViewer() {
	const [logs, setLogs] = useState<LogEntry[]>([])
	const [isEnabled, setIsEnabled] = useState(false)
	const [filter, setFilter] = useState<'all' | 'mcp' | 'error'>('mcp')

	useEffect(() => {
		if (!isEnabled) return

		// Store original console methods
		const originalLog = console.log
		const originalInfo = console.info
		const originalWarn = console.warn
		const originalError = console.error
		const originalDebug = console.debug

		// Override console methods
		const createLogHandler =
			(level: LogEntry['level']) =>
			(...args: unknown[]) => {
				// Call original method
				const originalMethod = {
					log: originalLog,
					info: originalInfo,
					warn: originalWarn,
					error: originalError,
					debug: originalDebug,
				}[level]
				originalMethod(...args)

				// Capture log entry
				const message = args[0] as string
				const data = args.slice(1)

				const logEntry: LogEntry = {
					id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
					timestamp: new Date(),
					level,
					message,
					data: data.length > 0 ? data : undefined,
				}

				setLogs(prev => [logEntry, ...prev].slice(0, 100)) // Keep last 100 logs
			}

		console.log = createLogHandler('log')
		console.info = createLogHandler('info')
		console.warn = createLogHandler('warn')
		console.error = createLogHandler('error')
		console.debug = createLogHandler('debug')

		// Cleanup
		return () => {
			console.log = originalLog
			console.info = originalInfo
			console.warn = originalWarn
			console.error = originalError
			console.debug = originalDebug
		}
	}, [isEnabled])

	const filteredLogs = logs.filter(log => {
		if (filter === 'all') return true
		if (filter === 'error') return log.level === 'error'
		if (filter === 'mcp')
			return log.message.includes('MCP') || log.message.includes('🔧')
		return true
	})

	const getLevelIcon = (level: string) => {
		switch (level) {
			case 'error':
				return '❌'
			case 'warn':
				return '⚠️'
			case 'info':
				return 'ℹ️'
			case 'debug':
				return '🐛'
			default:
				return '📝'
		}
	}

	const getLevelColor = (level: string) => {
		switch (level) {
			case 'error':
				return 'danger'
			case 'warn':
				return 'warning'
			case 'info':
				return 'info'
			case 'debug':
				return 'secondary'
			default:
				return 'info'
		}
	}

	const clearLogs = () => {
		setLogs([])
	}

	const formatTimestamp = (date: Date) => {
		return date.toLocaleTimeString()
	}

	return (
		<Card title='📋 Console Log Viewer' className='w-full'>
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
						<div className='flex gap-1'>
							<Button
								label='All'
								className={`p-button-sm ${
									filter === 'all' ? 'p-button-primary' : 'p-button-outlined'
								}`}
								onClick={() => setFilter('all')}
							/>
							<Button
								label='MCP'
								className={`p-button-sm ${
									filter === 'mcp' ? 'p-button-primary' : 'p-button-outlined'
								}`}
								onClick={() => setFilter('mcp')}
							/>
							<Button
								label='Errors'
								className={`p-button-sm ${
									filter === 'error' ? 'p-button-primary' : 'p-button-outlined'
								}`}
								onClick={() => setFilter('error')}
							/>
						</div>
					</div>
					<Button
						label='Clear'
						icon='pi pi-trash'
						onClick={clearLogs}
						className='p-button-sm p-button-outlined'
					/>
				</div>

				<Divider />

				{/* Logs Display */}
				<div className='h-96'>
					<ScrollPanel style={{ height: '100%' }}>
						{filteredLogs.length === 0 ? (
							<div className='text-center text-gray-500 py-8'>
								<i className='pi pi-info-circle text-2xl mb-2'></i>
								<p>No logs to display</p>
								<p className='text-sm'>Enable logging to see console output</p>
							</div>
						) : (
							<div className='space-y-1'>
								{filteredLogs.map(log => (
									<div
										key={log.id}
										className={`p-2 rounded text-sm ${
											log.level === 'error'
												? 'bg-red-900/20 border-l-4 border-red-500'
												: log.level === 'warn'
												? 'bg-yellow-900/20 border-l-4 border-yellow-500'
												: 'bg-gray-800 border-l-4 border-blue-500'
										}`}
									>
										<div className='flex items-start gap-2'>
											<span className='text-lg flex-shrink-0'>
												{getLevelIcon(log.level)}
											</span>
											<div className='flex-1 min-w-0'>
												<div className='flex items-center gap-2 mb-1'>
													<span className='text-white font-mono text-xs'>
														{formatTimestamp(log.timestamp)}
													</span>
													<Badge
														value={log.level}
														severity={getLevelColor(log.level)}
														className='text-xs'
													/>
												</div>
												<div className='text-white font-mono text-xs break-all'>
													{log.message}
												</div>
												{log.data && (
													<details className='mt-1'>
														<summary className='text-gray-400 text-xs cursor-pointer'>
															Data (
															{Array.isArray(log.data) ? log.data.length : 1}{' '}
															items)
														</summary>
														<pre className='text-xs text-gray-300 mt-1 bg-gray-900 p-2 rounded overflow-auto'>
															{JSON.stringify(log.data, null, 2)}
														</pre>
													</details>
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
				<div className='grid grid-cols-4 gap-2 text-center'>
					<div className='p-2 bg-gray-800 rounded'>
						<div className='text-sm font-bold text-blue-400'>
							{logs.filter(log => log.level === 'log').length}
						</div>
						<div className='text-xs text-gray-400'>Logs</div>
					</div>
					<div className='p-2 bg-gray-800 rounded'>
						<div className='text-sm font-bold text-yellow-400'>
							{logs.filter(log => log.level === 'warn').length}
						</div>
						<div className='text-xs text-gray-400'>Warnings</div>
					</div>
					<div className='p-2 bg-gray-800 rounded'>
						<div className='text-sm font-bold text-red-400'>
							{logs.filter(log => log.level === 'error').length}
						</div>
						<div className='text-xs text-gray-400'>Errors</div>
					</div>
					<div className='p-2 bg-gray-800 rounded'>
						<div className='text-sm font-bold text-green-400'>
							{logs.filter(log => log.message.includes('MCP')).length}
						</div>
						<div className='text-xs text-gray-400'>MCP</div>
					</div>
				</div>
			</div>
		</Card>
	)
}
