/**
 * MCP Logger - Centralized logging system for MCP operations
 *
 * Provides structured logging with different levels, performance tracking,
 * and error reporting for all MCP operations.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import {
	MCPResult,
	MCPError,
	MCPConfig,
	DEFAULT_MCP_CONFIG,
} from '../protocols/types'

export class MCPLogger {
	private static config: MCPConfig = DEFAULT_MCP_CONFIG
	private static onLogCallback?: (
		level: string,
		operation: string,
		message: string,
		data?: any,
		executionTime?: number
	) => void

	/**
	 * Configure the logger
	 */
	static configure(
		config: Partial<MCPConfig> & {
			onLog?: (
				level: string,
				operation: string,
				message: string,
				data?: any,
				executionTime?: number
			) => void
		}
	): void {
		this.config = { ...this.config, ...config }
		if (config.onLog) {
			this.onLogCallback = config.onLog
		}
	}

	/**
	 * Log a successful MCP operation
	 */
	static log(operation: string, input: any, result: MCPResult<any>): void {
		if (!this.config.debug) return

		const level = this.getLogLevel(result)
		if (!this.shouldLog(level)) return

		// Enhanced console logging with better formatting
		const timestamp = new Date().toISOString()
		const status = result.success ? '✅' : '❌'

		console.group(`🔧 MCP: ${operation} ${status}`)
		console.log(`🕐 Timestamp: ${timestamp}`)
		console.log(`📊 Status: ${result.success ? 'SUCCESS' : 'FAILED'}`)

		// Input data with better formatting
		console.group('📥 Input Data')
		console.log(this.sanitizeForLog(input))
		console.groupEnd()

		// Result data with better formatting
		console.group('📤 Result Data')
		console.log('Success:', result.success)
		if (result.data) {
			console.log('Data:', this.sanitizeForLog(result.data))
		}
		console.groupEnd()

		// Performance metrics
		if (
			this.config.enablePerformanceTracking &&
			result.metadata?.executionTime
		) {
			console.group('⏱️ Performance Metrics')
			console.log(
				`Execution time: ${result.metadata.executionTime.toFixed(2)}ms`
			)
			console.log(`Operation: ${result.metadata.operation}`)
			console.log(`Timestamp: ${result.metadata.timestamp}`)
			console.groupEnd()
		}

		// Errors with detailed information
		if (result.errors?.length) {
			console.group('❌ Errors')
			result.errors.forEach((error, index) => {
				console.error(`Error ${index + 1}:`, {
					code: error.code,
					message: error.message,
					field: error.field,
					timestamp: error.timestamp,
					details: error.details,
				})
			})
			console.groupEnd()
		}

		// Warnings with detailed information
		if (result.warnings?.length) {
			console.group('⚠️ Warnings')
			result.warnings.forEach((warning, index) => {
				console.warn(`Warning ${index + 1}:`, {
					code: warning.code,
					message: warning.message,
					field: warning.field,
					timestamp: warning.timestamp,
					details: warning.details,
				})
			})
			console.groupEnd()
		}

		// MCP-specific metadata
		if (result.metadata) {
			console.group('🔍 MCP Metadata')
			console.log('Operation:', result.metadata.operation)
			console.log('Timestamp:', result.metadata.timestamp)
			if (result.metadata.executionTime) {
				console.log(
					'Execution Time:',
					`${result.metadata.executionTime.toFixed(2)}ms`
				)
			}
			console.groupEnd()
		}

		console.groupEnd()

		// Call external callback if configured
		if (this.onLogCallback) {
			const message = result.success
				? 'Operation completed successfully'
				: 'Operation failed'
			this.onLogCallback(
				level,
				operation,
				message,
				result,
				result.metadata?.executionTime
			)
		}
	}

	/**
	 * Log an error
	 */
	static error(operation: string, error: MCPError | Error): void {
		if (!this.shouldLog('error')) return

		console.error(`🚨 MCP Error in ${operation}:`, error)

		if (error instanceof Error) {
			console.error('Stack trace:', error.stack)
		}

		// Call external callback if configured
		if (this.onLogCallback) {
			const message = error instanceof Error ? error.message : error.message
			this.onLogCallback('error', operation, message, error)
		}
	}

	/**
	 * Log a warning
	 */
	static warn(operation: string, message: string, data?: any): void {
		if (!this.shouldLog('warn')) return

		console.warn(`⚠️ MCP Warning in ${operation}: ${message}`, data)

		// Call external callback if configured
		if (this.onLogCallback) {
			this.onLogCallback('warn', operation, message, data)
		}
	}

	/**
	 * Log debug information
	 */
	static debug(operation: string, message: string, data?: any): void {
		if (!this.shouldLog('debug')) return

		console.debug(`🐛 MCP Debug in ${operation}: ${message}`, data)

		// Call external callback if configured
		if (this.onLogCallback) {
			this.onLogCallback('debug', operation, message, data)
		}
	}

	/**
	 * Log performance metrics
	 */
	static performance(
		operation: string,
		startTime: number,
		endTime: number,
		metadata?: any
	): void {
		if (!this.config.enablePerformanceTracking) return

		const executionTime = endTime - startTime
		console.log(
			`📊 MCP Performance - ${operation}: ${executionTime.toFixed(2)}ms`,
			metadata
		)
	}

	/**
	 * Start performance tracking
	 */
	static startTimer(operation: string): () => void {
		const startTime = performance.now()

		return () => {
			const endTime = performance.now()
			this.performance(operation, startTime, endTime)
		}
	}

	/**
	 * Get log level based on result
	 */
	private static getLogLevel(
		result: MCPResult<any>
	): 'error' | 'warn' | 'info' | 'debug' {
		if (result.errors?.length) return 'error'
		if (result.warnings?.length) return 'warn'
		return 'info'
	}

	/**
	 * Check if we should log at this level
	 */
	private static shouldLog(
		level: 'error' | 'warn' | 'info' | 'debug'
	): boolean {
		const levels = ['error', 'warn', 'info', 'debug']
		const currentLevelIndex = levels.indexOf(this.config.logLevel)
		const requestedLevelIndex = levels.indexOf(level)

		return requestedLevelIndex <= currentLevelIndex
	}

	/**
	 * Sanitize data for logging (remove sensitive information)
	 */
	private static sanitizeForLog(data: any): any {
		if (data === null || data === undefined) return data

		if (typeof data === 'object') {
			if (Array.isArray(data)) {
				return data.map(item => this.sanitizeForLog(item))
			}

			const sanitized: any = {}
			for (const [key, value] of Object.entries(data)) {
				// Skip sensitive fields
				if (
					['password', 'token', 'secret', 'key'].some(sensitive =>
						key.toLowerCase().includes(sensitive)
					)
				) {
					sanitized[key] = '[REDACTED]'
				} else {
					sanitized[key] = this.sanitizeForLog(value)
				}
			}
			return sanitized
		}

		return data
	}

	/**
	 * Create a performance tracker
	 */
	static createPerformanceTracker(operation: string) {
		const startTime = performance.now()

		return {
			end: (metadata?: any) => {
				const endTime = performance.now()
				this.performance(operation, startTime, endTime, metadata)
				return endTime - startTime
			},
		}
	}
}
