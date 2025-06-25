'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthContextType } from '@/types'
import { DEMO_USERS } from '@/constants'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
	children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	// Check for existing user session on mount
	useEffect(() => {
		const savedUser = localStorage.getItem('formFlowUser')
		if (savedUser) {
			const parsedUser = JSON.parse(savedUser)
			setUser(parsedUser)
			setIsAuthenticated(true)
		}
	}, [])

	const login = async (email: string, companyName: string): Promise<boolean> => {
		// Check if user exists in demo users
		const existingUser = DEMO_USERS.find(u => u.email === email)
		
		if (existingUser) {
			// Update company name if provided
			const updatedUser = { ...existingUser, companyName }
			setUser(updatedUser)
			setIsAuthenticated(true)
			localStorage.setItem('formFlowUser', JSON.stringify(updatedUser))
			return true
		}

		// Create new user
		const newUser: User = {
			id: Date.now().toString(),
			email,
			companyName,
			createdAt: new Date()
		}

		setUser(newUser)
		setIsAuthenticated(true)
		localStorage.setItem('formFlowUser', JSON.stringify(newUser))
		return true
	}

	const logout = () => {
		setUser(null)
		setIsAuthenticated(false)
		localStorage.removeItem('formFlowUser')
	}

	const value: AuthContextType = {
		user,
		login,
		logout,
		isAuthenticated
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
} 