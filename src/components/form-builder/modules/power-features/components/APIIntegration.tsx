'use client'

import React, { useState, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Checkbox } from 'primereact/checkbox'
import { FormField } from '@/types'

interface APIConnection {
	id: string
	name: string
	url: string
	method: 'GET' | 'POST' | 'PUT' | 'DELETE'
	headers: Record<string, string>
	body: string
	authentication: 'none' | 'basic' | 'bearer' | 'api-key'
	authConfig: Record<string, string>
	fieldMapping: Record<string, string>
	enabled: boolean
}

interface APIIntegrationProps {
	fields: FormField[]
	onConnectionsChange: (connections: APIConnection[]) => void
	className?: string
}

export default function APIIntegration({
	fields,
	onConnectionsChange,
	className = '',
}: APIIntegrationProps) {
	const [connections, setConnections] = useState<APIConnection[]>([])
	const [showAddForm, setShowAddForm] = useState(false)
	const [newConnection, setNewConnection] = useState<Partial<APIConnection>>({
		name: '',
		url: '',
		method: 'GET',
		headers: {},
		body: '',
		authentication: 'none',
		authConfig: {},
		fieldMapping: {},
		enabled: true,
	})
	const [testingConnection, setTestingConnection] = useState<string | null>(
		null
	)

	const methodOptions = [
		{ label: 'GET', value: 'GET' },
		{ label: 'POST', value: 'POST' },
		{ label: 'PUT', value: 'PUT' },
		{ label: 'DELETE', value: 'DELETE' },
	]

	const authOptions = [
		{ label: 'None', value: 'none' },
		{ label: 'Basic Auth', value: 'basic' },
		{ label: 'Bearer Token', value: 'bearer' },
		{ label: 'API Key', value: 'api-key' },
	]

	const fieldOptions = fields.map(field => ({
		label: field.label,
		value: field.id,
	}))

	const handleAddConnection = useCallback(() => {
		if (!newConnection.name || !newConnection.url) return

		const connection: APIConnection = {
			id: `api_${Date.now()}`,
			name: newConnection.name,
			url: newConnection.url,
			method: newConnection.method || 'GET',
			headers: newConnection.headers || {},
			body: newConnection.body || '',
			authentication: newConnection.authentication || 'none',
			authConfig: newConnection.authConfig || {},
			fieldMapping: newConnection.fieldMapping || {},
			enabled: newConnection.enabled || true,
		}

		const newConnections = [...connections, connection]
		setConnections(newConnections)
		onConnectionsChange(newConnections)
		setNewConnection({
			name: '',
			url: '',
			method: 'GET',
			headers: {},
			body: '',
			authentication: 'none',
			authConfig: {},
			fieldMapping: {},
			enabled: true,
		})
		setShowAddForm(false)
	}, [connections, newConnection, onConnectionsChange])

	const handleRemoveConnection = useCallback(
		(connectionId: string) => {
			const newConnections = connections.filter(
				conn => conn.id !== connectionId
			)
			setConnections(newConnections)
			onConnectionsChange(newConnections)
		},
		[connections, onConnectionsChange]
	)

	const handleToggleConnection = useCallback(
		(connectionId: string) => {
			const newConnections = connections.map(conn =>
				conn.id === connectionId ? { ...conn, enabled: !conn.enabled } : conn
			)
			setConnections(newConnections)
			onConnectionsChange(newConnections)
		},
		[connections, onConnectionsChange]
	)

	const handleTestConnection = useCallback(
		async (connection: APIConnection) => {
			setTestingConnection(connection.id)

			try {
				// Simulate API test
				await new Promise(resolve => setTimeout(resolve, 2000))
				console.log('API connection test successful:', connection.name)
			} catch (error) {
				console.error('API connection test failed:', error)
			} finally {
				setTestingConnection(null)
			}
		},
		[]
	)

	const renderConnection = (connection: APIConnection) => (
		<div
			key={connection.id}
			className={`p-4 border rounded-lg ${
				connection.enabled
					? 'border-gray-600 bg-gray-800/50'
					: 'border-gray-700 bg-gray-800/30 opacity-60'
			}`}
		>
			<div className='flex items-center justify-between mb-3'>
				<div className='flex items-center gap-3'>
					<Checkbox
						inputId={`conn-${connection.id}`}
						checked={connection.enabled}
						onChange={() => handleToggleConnection(connection.id)}
					/>
					<div>
						<h4 className='text-sm font-medium text-white'>
							{connection.name}
						</h4>
						<div className='text-xs text-gray-400'>
							{connection.method} {connection.url}
						</div>
					</div>
				</div>
				<div className='flex items-center gap-2'>
					<Button
						icon='pi pi-play'
						className='p-button-text p-button-sm text-green-400 hover:text-green-300'
						loading={testingConnection === connection.id}
						onClick={() => handleTestConnection(connection)}
						tooltip='Test Connection'
					/>
					<Button
						icon='pi pi-trash'
						className='p-button-text p-button-sm text-red-400 hover:text-red-300'
						onClick={() => handleRemoveConnection(connection.id)}
						tooltip='Remove Connection'
					/>
				</div>
			</div>

			<div className='grid grid-cols-2 gap-4 text-xs'>
				<div>
					<span className='text-gray-400'>Authentication:</span>
					<span className='text-white ml-2'>{connection.authentication}</span>
				</div>
				<div>
					<span className='text-gray-400'>Field Mappings:</span>
					<span className='text-white ml-2'>
						{Object.keys(connection.fieldMapping).length}
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
						<i className='pi pi-cloud text-purple-400' />
						<h3 className='text-sm font-medium text-white'>API Integration</h3>
					</div>
					<Button
						icon='pi pi-plus'
						label='Add Connection'
						className='p-button-sm'
						onClick={() => setShowAddForm(true)}
					/>
				</div>
			</div>

			<div className='p-4 space-y-4'>
				{/* Add Connection Form */}
				{showAddForm && (
					<div className='p-4 border border-gray-600 rounded-lg bg-gray-800/50'>
						<h4 className='text-sm font-medium text-white mb-3'>
							Add API Connection
						</h4>

						<div className='grid grid-cols-2 gap-4 mb-4'>
							<div>
								<label className='block text-xs text-gray-400 mb-1'>
									Connection Name
								</label>
								<InputText
									value={newConnection.name}
									onChange={e =>
										setNewConnection(prev => ({
											...prev,
											name: e.target.value,
										}))
									}
									placeholder='Enter connection name...'
									className='w-full'
								/>
							</div>
							<div>
								<label className='block text-xs text-gray-400 mb-1'>
									API URL
								</label>
								<InputText
									value={newConnection.url}
									onChange={e =>
										setNewConnection(prev => ({ ...prev, url: e.target.value }))
									}
									placeholder='https://api.example.com/endpoint'
									className='w-full'
								/>
							</div>
						</div>

						<div className='grid grid-cols-2 gap-4 mb-4'>
							<div>
								<label className='block text-xs text-gray-400 mb-1'>
									HTTP Method
								</label>
								<Dropdown
									value={newConnection.method}
									options={methodOptions}
									onChange={e =>
										setNewConnection(prev => ({ ...prev, method: e.value }))
									}
									className='w-full'
								/>
							</div>
							<div>
								<label className='block text-xs text-gray-400 mb-1'>
									Authentication
								</label>
								<Dropdown
									value={newConnection.authentication}
									options={authOptions}
									onChange={e =>
										setNewConnection(prev => ({
											...prev,
											authentication: e.value,
										}))
									}
									className='w-full'
								/>
							</div>
						</div>

						{newConnection.method === 'POST' ||
						newConnection.method === 'PUT' ? (
							<div className='mb-4'>
								<label className='block text-xs text-gray-400 mb-1'>
									Request Body (JSON)
								</label>
								<InputTextarea
									value={newConnection.body}
									onChange={e =>
										setNewConnection(prev => ({
											...prev,
											body: e.target.value,
										}))
									}
									placeholder='{"key": "value"}'
									rows={3}
									className='w-full'
								/>
							</div>
						) : null}

						<div className='flex items-center gap-4 mb-4'>
							<div className='flex items-center gap-2'>
								<Checkbox
									inputId='enabled'
									checked={newConnection.enabled}
									onChange={e =>
										setNewConnection(prev => ({ ...prev, enabled: e.checked }))
									}
								/>
								<label htmlFor='enabled' className='text-sm text-gray-300'>
									Enable Connection
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
								label='Add Connection'
								className='p-button-sm'
								onClick={handleAddConnection}
							/>
						</div>
					</div>
				)}

				{/* Connections List */}
				{connections.length === 0 ? (
					<div className='text-center py-8 text-gray-400'>
						<i className='pi pi-cloud text-2xl mb-2' />
						<div>No API connections</div>
						<div className='text-sm'>
							Add API connections to integrate with external services
						</div>
					</div>
				) : (
					<div className='space-y-3'>{connections.map(renderConnection)}</div>
				)}
			</div>
		</Card>
	)
}
