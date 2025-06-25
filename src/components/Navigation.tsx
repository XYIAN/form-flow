'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import { Sidebar } from 'primereact/sidebar'
import { useAuth } from '@/context/AuthContext'
import { APP_NAME } from '@/constants'

interface NavigationProps {
	userEmail: string
	companyName: string
}

export default function Navigation({ userEmail, companyName }: NavigationProps) {
	const [sidebarVisible, setSidebarVisible] = useState(false)
	const { logout } = useAuth()
	const router = useRouter()

	const handleLogout = () => {
		logout()
		router.push('/')
	}

	const navItems = [
		{ label: 'Dashboard', icon: 'pi pi-home', href: `/user/${userEmail}` },
		{ label: 'Create Form', icon: 'pi pi-plus', href: `/user/${userEmail}/create` },
		{ label: 'My Forms', icon: 'pi pi-list', href: `/user/${userEmail}/forms` }
	]

	return (
		<>
			{/* Desktop Navigation */}
			<nav className="hidden md:flex justify-content-between align-items-center p-3 bg-gray-900 border-bottom-1 border-gray-700">
				<div className="flex align-items-center">
					<h1 className="text-xl font-bold text-white mr-4">{APP_NAME}</h1>
					<div className="text-gray-300">
						<span className="font-medium">{companyName}</span>
						<span className="mx-2">•</span>
						<span>{userEmail}</span>
					</div>
				</div>
				
				<div className="flex align-items-center gap-3">
					{navItems.map((item) => (
						<Button
							key={item.label}
							label={item.label}
							icon={item.icon}
							className="p-button-text p-button-secondary"
							onClick={() => router.push(item.href)}
						/>
					))}
					<Button
						label="Logout"
						icon="pi pi-sign-out"
						className="p-button-outlined p-button-danger"
						onClick={handleLogout}
					/>
				</div>
			</nav>

			{/* Mobile Navigation */}
			<nav className="md:hidden flex justify-content-between align-items-center p-3 bg-gray-900 border-bottom-1 border-gray-700">
				<div className="flex align-items-center">
					<h1 className="text-lg font-bold text-white">{APP_NAME}</h1>
				</div>
				
				<div className="flex align-items-center gap-2">
					<Button
						icon="pi pi-bars"
						className="p-button-text p-button-secondary"
						onClick={() => setSidebarVisible(true)}
					/>
				</div>
			</nav>

			{/* Mobile Sidebar */}
			<Sidebar
				visible={sidebarVisible}
				position="right"
				onHide={() => setSidebarVisible(false)}
				className="w-20rem"
			>
				<div className="p-4">
					<div className="mb-4">
						<h3 className="text-lg font-semibold text-white mb-2">{companyName}</h3>
						<p className="text-gray-300 text-sm">{userEmail}</p>
					</div>
					
					<div className="flex flex-column gap-2">
						{navItems.map((item) => (
							<Button
								key={item.label}
								label={item.label}
								icon={item.icon}
								className="w-full justify-content-start p-button-text p-button-secondary"
								onClick={() => {
									router.push(item.href)
									setSidebarVisible(false)
								}}
							/>
						))}
						
						<div className="border-top-1 border-gray-700 my-3"></div>
						
						<Button
							label="Logout"
							icon="pi pi-sign-out"
							className="w-full justify-content-start p-button-outlined p-button-danger"
							onClick={handleLogout}
						/>
					</div>
				</div>
			</Sidebar>
		</>
	)
} 