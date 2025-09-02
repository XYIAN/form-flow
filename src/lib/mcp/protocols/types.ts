/**
 * MCP (Model Context Protocol) Types and Interfaces
 *
 * This file defines the core types and interfaces used throughout the MCP system.
 * It provides type safety and consistency across all MCP implementations.
 */

export interface MCPError {
	code:
		| 'VALIDATION_ERROR'
		| 'RENDER_ERROR'
		| 'SUBMISSION_ERROR'
		| 'FORM_ERROR'
		| 'FIELD_ERROR'
	message: string
	field?: string
	details?: {
		expected?: unknown
		actual?: unknown
		suggestion?: string
		context?: unknown
	}
	timestamp: Date
}

export interface MCPResult<T> {
	success: boolean
	data?: T
	errors?: MCPError[]
	warnings?: string[]
	metadata?: {
		executionTime: number
		operation: string
		timestamp: Date
	}
}

export interface ValidationResult {
	isValid: boolean
	errors: MCPError[]
	warnings?: string[]
}

export interface RenderResult {
	component: React.ReactNode
	errors?: MCPError[]
	warnings?: string[]
}

export interface FieldRenderProps {
	field: import('@/types').FormField
	control: Record<
		string,
		{
			value: unknown
			onChange: (value: unknown) => void
			onBlur: () => void
		}
	>
	errors: unknown
	onChange?: (value: unknown) => void
	onBlur?: () => void
	value?: unknown
}

export interface FormValidationContext {
	form: import('@/types').Form
	submissionData: Record<string, unknown>
	fieldErrors: Record<string, unknown>
}

export interface SubmissionValidationResult {
	isValid: boolean
	errors: MCPError[]
	fieldErrors: Record<string, string[]>
	warnings?: string[]
}

// MCP Configuration
export interface MCPConfig {
	debug: boolean
	logLevel: 'error' | 'warn' | 'info' | 'debug'
	enablePerformanceTracking: boolean
	enableErrorBoundaries: boolean
}

// Default MCP Configuration
export const DEFAULT_MCP_CONFIG: MCPConfig = {
	debug: process.env.NODE_ENV === 'development',
	logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
	enablePerformanceTracking: true,
	enableErrorBoundaries: true,
}
