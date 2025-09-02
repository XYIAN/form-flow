'use client'

import React, { useState, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Checkbox } from 'primereact/checkbox'
import { FormField } from '@/types'

interface Webhook {
	id: string
	name: string
	url: string
	events: string[]
	headers: Record<string, string>
	authentication: 'none' | 'basic' | 'bearer' | 'api-key'
	authConfig: Record<string, string>
	retryAttempts: number
	retryDelay: number
	enabled: boolean
}

interface WebhookSupportProps {
	onWebhooksChange: (webhooks: Webhook[]) => void
	className?: string
}

export default function WebhookSupport({
	onWebhooksChange,
	className = '',
}: WebhookSupportProps) {
	const [webhooks, setWebhooks] = useState<Webhook[]>([])
	const [showAddForm, setShowAddForm] = useState(false)
	const [newWebhook, setNewWebhook] = useState<Partial<Webhook>>({
		name: '',
		url: '',
		events: [],
		headers: {},
		authentication: 'none',
		authConfig: {},
		retryAttempts: 3,
		retryDelay: 1000,
		enabled: true,
	})
	const [testingWebhook, setTestingWebhook] = useState<string | null>(null)

	const eventOptions = [
		{ label: 'Form Submitted', value: 'form.submitted' },
		{ label: 'Form Started', value: 'form.started' },
		{ label: 'Form Abandoned', value: 'form.abandoned' },
		{ label: 'Field Changed', value: 'field.changed' },
		{ label: 'Field Validated', value: 'field.validated' },
		{ label: 'Form Published', value: 'form.published' },
		{ label: 'Form Unpublished', value: 'form.unpublished' },
		{ label: 'Form Deleted', value: 'form.deleted' },
	]

	const authOptions = [
		{ label: 'None', value: 'none' },
		{ label: 'Basic Auth', value: 'basic' },
		{ label: 'Bearer Token', value: 'bearer' },
		{ label: 'API Key', value: 'api-key' },
	]

	const handleAddWebhook = useCallback(() => {
		if (!newWebhook.name || !newWebhook.url || !newWebhook.events?.length)
			return

		const webhook: Webhook = {
			id: `webhook_${Date.now()}`,
			name: newWebhook.name,
			url: newWebhook.url,
			events: newWebhook.events,
			headers: newWebhook.headers || {},
			authentication: newWebhook.authentication || 'none',
			authConfig: newWebhook.authConfig || {},
			retryAttempts: newWebhook.retryAttempts || 3,
			retryDelay: newWebhook.retryDelay || 1000,
			enabled: newWebhook.enabled || true,
		}

		const newWebhooks = [...webhooks, webhook]
		setWebhooks(newWebhooks)
		onWebhooksChange(newWebhooks)
		setNewWebhook({
			name: '',
			url: '',
			events: [],
			headers: {},
			authentication: 'none',
			authConfig: {},
			retryAttempts: 3,
			retryDelay: 1000,
			enabled: true,
		})
		setShowAddForm(false)
	}, [webhooks, newWebhook, onWebhooksChange])

	const handleRemoveWebhook = useCallback(
		(webhookId: string) => {
			const newWebhooks = webhooks.filter(webhook => webhook.id !== webhookId)
			setWebhooks(newWebhooks)
			onWebhooksChange(newWebhooks)
		},
		[webhooks, onWebhooksChange]
	)

	const handleToggleWebhook = useCallback(
		(webhookId: string) => {
			const newWebhooks = webhooks.map(webhook =>
				webhook.id === webhookId
					? { ...webhook, enabled: !webhook.enabled }
					: webhook
			)
			setWebhooks(newWebhooks)
			onWebhooksChange(newWebhooks)
		},
		[webhooks, onWebhooksChange]
	)

	const handleTestWebhook = useCallback(async (webhook: Webhook) => {
		setTestingWebhook(webhook.id)

		try {
			// Simulate webhook test
			await new Promise(resolve => setTimeout(resolve, 2000))
			console.log('Webhook test successful:', webhook.name)
		} catch (error) {
			console.error('Webhook test failed:', error)
		} finally {
			setTestingWebhook(null)
		}
	}, [])

	const handleEventToggle = useCallback(
		(eventValue: string) => {
			const currentEvents = newWebhook.events || []
			const newEvents = currentEvents.includes(eventValue)
				? currentEvents.filter(e => e !== eventValue)
				: [...currentEvents, eventValue]
			setNewWebhook(prev => ({ ...prev, events: newEvents }))
		},
		[newWebhook.events]
	)

	const renderWebhook = (webhook: Webhook) => (
		<div
			key={webhook.id}
			className={`p-4 border rounded-lg ${
				webhook.enabled
					? 'border-gray-600 bg-gray-800/50'
					: 'border-gray-700 bg-gray-800/30 opacity-60'
			}`}
		>
			<div className='flex items-center justify-between mb-3'>
				<div className='flex items-center gap-3'>
					<Checkbox
						inputId={`webhook-${webhook.id}`}
						checked={webhook.enabled}
						onChange={() => handleToggleWebhook(webhook.id)}
					/>
					<div>
						<h4 className='text-sm font-medium text-white'>{webhook.name}</h4>
						<div className='text-xs text-gray-400'>{webhook.url}</div>
					</div>
				</div>
				<div className='flex items-center gap-2'>
					<Button
						icon='pi pi-play'
						className='p-button-text p-button-sm text-green-400 hover:text-green-300'
						loading={testingWebhook === webhook.id}
						onClick={() => handleTestWebhook(webhook)}
						tooltip='Test Webhook'
					/>
					<Button
						icon='pi pi-trash'
						className='p-button-text p-button-sm text-red-400 hover:text-red-300'
						onClick={() => handleRemoveWebhook(webhook.id)}
						tooltip='Remove Webhook'
					/>
				</div>
			</div>

			<div className='space-y-2'>
				<div className='text-xs text-gray-400'>
					<span className='font-medium'>Events:</span>
					<span className='text-white ml-2'>
						{webhook.events
							.map(event => {
								const option = eventOptions.find(opt => opt.value === event)
								return option ? option.label : event
							})
							.join(', ')}
					</span>
				</div>
				<div className='text-xs text-gray-400'>
					<span className='font-medium'>Retry:</span>
					<span className='text-white ml-2'>
						{webhook.retryAttempts} attempts, {webhook.retryDelay}ms delay
					</span>
				</div>
			</div>
		</div>
	)

	return (
		<Card className={`mb-4 ${className}`}>
			<div className='p-4 border-b border-gray-600'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<i className='pi pi-send text-purple-400' />
						<h3 className='text-sm font-medium text-white'>Webhook Support</h3>
					</div>
					<Button
						icon='pi pi-plus'
						label='Add Webhook'
						className='p-button-sm'
						onClick={() => setShowAddForm(true)}
					/>
				</div>
			</div>

			<div className='p-4 space-y-4'>
				{/* Add Webhook Form */}
				{showAddForm && (
					<div className='p-4 border border-gray-600 rounded-lg bg-gray-800/50'>
						<h4 className='text-sm font-medium text-white mb-3'>Add Webhook</h4>

						<div className='grid grid-cols-2 gap-4 mb-4'>
							<div>
								<label className='block text-xs text-gray-400 mb-1'>
									Webhook Name
								</label>
								<InputText
									value={newWebhook.name}
									onChange={e =>
										setNewWebhook(prev => ({ ...prev, name: e.target.value }))
									}
									placeholder='Enter webhook name...'
									className='w-full'
								/>
							</div>
							<div>
								<label className='block text-xs text-gray-400 mb-1'>
									Webhook URL
								</label>
								<InputText
									value={newWebhook.url}
									onChange={e =>
										setNewWebhook(prev => ({ ...prev, url: e.target.value }))
									}
									placeholder='https://your-app.com/webhook'
									className='w-full'
								/>
							</div>
						</div>

						<div className='mb-4'>
							<label className='block text-xs text-gray-400 mb-2'>
								Events to Trigger
							</label>
							<div className='grid grid-cols-2 gap-2'>
								{eventOptions.map(option => (
									<div key={option.value} className='flex items-center gap-2'>
										<Checkbox
											inputId={option.value}
											checked={
												newWebhook.events?.includes(option.value) || false
											}
											onChange={() => handleEventToggle(option.value)}
										/>
										<label
											htmlFor={option.value}
											className='text-xs text-gray-300'
										>
											{option.label}
										</label>
									</div>
								))}
							</div>
						</div>

						<div className='grid grid-cols-2 gap-4 mb-4'>
							<div>
								<label className='block text-xs text-gray-400 mb-1'>
									Authentication
								</label>
								<Dropdown
									value={newWebhook.authentication}
									options={authOptions}
									onChange={e =>
										setNewWebhook(prev => ({
											...prev,
											authentication: e.value,
										}))
									}
									className='w-full'
								/>
							</div>
							<div>
								<label className='block text-xs text-gray-400 mb-1'>
									Retry Attempts
								</label>
								<InputText
									type='number'
									value={newWebhook.retryAttempts}
									onChange={e =>
										setNewWebhook(prev => ({
											...prev,
											retryAttempts: parseInt(e.target.value) || 3,
										}))
									}
									min={0}
									max={10}
									className='w-full'
								/>
							</div>
						</div>

						<div className='mb-4'>
							<label className='block text-xs text-gray-400 mb-1'>
								Custom Headers (JSON)
							</label>
							<InputTextarea
								value={JSON.stringify(newWebhook.headers || {}, null, 2)}
								onChange={e => {
									try {
										const headers = JSON.parse(e.target.value)
										setNewWebhook(prev => ({ ...prev, headers }))
									} catch (error) {
										// Invalid JSON, keep current value
									}
								}}
								placeholder='{"Content-Type": "application/json"}'
								rows={3}
								className='w-full'
							/>
						</div>

						<div className='flex items-center gap-4 mb-4'>
							<div className='flex items-center gap-2'>
								<Checkbox
									inputId='enabled'
									checked={newWebhook.enabled}
									onChange={e =>
										setNewWebhook(prev => ({ ...prev, enabled: e.checked }))
									}
								/>
								<label htmlFor='enabled' className='text-sm text-gray-300'>
									Enable Webhook
								</label>
							</div>
						</div>

						<div className='flex gap-2'>
							<Button
								label='Cancel'
								className='p-button-text p-button-sm'
								onClick={() => setShowAddForm(false)}
							/>
							<Button
								label='Add Webhook'
								className='p-button-sm'
								onClick={handleAddWebhook}
							/>
						</div>
					</div>
				)}

				{/* Webhooks List */}
				{webhooks.length === 0 ? (
					<div className='text-center py-8 text-gray-400'>
						<i className='pi pi-send text-2xl mb-2' />
						<div>No webhooks configured</div>
						<div className='text-sm'>
							Add webhooks to receive real-time notifications
						</div>
					</div>
				) : (
					<div className='space-y-3'>{webhooks.map(renderWebhook)}</div>
				)}
			</div>
		</Card>
	)
}
