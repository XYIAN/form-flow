/**
 * MCP Status Banner Component
 *
 * Shows MCP system status and quick access to console utilities
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
// import { Tooltip } from 'primereact/tooltip' // Available for future use

interface MCPStatusBannerProps {
	className?: string
}

export default function MCPStatusBanner({
	className = '',
}: MCPStatusBannerProps) {
	const [mcpStatus, setMcpStatus] = useState<'ready' | 'processing' | 'error'>(
		'ready'
	)
	const [operationCount, setOperationCount] = useState(0)
	const [lastOperation, setLastOperation] = useState<string>('')

	useEffect(() => {
		// Listen for MCP operations
		const originalLog = console.log
		console.log = (...args) => {
			originalLog(...args)
			const message = args[0] as string
			if (message?.includes?.('MCP:')) {
				setOperationCount(prev => prev + 1)
				setLastOperation(message)
				setMcpStatus('processing')

				// Reset to ready after a delay
				setTimeout(() => setMcpStatus('ready'), 1000)
			}
		}

		return () => {
			console.log = originalLog
		}
	}, [])

	const getStatusColor = () => {
		switch (mcpStatus) {
			case 'ready':
				return 'success'
			case 'processing':
				return 'warning'
			case 'error':
				return 'danger'
			default:
				return 'info'
		}
	}

	const getStatusIcon = () => {
		switch (mcpStatus) {
			case 'ready':
				return '✅'
			case 'processing':
				return '⏳'
			case 'error':
				return '❌'
			default:
				return '🔧'
		}
	}

	const openConsole = () => {
		// Focus browser console
		if (typeof window !== 'undefined') {
			// This will work in most browsers
			console.log('🔧 MCP System: Opening browser console for debugging...')
			console.log('💡 Available commands:')
			console.log('  - window.mcp.showStatus()')
			console.log('  - window.mcp.enableDebug()')
			console.log('  - window.mcp.disableDebug()')
		}
	}

	return (
		<Card className={`w-full ${className}`}>
			<div className='flex justify-between items-center'>
				<div className='flex items-center gap-3'>
					<span className='text-2xl'>{getStatusIcon()}</span>
					<div>
						<div className='flex items-center gap-2'>
							<h3 className='text-lg font-semibold text-white m-0'>
								MCP System Status
							</h3>
							<Badge
								value={mcpStatus}
								severity={getStatusColor()}
								className='text-xs'
							/>
						</div>
						<p className='text-sm text-gray-400 m-0'>
							{operationCount} operations completed
							{lastOperation && (
								<span className='ml-2'>
									• Last: {lastOperation.split('MCP:')[1]?.trim() || 'Unknown'}
								</span>
							)}
						</p>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<Button
						label='Console'
						icon='pi pi-terminal'
						onClick={openConsole}
						className='p-button-sm p-button-outlined'
						tooltip='Open browser console for MCP debugging'
					/>
					<Button
						label='Status'
						icon='pi pi-info-circle'
						onClick={() => {
							if (typeof window !== 'undefined' && window.mcp) {
								window.mcp.showStatus()
							}
						}}
						className='p-button-sm p-button-outlined'
						tooltip='Show detailed MCP system status'
					/>
					{process.env.NODE_ENV === 'development' && (
						<Badge value='DEV' severity='info' className='text-xs' />
					)}
				</div>
			</div>
		</Card>
	)
}
