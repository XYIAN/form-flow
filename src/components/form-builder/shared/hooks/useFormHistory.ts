'use client'

import { useState, useCallback } from 'react'
import { FormField } from '@/types'

interface HistoryState {
	fields: FormField[]
	timestamp: number
}

export function useFormHistory(
	initialFields: FormField[],
	onFieldsChange: (fields: FormField[]) => void
) {
	const [history, setHistory] = useState<HistoryState[]>([
		{ fields: initialFields, timestamp: Date.now() },
	])
	const [currentIndex, setCurrentIndex] = useState(0)
	const maxHistorySize = 50

	const canUndo = currentIndex > 0
	const canRedo = currentIndex < history.length - 1

	const saveState = useCallback(
		(fields: FormField[]) => {
			const newState: HistoryState = {
				fields: [...fields],
				timestamp: Date.now(),
			}

			// Remove any states after current index (when branching)
			const newHistory = history.slice(0, currentIndex + 1)
			newHistory.push(newState)

			// Limit history size
			if (newHistory.length > maxHistorySize) {
				newHistory.shift()
			} else {
				setCurrentIndex(newHistory.length - 1)
			}

			setHistory(newHistory)
		},
		[history, currentIndex, maxHistorySize]
	)

	const undo = useCallback(() => {
		if (!canUndo) return

		const newIndex = currentIndex - 1
		setCurrentIndex(newIndex)
		onFieldsChange(history[newIndex].fields)

		console.log('↶ Undo:', {
			from: currentIndex,
			to: newIndex,
			fields: history[newIndex].fields.length,
		})
	}, [canUndo, currentIndex, history, onFieldsChange])

	const redo = useCallback(() => {
		if (!canRedo) return

		const newIndex = currentIndex + 1
		setCurrentIndex(newIndex)
		onFieldsChange(history[newIndex].fields)

		console.log('↷ Redo:', {
			from: currentIndex,
			to: newIndex,
			fields: history[newIndex].fields.length,
		})
	}, [canRedo, currentIndex, history, onFieldsChange])

	const clearHistory = useCallback(() => {
		setHistory([{ fields: initialFields, timestamp: Date.now() }])
		setCurrentIndex(0)
	}, [initialFields])

	return {
		canUndo,
		canRedo,
		undo,
		redo,
		saveState,
		clearHistory,
		historySize: history.length,
		currentIndex,
	}
}
