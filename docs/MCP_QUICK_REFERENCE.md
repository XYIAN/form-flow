# MCP Quick Reference for AI Assistants

## 🚀 **Quick Start**

This codebase uses the **Model Context Protocol (MCP)** - a stateless, static method architecture that separates business logic from UI components.

### **Key Files to Know**

- `src/lib/mcp/` - All MCP implementations and protocols
- `src/components/MCPDebugPanel.tsx` - Interactive testing and debugging
- `docs/MCP_DEVELOPMENT_GUIDE.md` - Complete documentation

## 🏗️ **Architecture Overview**

```
UI Components → MCP Layer → Data Layer
     ↓              ↓           ↓
React Forms → FormMCP/FieldMCP → Context/Storage
```

**Core Principle**: All business logic goes through MCP static methods, never directly in components.

## 📋 **Essential MCP Classes**

### **FormMCP** - Form Management

```typescript
import { FormMCP } from '@/lib/mcp'

// Create form
const result = FormMCP.createForm({
  title: "My Form",
  fields: [...]
})

// Always check success
if (result.success) {
  console.log(result.data) // Form object
} else {
  console.error(result.errors) // MCPError[]
}
```

### **FieldMCP** - Field Rendering & Validation

```typescript
import { FieldMCP } from '@/lib/mcp'

// Validate field
const validation = FieldMCP.validateField(field)
if (!validation.success) {
	console.error(validation.errors)
}

// Get component for rendering
const result = FieldMCP.render({ field, control, errors })
if (result.success) {
	const { Component, componentProps } = result.data
	return <Component {...componentProps} />
}
```

### **SubmissionMCP** - Form Submissions

```typescript
import { SubmissionMCP } from '@/lib/mcp'

// Validate submission
const validation = SubmissionMCP.validateSubmission({
	form,
	submissionData,
	fieldErrors,
})

// Process submission
if (validation.success && validation.data?.isValid) {
	const processResult = SubmissionMCP.processSubmission(form, data)
}
```

### **MCPLogger** - Debugging & Performance

```typescript
import { MCPLogger } from '@/lib/mcp'

// Configure logging
MCPLogger.configure({
	debug: true,
	logLevel: 'debug',
	enablePerformanceTracking: true,
})

// Log operations
MCPLogger.debug('operation', 'message', data)
MCPLogger.error('operation', error)
```

## 🎯 **Common Patterns**

### **1. Form Creation Pattern**

```typescript
// In FormContext or component
const createForm = (formData: CreateFormData, userId: string) => {
	const result = FormMCP.createForm(formData)

	if (!result.success) {
		setErrors(result.errors?.map(e => e.message) || ['Failed to create form'])
		return null
	}

	const newForm = {
		...result.data!,
		userId,
		createdAt: new Date(),
		updatedAt: new Date(),
	}

	setForms(prev => [...prev, newForm])
	return newForm
}
```

### **2. Field Rendering Pattern**

```typescript
// In form component with React Hook Form
const renderField = (field: FormField) => {
	return (
		<Controller
			name={field.id}
			control={control}
			rules={FieldMCP.getValidationRules(field)}
			render={({ field: { onChange, value, onBlur } }) => {
				const result = FieldMCP.render({
					field,
					control: { [field.id]: { value, onChange, onBlur } },
					errors,
				})

				if (!result.success) {
					return <div>Error rendering field</div>
				}

				const { Component, componentProps } = result.data!
				return <Component {...componentProps} />
			}}
		/>
	)
}
```

### **3. Submission Processing Pattern**

```typescript
const handleSubmit = (data: Record<string, unknown>) => {
	const validation = SubmissionMCP.validateSubmission({
		form,
		submissionData: data,
		fieldErrors: errors,
	})

	if (!validation.success || !validation.data?.isValid) {
		setError('Please fix form errors')
		return
	}

	const processResult = SubmissionMCP.processSubmission(form, data)
	if (processResult.success) {
		const formatted = SubmissionMCP.formatSubmissionForDisplay(
			form,
			processResult.data
		)
		// Handle success
	}
}
```

## 🔧 **Field Types Supported**

**Basic**: `text`, `email`, `password`, `number`, `url`, `search`
**Date/Time**: `date`, `datetime`, `time`, `month`, `week`, `year`
**Text**: `textarea`, `rich-text`, `markdown`
**Selection**: `select`, `multiselect`, `checkbox`, `radio`, `yesno`, `toggle`
**Financial**: `money`, `percentage`, `currency`
**Contact**: `phone`, `address`, `country`, `state`, `zipcode`
**File/Media**: `file`, `image`, `signature`, `audio`, `video`
**Rating/Scale**: `rating`, `slider`, `range`, `likert`
**Specialized**: `color`, `tags`, `autocomplete`, `location`, `matrix`

## 🐛 **Debugging Tools**

### **MCPDebugPanel**

- Available on main page (click "MCP Debug" button)
- Real-time MCP operation logging
- Interactive field testing
- Performance monitoring
- Error display

### **Console Logging**

All MCP operations log to console:

```
🔧 MCP: createForm
📥 Input: {...}
📤 Result: {...}
⏱️ Execution time: 2.34ms
```

## ⚠️ **Common Gotchas**

1. **Always Check Success**: Never use `result.data` without checking `result.success`
2. **Error Handling**: MCP errors are structured objects, not strings
3. **Type Safety**: Use TypeScript interfaces - don't bypass them
4. **Performance**: All operations are tracked automatically
5. **Logging**: Use MCPLogger, not console.log for MCP operations

## 🚨 **Error Codes**

- `FIELD_ERROR` - Field validation failed
- `FORM_ERROR` - Form validation failed
- `RENDER_ERROR` - Field rendering failed
- `VALIDATION_ERROR` - Value validation failed
- `PROCESSING_ERROR` - Data processing failed

## 📁 **File Structure**

```
src/lib/mcp/
├── protocols/
│   ├── types.ts              # Core types and interfaces
│   ├── IFormProtocol.ts      # Form operations contract
│   ├── IFieldProtocol.ts     # Field operations contract
│   └── ISubmissionProtocol.ts # Submission operations contract
├── implementations/
│   ├── FormMCP.ts            # Form business logic
│   ├── FieldMCP.ts           # Field rendering & validation
│   ├── SubmissionMCP.ts      # Submission processing
│   └── logger.ts             # Logging & performance tracking
└── index.ts                  # Main exports
```

## 🎯 **When to Use MCP**

✅ **DO Use MCP For**:

- Form creation, validation, updates
- Field rendering and validation
- Submission processing
- Business logic operations
- Data transformation

❌ **DON'T Use MCP For**:

- UI state management (use React state)
- Navigation (use Next.js router)
- API calls (use fetch/axios)
- Component lifecycle (use React hooks)

## 🔄 **Integration Points**

- **React Hook Form**: Use `FieldMCP.getValidationRules()` and `FieldMCP.render()`
- **Context**: Use MCP in context methods for business logic
- **Components**: Always go through MCP for data operations
- **Error Handling**: Use structured MCPError objects

## 📚 **For More Details**

See `docs/MCP_DEVELOPMENT_GUIDE.md` for:

- Complete API documentation
- Advanced usage examples
- Extension patterns
- Troubleshooting guide
- Best practices

---

**Remember**: MCP is the single source of truth for all business logic. When in doubt, check the MCP implementations first!
