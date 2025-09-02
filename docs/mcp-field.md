# MCP Field Documentation

## Overview

The FieldMCP (Model Context Protocol for Fields) is responsible for rendering, validating, and managing all form field types in Form Flow. It provides a centralized system for field operations using PrimeReact components with comprehensive validation and error handling.

## Supported Field Types

### 1. Text Input (`text`)
**Component**: `InputText`  
**Validation**: Basic text validation  
**Props**: `type="text"`, `placeholder`, `value`, `onChange`

```typescript
const field: FormField = {
  id: 'name',
  label: 'Full Name',
  type: 'text',
  required: true,
  placeholder: 'Enter your full name'
}
```

### 2. Email Input (`email`)
**Component**: `InputText`  
**Validation**: Email format validation  
**Props**: `type="email"`, `placeholder`, `value`, `onChange`

```typescript
const field: FormField = {
  id: 'email',
  label: 'Email Address',
  type: 'email',
  required: true,
  placeholder: 'Enter your email address'
}
```

### 3. Number Input (`number`)
**Component**: `InputText`  
**Validation**: Numeric validation  
**Props**: `type="number"`, `placeholder`, `value`, `onChange`

```typescript
const field: FormField = {
  id: 'age',
  label: 'Age',
  type: 'number',
  required: false,
  placeholder: 'Enter your age'
}
```

### 4. Money/Currency Input (`money`)
**Component**: `InputMask`  
**Validation**: Currency format validation  
**Props**: `mask="999,999,999.99"`, `placeholder`, `value`, `onChange`

```typescript
const field: FormField = {
  id: 'amount',
  label: 'Amount',
  type: 'money',
  required: true,
  placeholder: 'Enter amount (e.g., 1,234.56)',
  currency: 'USD'
}
```

### 5. Phone Number Input (`phone`)
**Component**: `InputMask`  
**Validation**: Phone number format validation  
**Props**: `mask="(999) 999-9999"`, `placeholder`, `value`, `onChange`

```typescript
const field: FormField = {
  id: 'phone',
  label: 'Phone Number',
  type: 'phone',
  required: true,
  placeholder: '(555) 123-4567'
}
```

### 6. Date Picker (`date`)
**Component**: `Calendar`  
**Validation**: Date format validation  
**Props**: `showIcon`, `dateFormat="mm/dd/yy"`, `value`, `onChange`

```typescript
const field: FormField = {
  id: 'birthdate',
  label: 'Date of Birth',
  type: 'date',
  required: true,
  placeholder: 'Select your birth date'
}
```

### 7. Text Area (`textarea`)
**Component**: `InputTextarea`  
**Validation**: Basic text validation  
**Props**: `rows={4}`, `placeholder`, `value`, `onChange`

```typescript
const field: FormField = {
  id: 'comments',
  label: 'Comments',
  type: 'textarea',
  required: false,
  placeholder: 'Enter your comments here'
}
```

### 8. Address Input (`address`)
**Component**: `InputText`  
**Validation**: Address format validation  
**Props**: `placeholder`, `value`, `onChange`

```typescript
const field: FormField = {
  id: 'address',
  label: 'Address',
  type: 'address',
  required: true,
  placeholder: 'Enter your full address',
  addressType: 'full'
}
```

### 9. Dropdown/Select (`select`)
**Component**: `Dropdown`  
**Validation**: Option selection validation  
**Props**: `options`, `placeholder`, `value`, `onChange`

```typescript
const field: FormField = {
  id: 'country',
  label: 'Country',
  type: 'select',
  required: true,
  placeholder: 'Select your country',
  options: ['USA', 'Canada', 'Mexico', 'UK']
}
```

### 10. Checkbox Group (`checkbox`)
**Component**: `Checkbox`  
**Validation**: Multiple selection validation  
**Props**: `options`, `value` (array), `onChange`

```typescript
const field: FormField = {
  id: 'interests',
  label: 'Interests',
  type: 'checkbox',
  required: false,
  options: ['Technology', 'Sports', 'Music', 'Travel']
}
```

### 11. Radio Button Group (`radio`)
**Component**: `RadioButton`  
**Validation**: Single selection validation  
**Props**: `options`, `value`, `onChange`

```typescript
const field: FormField = {
  id: 'gender',
  label: 'Gender',
  type: 'radio',
  required: true,
  options: ['Male', 'Female', 'Other', 'Prefer not to say']
}
```

### 12. Yes/No Question (`yesno`)
**Component**: `RadioButton`  
**Validation**: Yes/No selection validation  
**Props**: Auto-generated options `['Yes', 'No']`, `value`, `onChange`

```typescript
const field: FormField = {
  id: 'newsletter',
  label: 'Subscribe to Newsletter',
  type: 'yesno',
  required: false
  // options automatically set to ['Yes', 'No']
}
```

### 13. File Upload (`file`)
**Component**: `FileUpload`  
**Validation**: File type and size validation  
**Props**: `accept`, `maxFileSize`, `mode="basic"`, `customUpload`

```typescript
const field: FormField = {
  id: 'resume',
  label: 'Resume',
  type: 'file',
  required: true,
  placeholder: 'Upload your resume',
  allowedExtensions: ['.pdf', '.doc', '.docx'],
  maxFileSize: 5000000 // 5MB
}
```

### 14. Signature (`signature`)
**Component**: `InputText`  
**Validation**: Text-based signature validation  
**Props**: `placeholder`, `value`, `onChange`

```typescript
const field: FormField = {
  id: 'signature',
  label: 'Digital Signature',
  type: 'signature',
  required: true,
  placeholder: 'Type your full name to sign'
}
```

## Field Validation

### Built-in Validation Rules

Each field type has specific validation rules:

```typescript
// Email validation
const emailValidation = {
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  }
}

// Phone validation
const phoneValidation = {
  pattern: {
    value: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number'
  }
}

// Money validation
const moneyValidation = {
  pattern: {
    value: /^\$?[\d,]+(\.\d{2})?$/,
    message: 'Please enter a valid monetary amount'
  }
}
```

### Custom Validation

Fields can have custom validation rules:

```typescript
const field: FormField = {
  id: 'age',
  label: 'Age',
  type: 'number',
  required: true,
  validation: {
    min: 18,
    max: 120,
    pattern: /^\d+$/
  }
}
```

## Field Rendering Process

### 1. Field Validation
```typescript
const validation = FieldMCP.validateField(field)
if (!validation.success) {
  // Handle validation errors
  return
}
```

### 2. Component Selection
```typescript
const Component = FieldMCP.getComponent(field.type)
// Returns appropriate PrimeReact component
```

### 3. Props Generation
```typescript
const props = FieldMCP.getComponentProps(field, control, errors)
// Returns component-specific props
```

### 4. Component Rendering
```typescript
const result = FieldMCP.render({
  field,
  control,
  errors
})
// Returns rendered React component
```

## Error Handling

### Field Validation Errors
```typescript
interface FieldValidationError {
  code: 'FIELD_ERROR' | 'VALIDATION_ERROR'
  message: string
  field: string
  details?: {
    expected?: any
    actual?: any
    suggestion?: string
  }
  timestamp: Date
}
```

### Common Error Scenarios

1. **Missing Required Field**
```typescript
{
  code: 'VALIDATION_ERROR',
  message: 'Full Name is required',
  field: 'name',
  timestamp: new Date()
}
```

2. **Invalid Field Type**
```typescript
{
  code: 'FIELD_ERROR',
  message: 'Invalid field type: invalid_type',
  field: 'type',
  details: {
    actual: 'invalid_type',
    expected: ['text', 'email', 'number', ...]
  },
  timestamp: new Date()
}
```

3. **Missing Options for Select Field**
```typescript
{
  code: 'FIELD_ERROR',
  message: 'Field type \'select\' requires options',
  field: 'options',
  timestamp: new Date()
}
```

## Data Transformation

### Value Transformation for Display
```typescript
const displayValue = FieldMCP.transformValueForDisplay(field, value)
// Transforms stored value for UI display
```

### Value Transformation for Storage
```typescript
const storageValue = FieldMCP.transformValueForStorage(field, value)
// Transforms UI value for storage
```

### Transformation Examples

```typescript
// Date field
const dateValue = new Date('2024-12-19')
const displayValue = FieldMCP.transformValueForDisplay(dateField, dateValue)
// Result: "12/19/2024"

// Checkbox field
const checkboxValue = ['Option1', 'Option2']
const displayValue = FieldMCP.transformValueForDisplay(checkboxField, checkboxValue)
// Result: "Option1, Option2"

// Money field
const moneyValue = '1234.56'
const storageValue = FieldMCP.transformValueForStorage(moneyField, moneyValue)
// Result: 1234.56 (number)
```

## Integration with React Hook Form

### Controller Integration
```typescript
<Controller
  name={field.id}
  control={control}
  rules={FieldMCP.getValidationRules(field)}
  render={({ field: { onChange, value, onBlur } }) => (
    <FieldMCP.render({
      field,
      control: { [field.id]: { onChange, value, onBlur } },
      errors
    })
  )}
/>
```

### Validation Rules
```typescript
const rules = FieldMCP.getValidationRules(field)
// Returns React Hook Form validation rules
```

## Performance Considerations

### Component Caching
- Components are selected once per field type
- Props are generated efficiently
- Rendering is optimized for performance

### Validation Optimization
- Field validation is performed only when needed
- Validation results are cached when possible
- Error objects are created efficiently

## Best Practices

### 1. Field Definition
```typescript
// Good: Complete field definition
const field: FormField = {
  id: 'email',
  label: 'Email Address',
  type: 'email',
  required: true,
  placeholder: 'Enter your email address'
}

// Bad: Incomplete field definition
const field: FormField = {
  id: 'email',
  type: 'email'
  // Missing required properties
}
```

### 2. Error Handling
```typescript
const result = FieldMCP.render({ field, control, errors })
if (!result.success) {
  // Log error for debugging
  MCPLogger.error('renderField', result.errors?.[0])
  
  // Show user-friendly error
  return <div className="error">Failed to render field</div>
}
```

### 3. Validation
```typescript
// Validate field before rendering
const validation = FieldMCP.validateField(field)
if (!validation.success) {
  // Handle validation errors
  return
}

// Render field
const result = FieldMCP.render({ field, control, errors })
```

## Testing

### Unit Testing
```typescript
describe('FieldMCP', () => {
  it('should render text field correctly', () => {
    const field: FormField = {
      id: 'name',
      label: 'Name',
      type: 'text',
      required: true
    }
    
    const result = FieldMCP.render({ field, control: {}, errors: {} })
    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
  })
  
  it('should validate required field', () => {
    const field: FormField = {
      id: 'name',
      label: 'Name',
      type: 'text',
      required: true
    }
    
    const validation = FieldMCP.validateFieldValue(field, '')
    expect(validation.success).toBe(false)
    expect(validation.errors).toHaveLength(1)
  })
})
```

## Future Enhancements

- **Custom Field Types**: Support for user-defined field types
- **Field Templates**: Predefined field configurations
- **Advanced Validation**: Cross-field validation rules
- **Field Dependencies**: Conditional field display
- **Field Groups**: Grouped field rendering
- **Field Analytics**: Usage tracking and analytics
