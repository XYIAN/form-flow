'use client'

import { useEffect, useCallback } from 'react'

interface KeyboardShortcutsOptions {
	onUndo?: () => void
	onRedo?: () => void
	onSave?: () => void
	onPreview?: () => void
	onCopy?: () => void
	onPaste?: () => void
	onDelete?: () => void
	onSelectAll?: () => void
	onEscape?: () => void
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions) {
	const {
		onUndo,
		onRedo,
		onSave,
		onPreview,
		onCopy,
		onPaste,
		onDelete,
		onSelectAll,
		onEscape,
	} = options

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const { ctrlKey, metaKey, key, shiftKey } = event
			const isCtrlOrCmd = ctrlKey || metaKey

			// Prevent default browser shortcuts when our shortcuts are available
			if (isCtrlOrCmd) {
				switch (key.toLowerCase()) {
					case 'z':
						if (shiftKey && onRedo) {
							event.preventDefault()
							onRedo()
						} else if (onUndo) {
							event.preventDefault()
							onUndo()
						}
						break
					case 'y':
						if (onRedo) {
							event.preventDefault()
							onRedo()
						}
						break
					case 's':
						if (onSave) {
							event.preventDefault()
							onSave()
						}
						break
					case 'p':
						if (onPreview) {
							event.preventDefault()
							onPreview()
						}
						break
					case 'c':
						if (onCopy) {
							event.preventDefault()
							onCopy()
						}
						break
					case 'v':
						if (onPaste) {
							event.preventDefault()
							onPaste()
						}
						break
					case 'a':
						if (onSelectAll) {
							event.preventDefault()
							onSelectAll()
						}
						break
				}
			}

			// Handle other keys
			switch (key) {
				case 'Delete':
				case 'Backspace':
					if (onDelete) {
						event.preventDefault()
						onDelete()
					}
					break
				case 'Escape':
					if (onEscape) {
						event.preventDefault()
						onEscape()
					}
					break
			}
		},
		[
			onUndo,
			onRedo,
			onSave,
			onPreview,
			onCopy,
			onPaste,
			onDelete,
			onSelectAll,
			onEscape,
		]
	)

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [handleKeyDown])

	// Return available shortcuts for display
	return {
		shortcuts: {
			undo: onUndo ? 'Ctrl+Z' : null,
			redo: onRedo ? 'Ctrl+Y' : null,
			save: onSave ? 'Ctrl+S' : null,
			preview: onPreview ? 'Ctrl+P' : null,
			copy: onCopy ? 'Ctrl+C' : null,
			paste: onPaste ? 'Ctrl+V' : null,
			selectAll: onSelectAll ? 'Ctrl+A' : null,
			delete: onDelete ? 'Delete' : null,
			escape: onEscape ? 'Escape' : null,
		},
	}
}
