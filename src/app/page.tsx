'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { useAuth } from '@/context/AuthContext'
import { APP_NAME, APP_DESCRIPTION, DEMO_USERS } from '@/constants'
import { isValidEmail } from '@/utils'
import MCPDebugPanel from '@/components/MCPDebugPanel'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [companyName, setCompanyName] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const { login } = useAuth()
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setIsLoading(true)

		if (!email.trim()) {
			setError('Email is required')
			setIsLoading(false)
			return
		}

		if (!isValidEmail(email)) {
			setError('Please enter a valid email address')
			setIsLoading(false)
			return
		}

		if (!companyName.trim()) {
			setError('Company name is required')
			setIsLoading(false)
			return
		}

		try {
			const success = await login(email, companyName)
			if (success) {
				router.push(`/user/${email}`)
			} else {
				setError('Login failed. Please try again.')
			}
		} catch {
			setError('An error occurred. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	const handleDemoLogin = (demoEmail: string, demoCompany: string) => {
		setEmail(demoEmail)
		setCompanyName(demoCompany)
	}

	return (
		<div className='form-flow-container flex align-items-center justify-content-center min-h-screen p-4'>
			<div className='w-full max-w-6xl'>
				<div className='grid'>
					<div className='col-12 md:col-6'>
						<Card className='form-flow-card'>
							<div className='text-center mb-4'>
								<h1 className='text-3xl font-bold text-white mb-2'>
									{APP_NAME}
								</h1>
								<p className='text-gray-300'>{APP_DESCRIPTION}</p>
							</div>

							<form onSubmit={handleSubmit} className='space-y-4'>
								<div className='field'>
									<label
										htmlFor='email'
										className='block text-sm font-medium text-gray-300 mb-2'
									>
										Email Address
									</label>
									<InputText
										id='email'
										type='email'
										value={email}
										onChange={e => setEmail(e.target.value)}
										placeholder='Enter your email'
										className='w-full'
										disabled={isLoading}
									/>
								</div>

								<div className='field'>
									<label
										htmlFor='company'
										className='block text-sm font-medium text-gray-300 mb-2'
									>
										Company Name
									</label>
									<InputText
										id='company'
										type='text'
										value={companyName}
										onChange={e => setCompanyName(e.target.value)}
										placeholder='Enter your company name'
										className='w-full'
										disabled={isLoading}
									/>
								</div>

								{error && (
									<Message severity='error' text={error} className='w-full' />
								)}

								<Button
									type='submit'
									label={isLoading ? 'Signing In...' : 'Sign In'}
									icon={isLoading ? 'pi pi-spinner pi-spin' : 'pi pi-sign-in'}
									className='w-full'
									disabled={isLoading}
								/>
							</form>

							<div className='mt-6'>
								<h3 className='text-lg font-semibold text-white mb-3'>
									Demo Accounts
								</h3>
								<div className='space-y-2'>
									{DEMO_USERS.map(user => (
										<Button
											key={user.id}
											label={`${user.email} - ${user.companyName}`}
											icon='pi pi-user'
											className='w-full p-button-outlined p-button-secondary'
											onClick={() =>
												handleDemoLogin(user.email, user.companyName)
											}
										/>
									))}
								</div>
							</div>
						</Card>
					</div>

					<div className='col-12 md:col-6'>
						<MCPDebugPanel />
					</div>
				</div>
			</div>
		</div>
	)
}
