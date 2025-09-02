/**
 * MCP Console Utilities
 * 
 * Browser console enhancements for MCP debugging and monitoring
 */

import { MCPLogger } from '@/lib/mcp'

// Global MCP console object for browser debugging
declare global {
	interface Window {
		mcp: {
			logger: typeof MCPLogger
			enableDebug: () => void
			disableDebug: () => void
			showStatus: () => void
			clearLogs: () => void
		}
	}
}

export function initializeMCPConsole() {
	if (typeof window === 'undefined') return

	// Configure MCP logger for enhanced browser logging
	MCPLogger.configure({
		debug: true,
		logLevel: 'debug',
		enablePerformanceTracking: true,
		onLog: (level, operation, message, data) => {
			// Additional browser-specific logging
			if (level === 'error') {
				console.error(`🚨 MCP Error: ${operation} - ${message}`, data)
			} else if (level === 'warn') {
				console.warn(`⚠️ MCP Warning: ${operation} - ${message}`, data)
			} else {
				console.log(`ℹ️ MCP Info: ${operation} - ${message}`, data)
			}
		}
	})

	// Add MCP utilities to window object for browser debugging
	window.mcp = {
		logger: MCPLogger,
		enableDebug: () => {
			MCPLogger.configure({ debug: true, logLevel: 'debug' })
			console.log('🔧 MCP Debug mode enabled')
		},
		disableDebug: () => {
			MCPLogger.configure({ debug: false, logLevel: 'error' })
			console.log('🔧 MCP Debug mode disabled')
		},
		showStatus: () => {
			console.log('📊 MCP System Status:')
			console.log('  - Debug Mode: Enabled')
			console.log('  - Performance Tracking: Enabled')
			console.log('  - Log Level: Debug')
			console.log('  - Available MCPs: FormMCP, FieldMCP, SubmissionMCP')
			console.log('  - Use window.mcp.logger for direct access')
		},
		clearLogs: () => {
			console.clear()
			console.log('🧹 MCP Console cleared')
		}
	}

	// Welcome message
	console.log(`
🔧 Form Flow MCP System Initialized

Available commands:
  window.mcp.enableDebug()    - Enable debug logging
  window.mcp.disableDebug()   - Disable debug logging  
  window.mcp.showStatus()     - Show system status
  window.mcp.clearLogs()      - Clear console
  window.mcp.logger           - Direct MCP logger access

MCP Operations will be logged with detailed information including:
  📥 Input data
  📤 Result data  
  ⏱️ Performance metrics
  ❌ Error details
  🔍 MCP metadata
`)

	// Log system initialization
	console.log('🚀 MCP System ready for operations')
}

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
	initializeMCPConsole()
}
