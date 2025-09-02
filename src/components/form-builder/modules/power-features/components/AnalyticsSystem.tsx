'use client'

import React, { useState, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { Checkbox } from 'primereact/checkbox'
import { FormField } from '@/types'

interface AnalyticsConfig {
	enabled: boolean
	trackPageViews: boolean
	trackFieldInteractions: boolean
	trackFormSubmissions: boolean
	trackUserBehavior: boolean
	trackPerformance: boolean
	anonymizeData: boolean
	retentionPeriod: number
	exportFormat: 'json' | 'csv' | 'excel'
}

interface AnalyticsSystemProps {
	fields: FormField[]
	onConfigChange: (config: AnalyticsConfig) => void
	className?: string
}

export default function AnalyticsSystem({
	fields,
	onConfigChange,
	className = '',
}: AnalyticsSystemProps) {
	const [config, setConfig] = useState<AnalyticsConfig>({
		enabled: true,
		trackPageViews: true,
		trackFieldInteractions: true,
		trackFormSubmissions: true,
		trackUserBehavior: true,
		trackPerformance: true,
		anonymizeData: false,
		retentionPeriod: 90,
		exportFormat: 'json',
	})

	const [analyticsData, setAnalyticsData] = useState({
		totalViews: 1247,
		totalSubmissions: 89,
		completionRate: 7.1,
		avgTimeToComplete: '4m 32s',
		mostUsedFields: [
			{ field: 'Email', count: 89, percentage: 100 },
			{ field: 'Name', count: 87, percentage: 97.8 },
			{ field: 'Phone', count: 76, percentage: 85.4 },
			{ field: 'Company', count: 65, percentage: 73.0 },
		],
		fieldDropOff: [
			{ field: 'Email', dropOff: 0 },
			{ field: 'Name', dropOff: 2.2 },
			{ field: 'Phone', dropOff: 14.6 },
			{ field: 'Company', dropOff: 27.0 },
		],
		deviceBreakdown: [
			{ device: 'Desktop', count: 45, percentage: 50.6 },
			{ device: 'Mobile', count: 32, percentage: 36.0 },
			{ device: 'Tablet', count: 12, percentage: 13.5 },
		],
		timeOfDay: [
			{ hour: '9 AM', submissions: 12 },
			{ hour: '10 AM', submissions: 18 },
			{ hour: '11 AM', submissions: 15 },
			{ hour: '12 PM', submissions: 8 },
			{ hour: '1 PM', submissions: 6 },
			{ hour: '2 PM', submissions: 14 },
			{ hour: '3 PM', submissions: 16 },
		],
	})

	const handleConfigChange = useCallback(
		(key: keyof AnalyticsConfig, value: unknown) => {
			const newConfig = { ...config, [key]: value }
			setConfig(newConfig)
			onConfigChange(newConfig)
		},
		[config, onConfigChange]
	)

	const handleExportData = useCallback(() => {
		console.log('Exporting analytics data in', config.exportFormat, 'format')
		// In a real implementation, this would export the analytics data
	}, [config.exportFormat])

	const retentionOptions = [
		{ label: '30 days', value: 30 },
		{ label: '90 days', value: 90 },
		{ label: '180 days', value: 180 },
		{ label: '1 year', value: 365 },
		{ label: 'Forever', value: 0 },
	]

	const exportOptions = [
		{ label: 'JSON', value: 'json' },
		{ label: 'CSV', value: 'csv' },
		{ label: 'Excel', value: 'excel' },
	]

	return (
		<Card className={`mb-4 ${className}`}>
			<div className='p-4 border-b border-gray-600'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<i className='pi pi-chart-bar text-purple-400' />
						<h3 className='text-sm font-medium text-white'>
							Analytics & Insights
						</h3>
					</div>
					<Button
						icon='pi pi-download'
						label='Export Data'
						className='p-button-sm'
						onClick={handleExportData}
					/>
				</div>
			</div>

			<div className='p-4 space-y-6'>
				{/* Analytics Configuration */}
				<div className='space-y-4'>
					<h4 className='text-sm font-medium text-gray-300'>
						Analytics Configuration
					</h4>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-xs text-gray-400 mb-1'>
								Data Retention
							</label>
							<Dropdown
								value={config.retentionPeriod}
								options={retentionOptions}
								onChange={e => handleConfigChange('retentionPeriod', e.value)}
								className='w-full'
							/>
						</div>
						<div>
							<label className='block text-xs text-gray-400 mb-1'>
								Export Format
							</label>
							<Dropdown
								value={config.exportFormat}
								options={exportOptions}
								onChange={e => handleConfigChange('exportFormat', e.value)}
								className='w-full'
							/>
						</div>
					</div>

					<div className='space-y-3'>
						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='enabled'
								checked={config.enabled}
								onChange={e => handleConfigChange('enabled', e.checked)}
							/>
							<label htmlFor='enabled' className='text-sm text-gray-300'>
								Enable Analytics
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='trackPageViews'
								checked={config.trackPageViews}
								onChange={e => handleConfigChange('trackPageViews', e.checked)}
							/>
							<label htmlFor='trackPageViews' className='text-sm text-gray-300'>
								Track Page Views
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='trackFieldInteractions'
								checked={config.trackFieldInteractions}
								onChange={e =>
									handleConfigChange('trackFieldInteractions', e.checked)
								}
							/>
							<label
								htmlFor='trackFieldInteractions'
								className='text-sm text-gray-300'
							>
								Track Field Interactions
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='trackFormSubmissions'
								checked={config.trackFormSubmissions}
								onChange={e =>
									handleConfigChange('trackFormSubmissions', e.checked)
								}
							/>
							<label
								htmlFor='trackFormSubmissions'
								className='text-sm text-gray-300'
							>
								Track Form Submissions
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='trackUserBehavior'
								checked={config.trackUserBehavior}
								onChange={e =>
									handleConfigChange('trackUserBehavior', e.checked)
								}
							/>
							<label
								htmlFor='trackUserBehavior'
								className='text-sm text-gray-300'
							>
								Track User Behavior
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='trackPerformance'
								checked={config.trackPerformance}
								onChange={e =>
									handleConfigChange('trackPerformance', e.checked)
								}
							/>
							<label
								htmlFor='trackPerformance'
								className='text-sm text-gray-300'
							>
								Track Performance Metrics
							</label>
						</div>

						<div className='flex items-center gap-2'>
							<Checkbox
								inputId='anonymizeData'
								checked={config.anonymizeData}
								onChange={e => handleConfigChange('anonymizeData', e.checked)}
							/>
							<label htmlFor='anonymizeData' className='text-sm text-gray-300'>
								Anonymize Data
							</label>
						</div>
					</div>
				</div>

				{/* Analytics Overview */}
				<div className='space-y-4'>
					<h4 className='text-sm font-medium text-gray-300'>
						Form Performance
					</h4>

					<div className='grid grid-cols-2 gap-4'>
						<div className='p-3 bg-gray-800/50 rounded border border-gray-600'>
							<div className='text-xs text-gray-400'>Total Views</div>
							<div className='text-lg font-semibold text-white'>
								{analyticsData.totalViews.toLocaleString()}
							</div>
						</div>
						<div className='p-3 bg-gray-800/50 rounded border border-gray-600'>
							<div className='text-xs text-gray-400'>Submissions</div>
							<div className='text-lg font-semibold text-white'>
								{analyticsData.totalSubmissions}
							</div>
						</div>
						<div className='p-3 bg-gray-800/50 rounded border border-gray-600'>
							<div className='text-xs text-gray-400'>Completion Rate</div>
							<div className='text-lg font-semibold text-white'>
								{analyticsData.completionRate}%
							</div>
						</div>
						<div className='p-3 bg-gray-800/50 rounded border border-gray-600'>
							<div className='text-xs text-gray-400'>Avg. Time</div>
							<div className='text-lg font-semibold text-white'>
								{analyticsData.avgTimeToComplete}
							</div>
						</div>
					</div>
				</div>

				{/* Field Usage Analytics */}
				<div className='space-y-4'>
					<h4 className='text-sm font-medium text-gray-300'>Field Usage</h4>

					<div className='space-y-2'>
						{analyticsData.mostUsedFields.map((field, index) => (
							<div
								key={index}
								className='flex items-center justify-between p-2 bg-gray-800/50 rounded'
							>
								<div className='flex items-center gap-2'>
									<span className='text-xs text-gray-400'>#{index + 1}</span>
									<span className='text-sm text-white'>{field.field}</span>
								</div>
								<div className='flex items-center gap-2'>
									<span className='text-xs text-gray-400'>
										{field.count} uses
									</span>
									<span className='text-xs text-purple-400'>
										{field.percentage}%
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Device Breakdown */}
				<div className='space-y-4'>
					<h4 className='text-sm font-medium text-gray-300'>
						Device Breakdown
					</h4>

					<div className='space-y-2'>
						{analyticsData.deviceBreakdown.map((device, index) => (
							<div
								key={index}
								className='flex items-center justify-between p-2 bg-gray-800/50 rounded'
							>
								<div className='flex items-center gap-2'>
									<i
										className={`pi pi-${
											device.device === 'Desktop'
												? 'desktop'
												: device.device === 'Mobile'
												? 'mobile'
												: 'tablet'
										} text-purple-400`}
									/>
									<span className='text-sm text-white'>{device.device}</span>
								</div>
								<div className='flex items-center gap-2'>
									<span className='text-xs text-gray-400'>
										{device.count} submissions
									</span>
									<span className='text-xs text-purple-400'>
										{device.percentage}%
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Time of Day Analytics */}
				<div className='space-y-4'>
					<h4 className='text-sm font-medium text-gray-300'>Peak Hours</h4>

					<div className='grid grid-cols-7 gap-2'>
						{analyticsData.timeOfDay.map((time, index) => (
							<div key={index} className='text-center'>
								<div className='text-xs text-gray-400 mb-1'>{time.hour}</div>
								<div className='text-sm text-white'>{time.submissions}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</Card>
	)
}
