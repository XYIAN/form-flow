'use client'

import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'
import { Badge } from 'primereact/badge'
import { MCPLogger } from '@/lib/mcp'

interface MCPPerformanceDisplayProps {
	className?: string
}

interface PerformanceMetric {
	operation: string
	executionTime: number
	timestamp: Date
	success: boolean
}

export default function MCPPerformanceDisplay({
	className = '',
}: MCPPerformanceDisplayProps) {
	const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
	const [isMonitoring, setIsMonitoring] = useState(false)
	const [averageTime, setAverageTime] = useState(0)
	const [maxTime, setMaxTime] = useState(0)
	const [minTime, setMinTime] = useState(0)

	useEffect(() => {
		if (isMonitoring) {
			// Configure MCP Logger to capture performance metrics
			MCPLogger.configure({
				debug: true,
				logLevel: 'debug',
				enablePerformanceTracking: true,
				onLog: (level, operation, message, data, executionTime) => {
					if (
						executionTime &&
						level === 'info' &&
						message.includes('completed')
					) {
						const metric: PerformanceMetric = {
							operation,
							executionTime,
							timestamp: new Date(),
							success: true,
						}

						setMetrics(prev => {
							const newMetrics = [...prev, metric].slice(-50) // Keep last 50 metrics
							updateStatistics(newMetrics)
							return newMetrics
						})
					}
				},
			})
		}
	}, [isMonitoring])

	const updateStatistics = (metricsList: PerformanceMetric[]) => {
		if (metricsList.length === 0) {
			setAverageTime(0)
			setMaxTime(0)
			setMinTime(0)
			return
		}

		const times = metricsList.map(m => m.executionTime)
		const avg = times.reduce((sum, time) => sum + time, 0) / times.length
		const max = Math.max(...times)
		const min = Math.min(...times)

		setAverageTime(avg)
		setMaxTime(max)
		setMinTime(min)
	}

	const getOperationStats = () => {
		const operationCounts: Record<string, number> = {}
		const operationTimes: Record<string, number[]> = {}

		metrics.forEach(metric => {
			operationCounts[metric.operation] =
				(operationCounts[metric.operation] || 0) + 1
			if (!operationTimes[metric.operation]) {
				operationTimes[metric.operation] = []
			}
			operationTimes[metric.operation].push(metric.executionTime)
		})

		return Object.entries(operationCounts)
			.map(([operation, count]) => {
				const times = operationTimes[operation]
				const avgTime =
					times.reduce((sum, time) => sum + time, 0) / times.length
				const maxTime = Math.max(...times)
				const minTime = Math.min(...times)

				return {
					operation,
					count,
					avgTime,
					maxTime,
					minTime,
				}
			})
			.sort((a, b) => b.count - a.count)
	}

	const getPerformanceColor = (time: number) => {
		if (time < 10) return 'text-green-400'
		if (time < 50) return 'text-yellow-400'
		if (time < 100) return 'text-orange-400'
		return 'text-red-400'
	}

	const getPerformanceBarColor = (time: number) => {
		if (time < 10) return '#10B981' // green
		if (time < 50) return '#F59E0B' // yellow
		if (time < 100) return '#F97316' // orange
		return '#EF4444' // red
	}

	return (
		<Card className={`mcp-performance-display ${className}`}>
			<div className='flex justify-between items-center mb-4'>
				<h4 className='text-lg font-semibold text-white'>MCP Performance</h4>
				<div className='flex items-center gap-2'>
					<Badge value={metrics.length} severity='info' />
					<Button
						label={isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
						icon={isMonitoring ? 'pi pi-stop' : 'pi pi-play'}
						className={`p-button-sm ${
							isMonitoring ? 'p-button-danger' : 'p-button-success'
						}`}
						onClick={() => setIsMonitoring(!isMonitoring)}
					/>
				</div>
			</div>

			{/* Overall Statistics */}
			<div className='grid grid-cols-3 gap-3 mb-4'>
				<div className='text-center p-3 bg-gray-800 rounded'>
					<div
						className={`text-lg font-bold ${getPerformanceColor(averageTime)}`}
					>
						{averageTime.toFixed(2)}ms
					</div>
					<div className='text-xs text-gray-400'>Average</div>
				</div>
				<div className='text-center p-3 bg-gray-800 rounded'>
					<div className={`text-lg font-bold ${getPerformanceColor(maxTime)}`}>
						{maxTime.toFixed(2)}ms
					</div>
					<div className='text-xs text-gray-400'>Max</div>
				</div>
				<div className='text-center p-3 bg-gray-800 rounded'>
					<div className={`text-lg font-bold ${getPerformanceColor(minTime)}`}>
						{minTime.toFixed(2)}ms
					</div>
					<div className='text-xs text-gray-400'>Min</div>
				</div>
			</div>

			{/* Performance Chart */}
			{metrics.length > 0 && (
				<div className='mb-4'>
					<h5 className='text-sm font-medium text-white mb-2'>
						Recent Performance
					</h5>
					<div className='h-20 bg-gray-900 rounded p-2 overflow-x-auto'>
						<div className='flex items-end gap-1 h-full'>
							{metrics.slice(-20).map((metric, index) => (
								<div
									key={index}
									className='bg-blue-500 rounded-t'
									style={{
										height: `${Math.min(
											(metric.executionTime / Math.max(maxTime, 1)) * 100,
											100
										)}%`,
										width: '8px',
										minHeight: '2px',
									}}
									title={`${metric.operation}: ${metric.executionTime.toFixed(
										2
									)}ms`}
								/>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Operation Statistics */}
			{getOperationStats().length > 0 && (
				<div>
					<h5 className='text-sm font-medium text-white mb-2'>
						Operation Statistics
					</h5>
					<div className='space-y-2'>
						{getOperationStats().map(stat => (
							<div key={stat.operation} className='p-3 bg-gray-800 rounded'>
								<div className='flex justify-between items-center mb-2'>
									<span className='text-white font-medium'>
										{stat.operation}
									</span>
									<Badge value={stat.count} severity='info' />
								</div>

								<div className='grid grid-cols-3 gap-2 text-xs'>
									<div>
										<span className='text-gray-400'>Avg:</span>
										<span
											className={`ml-1 ${getPerformanceColor(stat.avgTime)}`}
										>
											{stat.avgTime.toFixed(2)}ms
										</span>
									</div>
									<div>
										<span className='text-gray-400'>Max:</span>
										<span
											className={`ml-1 ${getPerformanceColor(stat.maxTime)}`}
										>
											{stat.maxTime.toFixed(2)}ms
										</span>
									</div>
									<div>
										<span className='text-gray-400'>Min:</span>
										<span
											className={`ml-1 ${getPerformanceColor(stat.minTime)}`}
										>
											{stat.minTime.toFixed(2)}ms
										</span>
									</div>
								</div>

								<div className='mt-2'>
									<ProgressBar
										value={(stat.avgTime / Math.max(maxTime, 1)) * 100}
										style={{ height: '4px' }}
										color={getPerformanceBarColor(stat.avgTime)}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Clear Metrics */}
			{metrics.length > 0 && (
				<div className='mt-4 text-center'>
					<Button
						label='Clear Metrics'
						icon='pi pi-trash'
						className='p-button-sm p-button-outlined'
						onClick={() => {
							setMetrics([])
							setAverageTime(0)
							setMaxTime(0)
							setMinTime(0)
						}}
					/>
				</div>
			)}
		</Card>
	)
}
