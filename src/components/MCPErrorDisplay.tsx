'use client'

import { useState } from 'react'
import { Card } from 'primereact/card'
import { Message } from 'primereact/message'
import { Badge } from 'primereact/badge'
import { MCPError } from '@/lib/mcp'

interface MCPErrorDisplayProps {
	errors?: MCPError[]
	warnings?: string[]
	className?: string
	showDetails?: boolean
}

export default function MCPErrorDisplay({
	errors = [],
	warnings = [],
	className = '',
	showDetails = true,
}: MCPErrorDisplayProps) {
	const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set())

	const toggleErrorExpansion = (errorId: string) => {
		const newExpanded = new Set(expandedErrors)
		if (newExpanded.has(errorId)) {
			newExpanded.delete(errorId)
		} else {
			newExpanded.add(errorId)
		}
		setExpandedErrors(newExpanded)
	}

	const getErrorIcon = (code: string) => {
		switch (code) {
			case 'VALIDATION_ERROR':
				return 'pi pi-exclamation-triangle'
			case 'FIELD_ERROR':
				return 'pi pi-times-circle'
			case 'FORM_ERROR':
				return 'pi pi-times-circle'
			case 'RENDER_ERROR':
				return 'pi pi-times-circle'
			case 'SUBMISSION_ERROR':
				return 'pi pi-times-circle'
			default:
				return 'pi pi-times-circle'
		}
	}

	const formatTimestamp = (timestamp: Date) => {
		return new Date(timestamp).toLocaleTimeString()
	}

	if (errors.length === 0 && warnings.length === 0) {
		return null
	}

	return (
		<Card className={`mcp-error-display ${className}`}>
			<div className='mb-3'>
				<div className='flex justify-between items-center'>
					<h4 className='text-lg font-semibold text-white'>MCP Status</h4>
					<div className='flex items-center gap-2'>
						{errors.length > 0 && (
							<Badge value={errors.length} severity='danger' />
						)}
						{warnings.length > 0 && (
							<Badge value={warnings.length} severity='warning' />
						)}
					</div>
				</div>
			</div>

			{/* Warnings */}
			{warnings.length > 0 && (
				<div className='mb-4'>
					<h5 className='text-sm font-medium text-yellow-400 mb-2'>
						<i className='pi pi-exclamation-triangle mr-1'></i>
						Warnings ({warnings.length})
					</h5>
					<div className='space-y-2'>
						{warnings.map((warning, index) => (
							<Message
								key={index}
								severity='warn'
								text={warning}
								className='w-full'
							/>
						))}
					</div>
				</div>
			)}

			{/* Errors */}
			{errors.length > 0 && (
				<div>
					<h5 className='text-sm font-medium text-red-400 mb-2'>
						<i className='pi pi-times-circle mr-1'></i>
						Errors ({errors.length})
					</h5>
					<div className='space-y-2'>
						{errors.map((error, index) => {
							const errorId = `error-${index}`
							const isExpanded = expandedErrors.has(errorId)
							const icon = getErrorIcon(error.code)

							return (
								<div key={index} className='border border-red-600 rounded-lg'>
									<div
										className='p-3 cursor-pointer hover:bg-gray-800 transition-colors'
										onClick={() => toggleErrorExpansion(errorId)}
									>
										<div className='flex items-center justify-between'>
											<div className='flex items-center gap-2'>
												<i className={`pi ${icon} text-red-400`}></i>
												<span className='text-red-400 font-medium'>
													{error.code}
												</span>
												{error.field && (
													<Badge value={error.field} severity='info' />
												)}
											</div>
											<div className='flex items-center gap-2'>
												<span className='text-xs text-gray-400'>
													{formatTimestamp(error.timestamp)}
												</span>
												<i
													className={`pi ${
														isExpanded ? 'pi-chevron-up' : 'pi-chevron-down'
													} text-gray-400`}
												></i>
											</div>
										</div>
										<div className='text-white mt-1'>{error.message}</div>
									</div>

									{isExpanded && showDetails && (
										<div className='px-3 pb-3 border-t border-gray-700'>
											{error.details && (
												<div className='mt-3'>
													<h6 className='text-sm font-medium text-gray-300 mb-2'>
														Details:
													</h6>
													<div className='bg-gray-900 p-3 rounded text-sm'>
														{error.details.expected !== undefined && (
															<div className='mb-2'>
																<span className='text-green-400'>
																	Expected:
																</span>
																<pre className='text-gray-300 mt-1'>
																	{JSON.stringify(
																		error.details.expected,
																		null,
																		2
																	)}
																</pre>
															</div>
														)}
														{error.details.actual !== undefined && (
															<div className='mb-2'>
																<span className='text-red-400'>Actual:</span>
																<pre className='text-gray-300 mt-1'>
																	{JSON.stringify(
																		error.details.actual,
																		null,
																		2
																	)}
																</pre>
															</div>
														)}
														{error.details.suggestion && (
															<div className='mb-2'>
																<span className='text-blue-400'>
																	Suggestion:
																</span>
																<div className='text-gray-300 mt-1'>
																	{error.details.suggestion}
																</div>
															</div>
														)}
														{error.details.context !== undefined && (
															<div>
																<span className='text-yellow-400'>
																	Context:
																</span>
																<pre className='text-gray-300 mt-1'>
																	{JSON.stringify(
																		error.details.context,
																		null,
																		2
																	)}
																</pre>
															</div>
														)}
													</div>
												</div>
											)}
										</div>
									)}
								</div>
							)
						})}
					</div>
				</div>
			)}
		</Card>
	)
}
