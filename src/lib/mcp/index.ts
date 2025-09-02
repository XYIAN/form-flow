/**
 * MCP (Model Context Protocol) - Main Export File
 *
 * This file provides a centralized export point for all MCP implementations
 * and utilities, making it easy to import and use MCP functionality throughout
 * the application.
 */

// Protocol Interfaces
export * from './protocols/types'
export * from './protocols/IFormProtocol'
export * from './protocols/IFieldProtocol'
export * from './protocols/ISubmissionProtocol'

// MCP Implementations
export { FormMCP } from './implementations/FormMCP'
export { FieldMCP } from './implementations/FieldMCP'
export { SubmissionMCP } from './implementations/SubmissionMCP'
export { InputLibraryMCP } from './implementations/InputLibraryMCP'
export { MCPLogger } from './implementations/logger'

// MCP Configuration
export { DEFAULT_MCP_CONFIG } from './protocols/types'

// Convenience exports for common operations
// export const MCP = {
// 	Form: FormMCP,
// 	Field: FieldMCP,
// 	Submission: SubmissionMCP,
// 	Logger: MCPLogger
// } as const;
