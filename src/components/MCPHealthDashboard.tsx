'use client'

import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { ProgressBar } from 'primereact/progressbar'
import { MCPLogger } from '@/lib/mcp'

interface MCPHealthDashboardProps {
	className?: string
}

interface HealthMetric {
	operation: string
	successCount: number
	errorCount: number
	totalCount: number
	averageTime: number
	lastExecution: Date
}

export default function MCPHealthDashboard({ className = '' }: MCPHealthDashboardProps) {
	const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([])
	const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy')
	const [totalOperations, setTotalOperations] = useState(0)
	const [successRate, setSuccessRate] = useState(100)
	const [averageResponseTime, setAverageResponseTime] = useState(0)
	const [isMonitoring, setIsMonitoring] = useState(false)

	useEffect(() => {
		if (isMonitoring) {
			// Configure MCP Logger to capture health metrics
			MCPLogger.configure({
				debug: true,
				logLevel: 'debug',
				enablePerformanceTracking: true,
				onLog: (level, operation, message, data, executionTime) => {
					if (level === 'info' && executionTime) {
						updateHealthMetrics(operation, executionTime, true)
					} else if (level === 'error') {
						updateHealthMetrics(operation, 0, false)
					}
				},
			})
		}
	}, [isMonitoring])

	const updateHealthMetrics = (operation: string, executionTime: number, success: boolean) => {
		setHealthMetrics(prev => {
			const existing = prev.find(m => m.operation === operation)
			if (existing) {
				const updated = {
					...existing,
					successCount: success ? existing.successCount + 1 : existing.successCount,
					errorCount: success ? existing.errorCount : existing.errorCount + 1,
					totalCount: existing.totalCount + 1,
					averageTime: (existing.averageTime * existing.totalCount + executionTime) / (existing.totalCount + 1),
					lastExecution: new Date(),
				}
				return prev.map(m => m.operation === operation ? updated : m)
			} else {
				return [...prev, {
					operation,
					successCount: success ? 1 : 0,
					errorCount: success ? 0 : 1,
					totalCount: 1,
					averageTime: executionTime,
					lastExecution: new Date(),
				}]
			}
		})
	}

	useEffect(() => {
		// Calculate overall system health
		const totalOps = healthMetrics.reduce((sum, m) => sum + m.totalCount, 0)
		const totalSuccess = healthMetrics.reduce((sum, m) => sum + m.successCount, 0)
		const avgTime = healthMetrics.length > 0 
			? healthMetrics.reduce((sum, m) => sum + m.averageTime, 0) / healthMetrics.length 
			: 0

		setTotalOperations(totalOps)
		setSuccessRate(totalOps > 0 ? (totalSuccess / totalOps) * 100 : 100)
		setAverageResponseTime(avgTime)

		// Determine system status
		if (totalOps === 0) {
			setSystemStatus('healthy')
		} else if (successRate >= 95 && avgTime < 100) {
			setSystemStatus('healthy')
		} else if (successRate >= 80 && avgTime < 500) {
			setSystemStatus('warning')
		} else {
			setSystemStatus('critical')
		}
	}, [healthMetrics, successRate])

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'healthy': return 'text-green-400'
			case 'warning': return 'text-yellow-400'
			case 'critical': return 'text-red-400'
			default: return 'text-gray-400'
		}
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'healthy': return 'pi pi-check-circle'
			case 'warning': return 'pi pi-exclamation-triangle'
			case 'critical': return 'pi pi-times-circle'
			default: return 'pi pi-question-circle'
		}
	}

	const getSuccessRateColor = (rate: number) => {
		if (rate >= 95) return '#10B981' // green
		if (rate >= 80) return '#F59E0B' // yellow
		return '#EF4444' // red
	}

	const getResponseTimeColor = (time: number) => {
		if (time < 50) return '#10B981' // green
		if (time < 200) return '#F59E0B' // yellow
		return '#EF4444' // red
	}

	return (
		<Card className={`mcp-health-dashboard ${className}`}>
			<div className="flex justify-between items-center mb-4">
				<h4 className="text-lg font-semibold text-white">MCP Health Dashboard</h4>
				<div className="flex items-center gap-2">
					<i className={`pi ${getStatusIcon(systemStatus)} ${getStatusColor(systemStatus)}`}></i>
					<span className={`font-medium ${getStatusColor(systemStatus)}`}>
						{systemStatus.toUpperCase()}
					</span>
					<Button
						label={isMonitoring ? 'Stop' : 'Start'}
						icon={isMonitoring ? 'pi pi-stop' : 'pi pi-play'}
						className={`p-button-sm ${isMonitoring ? 'p-button-danger' : 'p-button-success'}`}
						onClick={() => setIsMonitoring(!isMonitoring)}
					/>
				</div>
			</div>

			{/* System Overview */}
			<div className="grid grid-cols-2 gap-3 mb-4">
				<div className="text-center p-3 bg-gray-800 rounded">
					<div className="text-2xl font-bold text-white">{totalOperations}</div>
					<div className="text-xs text-gray-400">Total Operations</div>
				</div>
				<div className="text-center p-3 bg-gray-800 rounded">
					<div className="text-2xl font-bold text-white">{successRate.toFixed(1)}%</div>
					<div className="text-xs text-gray-400">Success Rate</div>
				</div>
			</div>

			{/* Success Rate Progress */}
			<div className="mb-4">
				<div className="flex justify-between items-center mb-2">
					<span className="text-sm text-gray-300">Success Rate</span>
					<span className="text-sm text-white">{successRate.toFixed(1)}%</span>
				</div>
				<ProgressBar
					value={successRate}
					style={{ height: '8px' }}
					color={getSuccessRateColor(successRate)}
				/>
			</div>

			{/* Average Response Time */}
			<div className="mb-4">
				<div className="flex justify-between items-center mb-2">
					<span className="text-sm text-gray-300">Avg Response Time</span>
					<span className="text-sm text-white">{averageResponseTime.toFixed(2)}ms</span>
				</div>
				<ProgressBar
					value={Math.min((averageResponseTime / 500) * 100, 100)}
					style={{ height: '8px' }}
					color={getResponseTimeColor(averageResponseTime)}
				/>
			</div>

			{/* Operation Health Details */}
			{healthMetrics.length > 0 && (
				<div>
					<h5 className="text-sm font-medium text-white mb-2">Operation Health</h5>
					<div className="space-y-2 max-h-60 overflow-y-auto">
						{healthMetrics.map((metric) => {
							const operationSuccessRate = (metric.successCount / metric.totalCount) * 100
							return (
								<div key={metric.operation} className="p-3 bg-gray-800 rounded">
									<div className="flex justify-between items-center mb-2">
										<span className="text-white font-medium">{metric.operation}</span>
										<div className="flex items-center gap-2">
											<Badge value={metric.totalCount} severity="info" />
											<span className={`text-xs ${
												operationSuccessRate >= 95 ? 'text-green-400' :
												operationSuccessRate >= 80 ? 'text-yellow-400' : 'text-red-400'
											}`}>
												{operationSuccessRate.toFixed(1)}%
											</span>
										</div>
									</div>
									
									<div className="grid grid-cols-3 gap-2 text-xs mb-2">
										<div>
											<span className="text-gray-400">Success:</span>
											<span className="text-green-400 ml-1">{metric.successCount}</span>
										</div>
										<div>
											<span className="text-gray-400">Errors:</span>
											<span className="text-red-400 ml-1">{metric.errorCount}</span>
										</div>
										<div>
											<span className="text-gray-400">Avg Time:</span>
											<span className="text-blue-400 ml-1">{metric.averageTime.toFixed(2)}ms</span>
										</div>
									</div>

									<ProgressBar
										value={operationSuccessRate}
										style={{ height: '4px' }}
										color={getSuccessRateColor(operationSuccessRate)}
									/>
								</div>
							)
						})}
					</div>
				</div>
			)}

			{/* Health Recommendations */}
			{systemStatus !== 'healthy' && (
				<div className="mt-4 p-3 bg-gray-800 rounded">
					<h6 className="text-sm font-medium text-white mb-2">Recommendations</h6>
					<div className="text-xs text-gray-300 space-y-1">
						{systemStatus === 'warning' && (
							<>
								<div>• Monitor error rates closely</div>
								<div>• Consider optimizing slow operations</div>
							</>
						)}
						{systemStatus === 'critical' && (
							<>
								<div>• Investigate high error rates immediately</div>
								<div>• Check system resources and performance</div>
								<div>• Review recent code changes</div>
							</>
						)}
					</div>
				</div>
			)}

			{/* Clear Metrics */}
			{healthMetrics.length > 0 && (
				<div className="mt-4 text-center">
					<Button
						label="Clear Metrics"
						icon="pi pi-trash"
						className="p-button-sm p-button-outlined"
						onClick={() => {
							setHealthMetrics([])
							setTotalOperations(0)
							setSuccessRate(100)
							setAverageResponseTime(0)
							setSystemStatus('healthy')
						}}
					/>
				</div>
			)}
		</Card>
	)
}
