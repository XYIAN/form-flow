# MCP (Model Context Protocol) Development Guide

## Overview

The Model Context Protocol (MCP) is a comprehensive architectural pattern implemented in this Form Flow application to separate business logic from UI components. This guide provides complete documentation for developers and AI assistants working with this codebase.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [MCP Components](#mcp-components)
3. [Implementation Details](#implementation-details)
4. [Usage Examples](#usage-examples)
5. [Development Workflow](#development-workflow)
6. [Testing & Debugging](#testing--debugging)
7. [Extending MCP](#extending-mcp)
8. [Troubleshooting](#troubleshooting)

## Architecture Overview

### Core Principles

- **Stateless Static Methods**: All MCP operations are stateless static methods for predictability and testability
- **Separation of Concerns**: Business logic is completely separated from UI components
- **Type Safety**: Comprehensive TypeScript interfaces ensure data integrity
- **Error Handling**: Structured error objects with codes, messages, and field-specific details
- **Performance Tracking**: Built-in execution time monitoring for all operations
- **Centralized Logging**: Multi-level logging system with real-time debugging capabilities

### MCP Layer Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    UI Components                            │
│  (React Components, Pages, Forms)                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                 MCP Layer                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │  FormMCP    │ │  FieldMCP   │ │SubmissionMCP│          │
│  │             │ │             │ │             │          │
│  │ • createForm│ │ • render    │ │ • validate  │          │
│  │ • updateForm│ │ • validate  │ │ • process   │          │
│  │ • validate  │ │ • getProps  │ │ • format    │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              MCPLogger                              │  │
│  │ • debug, warn, error, info                         │  │
│  │ • performance tracking                             │  │
│  │ • real-time logging                                │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              Data Layer                                     │
│  (LocalStorage, Context, State Management)                 │
└─────────────────────────────────────────────────────────────┘
```

## MCP Components

### 1. FormMCP (`src/lib/mcp/implementations/FormMCP.ts`)

**Purpose**: Handles all form-related business logic including creation, validation, updates, and metadata generation.

**Key Methods**:

- `createForm(data: CreateFormData): MCPResult<Form>` - Creates a new form with validation
- `validateFormData(data: CreateFormData): ValidationResult` - Validates form configuration
- `updateForm(existingForm: Form, updates: Partial<CreateFormData>): MCPResult<Form>` - Updates existing form
- `validateForm(form: Form): MCPResult<boolean>` - Validates complete form structure
- `sanitizeFormData(data: CreateFormData): CreateFormData` - Sanitizes input data

**Usage Example**:

```typescript
import { FormMCP } from '@/lib/mcp'

// Create a new form
const result = FormMCP.createForm({
	title: 'Contact Form',
	description: 'Get in touch with us',
	fields: [
		{
			id: 'name',
			label: 'Full Name',
			type: 'text',
			required: true,
			placeholder: 'Enter your name',
		},
	],
})

if (result.success) {
	console.log('Form created:', result.data)
} else {
	console.error('Errors:', result.errors)
}
```

### 2. FieldMCP (`src/lib/mcp/implementations/FieldMCP.ts`)

**Purpose**: Handles field rendering, validation, and component management using PrimeReact components.

**Key Methods**:

- `render(props: FieldRenderProps): MCPResult<{ Component: any; componentProps: any }>` - Returns component and props for rendering
- `validateField(field: FormField): MCPResult<boolean>` - Validates field configuration
- `validateFieldValue(field: FormField, value: unknown): MCPResult<boolean>` - Validates field value
- `getComponent(fieldType: FieldType): React.ComponentType<any>` - Gets appropriate PrimeReact component
- `getComponentProps(field: FormField, control: any, errors: any): any` - Generates component props
- `getValidationRules(field: FormField): any` - Generates React Hook Form validation rules

**Supported Field Types**:

- **Basic**: text, email, password, number, url, search
- **Date/Time**: date, datetime, time, month, week, year
- **Text**: textarea, rich-text, markdown
- **Selection**: select, multiselect, checkbox, radio, yesno, toggle
- **Financial**: money, percentage, currency
- **Contact**: phone, address, country, state, zipcode
- **File/Media**: file, image, signature, audio, video
- **Rating/Scale**: rating, slider, range, likert
- **Specialized**: color, tags, autocomplete, location, matrix

**Usage Example**:

```typescript
import { FieldMCP } from '@/lib/mcp'

// Validate a field
const field = {
	id: 'email',
	label: 'Email Address',
	type: 'email',
	required: true,
}

const validation = FieldMCP.validateField(field)
if (!validation.success) {
	console.error('Field validation failed:', validation.errors)
}

// Get component for rendering
const result = FieldMCP.render({
	field,
	control: { [field.id]: { value: '', onChange: () => {}, onBlur: () => {} } },
	errors: {},
})

if (result.success) {
	const { Component, componentProps } = result.data
	// Use Component with componentProps in your React component
}
```

### 3. SubmissionMCP (`src/lib/mcp/implementations/SubmissionMCP.ts`)

**Purpose**: Handles form submission validation, processing, and data transformation.

**Key Methods**:

- `validateSubmission(context: FormValidationContext): MCPResult<SubmissionValidationResult>` - Validates form submission
- `processSubmission(form: Form, data: Record<string, unknown>): MCPResult<FormSubmission>` - Processes submission data
- `formatSubmissionForDisplay(form: Form, submission: FormSubmission): Record<string, unknown>` - Formats data for display
- `sanitizeSubmissionData(data: Record<string, unknown>): Record<string, unknown>` - Sanitizes submission data

**Usage Example**:

```typescript
import { SubmissionMCP } from '@/lib/mcp'

// Validate submission
const validationContext = {
	form: myForm,
	submissionData: { name: 'John Doe', email: 'john@example.com' },
	fieldErrors: {},
}

const validation = SubmissionMCP.validateSubmission(validationContext)
if (validation.success && validation.data?.isValid) {
	// Process the submission
	const processResult = SubmissionMCP.processSubmission(myForm, submissionData)
	if (processResult.success) {
		const formattedData = SubmissionMCP.formatSubmissionForDisplay(
			myForm,
			processResult.data
		)
		console.log('Formatted submission:', formattedData)
	}
}
```

### 4. MCPLogger (`src/lib/mcp/implementations/logger.ts`)

**Purpose**: Provides centralized logging, performance tracking, and debugging capabilities.

**Key Methods**:

- `configure(config: Partial<MCPConfig>): void` - Configure logging behavior
- `log(operation: string, input: any, result: MCPResult<any>): void` - Log MCP operations
- `error(operation: string, error: MCPError | Error): void` - Log errors
- `warn(operation: string, message: string, data?: any): void` - Log warnings
- `debug(operation: string, message: string, data?: any): void` - Log debug information
- `performance(operation: string, startTime: number, endTime: number, metadata?: any): void` - Log performance metrics
- `startTimer(operation: string): () => void` - Start performance tracking
- `createPerformanceTracker(operation: string): { end(): number }` - Create performance tracker

**Usage Example**:

```typescript
import { MCPLogger } from '@/lib/mcp'

// Configure logger
MCPLogger.configure({
	debug: true,
	logLevel: 'debug',
	enablePerformanceTracking: true,
	onLog: (level, operation, message, data, executionTime) => {
		console.log(`[${level}] ${operation}: ${message}`, data)
	},
})

// Track performance
const timer = MCPLogger.startTimer('form-creation')
// ... perform operation
MCPLogger.performance('form-creation', timer.end())

// Log operations
MCPLogger.debug('myOperation', 'Starting operation', { userId: 123 })
MCPLogger.error('myOperation', new Error('Something went wrong'))
```

## Implementation Details

### Type Definitions (`src/lib/mcp/protocols/types.ts`)

**Core Types**:

- `MCPError`: Structured error object with code, message, field, details, and timestamp
- `MCPResult<T>`: Standard result wrapper with success flag, data, errors, warnings, and metadata
- `ValidationResult`: Validation-specific result with isValid flag and errors array
- `MCPConfig`: Logger configuration with debug, logLevel, and performance tracking options

**Interface Definitions**:

- `FieldRenderProps`: Props for field rendering with field, control, and errors
- `FormValidationContext`: Context for form validation with form, submissionData, and fieldErrors
- `SubmissionValidationResult`: Result of submission validation with isValid, errors, and fieldErrors

### Protocol Interfaces

**IFormProtocol** (`src/lib/mcp/protocols/IFormProtocol.ts`): Defines contract for form operations
**IFieldProtocol** (`src/lib/mcp/protocols/IFieldProtocol.ts`): Defines contract for field operations  
**ISubmissionProtocol** (`src/lib/mcp/protocols/ISubmissionProtocol.ts`): Defines contract for submission operations

## Usage Examples

### Creating a Form with MCP

```typescript
import { FormMCP, FieldMCP, MCPLogger } from '@/lib/mcp'

// Configure logging
MCPLogger.configure({ debug: true, logLevel: 'debug' })

// Create form fields
const fields = [
	{
		id: 'name',
		label: 'Full Name',
		type: 'text' as const,
		required: true,
		placeholder: 'Enter your full name',
	},
	{
		id: 'email',
		label: 'Email Address',
		type: 'email' as const,
		required: true,
		placeholder: 'Enter your email',
	},
	{
		id: 'message',
		label: 'Message',
		type: 'textarea' as const,
		required: false,
		placeholder: 'Enter your message',
	},
]

// Validate and create form
const formResult = FormMCP.createForm({
	title: 'Contact Form',
	description: 'Get in touch with us',
	fields,
})

if (formResult.success) {
	console.log('Form created successfully:', formResult.data)
} else {
	console.error('Form creation failed:', formResult.errors)
}
```

### Rendering Fields with MCP

```typescript
import { FieldMCP } from '@/lib/mcp'
import { Controller } from 'react-hook-form'

// In your React component
const renderField = (field: FormField) => {
	return (
		<Controller
			name={field.id}
			control={control}
			rules={FieldMCP.getValidationRules(field)}
			render={({ field: { onChange, value, onBlur } }) => {
				const result = FieldMCP.render({
					field,
					control: {
						[field.id]: {
							value: value || '',
							onChange: (newValue: unknown) => onChange(newValue),
							onBlur: onBlur,
						},
					},
					errors,
				})

				if (!result.success) {
					return (
						<div className='error'>Failed to render field: {field.label}</div>
					)
				}

				const { Component, componentProps } = result.data!
				return <Component {...componentProps} />
			}}
		/>
	)
}
```

### Processing Form Submissions

```typescript
import { SubmissionMCP } from '@/lib/mcp'

const handleSubmit = (data: Record<string, unknown>) => {
	// Validate submission
	const validationContext = {
		form: myForm,
		submissionData: data,
		fieldErrors: errors,
	}

	const validation = SubmissionMCP.validateSubmission(validationContext)

	if (!validation.success || !validation.data?.isValid) {
		console.error('Submission validation failed')
		return
	}

	// Process submission
	const processResult = SubmissionMCP.processSubmission(myForm, data)

	if (processResult.success) {
		// Format for display
		const formattedData = SubmissionMCP.formatSubmissionForDisplay(
			myForm,
			processResult.data
		)
		console.log('Submission processed:', formattedData)
	}
}
```

## Development Workflow

### 1. Adding New Field Types

1. **Update Type Definition**: Add new field type to `FieldType` in `src/types/index.ts`
2. **Update FieldMCP**: Add component mapping in `getComponent()` method
3. **Update Utils**: Add display label in `getFieldTypeLabel()` in `src/utils/index.ts`
4. **Update Constants**: Add to `FIELD_TYPES` in `src/constants/index.ts` if needed
5. **Test**: Use MCPDebugPanel to test the new field type

### 2. Extending Validation Rules

1. **Update FieldMCP**: Modify `validateFieldValue()` method to add new validation logic
2. **Update Types**: Add new validation properties to `FormField` interface if needed
3. **Test**: Use MCPDebugPanel to test validation with various inputs

### 3. Adding New MCP Operations

1. **Define Interface**: Add method signature to appropriate protocol interface
2. **Implement Method**: Add static method to MCP implementation class
3. **Add Logging**: Include performance tracking and error handling
4. **Export**: Add to `src/lib/mcp/index.ts` exports
5. **Document**: Update this guide with usage examples

## Testing & Debugging

### MCPDebugPanel

The application includes a built-in debug panel (`src/components/MCPDebugPanel.tsx`) that provides:

- **Real-time MCP Logging**: See all MCP operations as they happen
- **Field Testing**: Test field validation, rendering, and value validation
- **Performance Tracking**: Monitor execution times for MCP operations
- **Error Display**: View detailed error information
- **Interactive Testing**: Test different field types and configurations

**Access**: Available on the main login page - click "MCP Debug" button

### Console Logging

MCP operations are logged to the browser console with structured information:

```javascript
🔧 MCP: createForm
📥 Input: { title: "Test Form", fields: [...] }
📤 Result: { success: true, data: {...} }
⏱️ Execution time: 2.34ms
```

### Performance Monitoring

All MCP operations include automatic performance tracking:

```typescript
const timer = MCPLogger.startTimer('myOperation')
// ... perform operation
const executionTime = timer.end()
MCPLogger.performance('myOperation', executionTime)
```

## Extending MCP

### Creating Custom MCP Classes

1. **Create Protocol Interface**: Define contract in `src/lib/mcp/protocols/`
2. **Implement Class**: Create implementation in `src/lib/mcp/implementations/`
3. **Add Logging**: Include MCPLogger for all operations
4. **Export**: Add to `src/lib/mcp/index.ts`
5. **Test**: Create test cases and use MCPDebugPanel

### Example Custom MCP

```typescript
// src/lib/mcp/protocols/ICustomProtocol.ts
export interface ICustomProtocol {
	static processData(data: unknown): MCPResult<ProcessedData>
	static validateInput(input: unknown): MCPResult<boolean>
}

// src/lib/mcp/implementations/CustomMCP.ts
export class CustomMCP {
	static processData(data: unknown): MCPResult<ProcessedData> {
		const tracker = MCPLogger.createPerformanceTracker('processData')

		try {
			// Implementation logic here
			const result: MCPResult<ProcessedData> = {
				success: true,
				data: processedData,
				metadata: {
					executionTime: tracker.end(),
					operation: 'processData',
					timestamp: new Date(),
				},
			}

			MCPLogger.log('processData', data, result)
			return result
		} catch (error) {
			const mcpError: MCPError = {
				code: 'PROCESSING_ERROR',
				message: 'Failed to process data',
				details: { actual: error },
				timestamp: new Date(),
			}

			const result: MCPResult<ProcessedData> = {
				success: false,
				errors: [mcpError],
				metadata: {
					executionTime: tracker.end(),
					operation: 'processData',
					timestamp: new Date(),
				},
			}

			MCPLogger.error('processData', mcpError)
			return result
		}
	}
}
```

## Troubleshooting

### Common Issues

1. **Build Errors**: Check that all field types are included in `getFieldTypeLabel()` in `src/utils/index.ts`
2. **Import Errors**: Ensure all MCP classes are exported in `src/lib/mcp/index.ts`
3. **Type Errors**: Verify that all interfaces match between protocols and implementations
4. **Runtime Errors**: Use MCPDebugPanel to see detailed error information

### Debug Checklist

- [ ] Check browser console for MCP operation logs
- [ ] Use MCPDebugPanel to test individual operations
- [ ] Verify all field types are properly mapped
- [ ] Check that MCPLogger is configured correctly
- [ ] Ensure all imports are correct in consuming components

### Performance Issues

- Use MCPLogger performance tracking to identify slow operations
- Check execution times in MCPDebugPanel
- Optimize validation logic for large forms
- Consider caching for frequently accessed data

## Best Practices

1. **Always Use MCP**: Don't bypass MCP for business logic - use it consistently
2. **Handle Errors**: Always check `result.success` before using `result.data`
3. **Log Operations**: Use MCPLogger for all significant operations
4. **Type Safety**: Leverage TypeScript interfaces for all MCP operations
5. **Performance**: Use performance tracking for optimization
6. **Testing**: Test new MCP functionality with MCPDebugPanel
7. **Documentation**: Update this guide when adding new MCP features

## Integration Points

### React Hook Form Integration

MCP is designed to work seamlessly with React Hook Form:

```typescript
// Get validation rules for Controller
const rules = FieldMCP.getValidationRules(field)

// Render field with Controller
<Controller
  name={field.id}
  control={control}
  rules={rules}
  render={({ field: { onChange, value, onBlur } }) => {
    const result = FieldMCP.render({ field, control, errors })
    if (result.success) {
      const { Component, componentProps } = result.data
      return <Component {...componentProps} />
    }
    return <div>Error rendering field</div>
  }}
/>
```

### Context Integration

MCP integrates with React Context for state management:

```typescript
// In FormContext
const createForm = (formData: CreateFormData, userId: string): Form | null => {
	const result = FormMCP.createForm(formData)

	if (!result.success) {
		setErrors(result.errors?.map(e => e.message) || ['Failed to create form'])
		return null
	}

	const newForm: Form = {
		...result.data!,
		userId,
		createdAt: new Date(),
		updatedAt: new Date(),
	}

	setForms(prev => [...prev, newForm])
	return newForm
}
```

This comprehensive guide should provide all the information needed for future development and AI assistant interactions with the MCP system in this codebase.
