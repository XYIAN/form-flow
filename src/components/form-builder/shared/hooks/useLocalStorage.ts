import { useState, useEffect } from 'react'

/**
 * Custom hook for managing state in localStorage
 * @param key The localStorage key
 * @param initialValue The initial value
 * @returns [storedValue, setValue] tuple
 */
export function useLocalStorage<T>(
	key: string,
	initialValue: T
): [T, (value: T) => void] {
	// Get from localStorage then parse stored json or return initialValue
	const readValue = (): T => {
		if (typeof window === 'undefined') {
			return initialValue
		}

		try {
			const item = window.localStorage.getItem(key)
			return item ? JSON.parse(item) : initialValue
		} catch (error) {
			console.warn(`Error reading localStorage key "${key}":`, error)
			return initialValue
		}
	}

	const [storedValue, setStoredValue] = useState<T>(readValue)

	// Return a wrapped version of useState's setter function that persists the new value to localStorage
	const setValue = (value: T) => {
		try {
			// Allow value to be a function so we have same API as useState
			const valueToStore =
				value instanceof Function ? value(storedValue) : value
			setStoredValue(valueToStore)
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(key, JSON.stringify(valueToStore))
			}
		} catch (error) {
			console.warn(`Error setting localStorage key "${key}":`, error)
		}
	}

	useEffect(() => {
		setStoredValue(readValue())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return [storedValue, setValue]
}
