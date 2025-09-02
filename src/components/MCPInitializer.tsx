/**
 * MCP Initializer Component
 * 
 * Client-side component to initialize MCP console utilities
 */

'use client'

import { useEffect } from 'react'
import { initializeMCPConsole } from '@/utils/mcp-console'

export default function MCPInitializer() {
	useEffect(() => {
		// Initialize MCP console utilities
		initializeMCPConsole()
	}, [])

	// This component doesn't render anything
	return null
}
