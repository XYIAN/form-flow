import { ITemplateLibraryProtocol, TemplateUsageStats } from '../protocols/ITemplateLibraryProtocol'
import { MCPResult, MCPError } from '../protocols/types'
import { MCPLogger } from './logger'
import { 
	FormTemplate, 
	TemplateCategory, 
	FormLayout, 
	FormField,
	TemplateMetadata,
	FormField as FieldType
} from '@/types'

export class TemplateLibraryMCP implements ITemplateLibraryProtocol {
	private static templates: FormTemplate[] = []
	private static usageStats: Map<string, TemplateUsageStats> = new Map()

	/**
	 * Initialize the template library with default templates
	 */
	static initialize(): MCPResult<boolean> {
		const startTime = performance.now()
		
		try {
			MCPLogger.info('TemplateLibraryMCP.initialize', 'Initializing template library system')

			// Create default templates
			const defaultTemplates = this.createDefaultTemplates()
			this.templates = defaultTemplates

			// Initialize usage stats
			this.templates.forEach(template => {
				this.usageStats.set(template.id, {
					templateId: template.id,
					usageCount: 0,
					lastUsed: new Date(),
					averageRating: 0,
					ratingCount: 0,
					completionRate: 0
				})
			})

			const executionTime = performance.now() - startTime
			MCPLogger.info('TemplateLibraryMCP.initialize', 'Template library initialized successfully', { 
				templatesCount: this.templates.length 
			}, executionTime)

			return {
				success: true,
				data: true,
				metadata: { executionTime }
			}
		} catch (error) {
			const executionTime = performance.now() - startTime
			MCPLogger.error('TemplateLibraryMCP.initialize', error as Error, { executionTime })
			
			return {
				success: false,
				error: {
					code: 'INITIALIZATION_ERROR',
					message: 'Failed to initialize template library system',
					details: { error: (error as Error).message },
					timestamp: new Date()
				}
			}
		}
	}

	/**
	 * Get all available form templates
	 */
	static getTemplates(): MCPResult<FormTemplate[]> {
		const startTime = performance.now()
		
		try {
			MCPLogger.debug('TemplateLibraryMCP.getTemplates', 'Retrieving all templates')

			const executionTime = performance.now() - startTime
			MCPLogger.debug('TemplateLibraryMCP.getTemplates', 'Templates retrieved successfully', { 
				count: this.templates.length 
			}, executionTime)

			return {
				success: true,
				data: [...this.templates],
				metadata: { executionTime }
			}
		} catch (error) {
			const executionTime = performance.now() - startTime
			MCPLogger.error('TemplateLibraryMCP.getTemplates', error as Error, { executionTime })
			
			return {
				success: false,
				error: {
					code: 'TEMPLATE_RETRIEVAL_ERROR',
					message: 'Failed to retrieve templates',
					details: { error: (error as Error).message },
					timestamp: new Date()
				}
			}
		}
	}

	/**
	 * Get a specific template by ID
	 */
	static getTemplate(templateId: string): MCPResult<FormTemplate> {
		const startTime = performance.now()
		
		try {
			MCPLogger.debug('TemplateLibraryMCP.getTemplate', 'Retrieving template', { templateId })

			const template = this.templates.find(template => template.id === templateId)
			if (!template) {
				const executionTime = performance.now() - startTime
				MCPLogger.warn('TemplateLibraryMCP.getTemplate', 'Template not found', { templateId }, executionTime)
				
				return {
					success: false,
					error: {
						code: 'TEMPLATE_NOT_FOUND',
						message: `Template with ID '${templateId}' not found`,
						details: { templateId },
						timestamp: new Date()
					}
				}
			}

			const executionTime = performance.now() - startTime
			MCPLogger.debug('TemplateLibraryMCP.getTemplate', 'Template retrieved successfully', { 
				templateId,
				fieldsCount: template.fields.length 
			}, executionTime)

			return {
				success: true,
				data: { ...template },
				metadata: { executionTime }
			}
		} catch (error) {
			const executionTime = performance.now() - startTime
			MCPLogger.error('TemplateLibraryMCP.getTemplate', error as Error, { templateId, executionTime })
			
			return {
				success: false,
				error: {
					code: 'TEMPLATE_RETRIEVAL_ERROR',
					message: 'Failed to retrieve template',
					details: { templateId, error: (error as Error).message },
					timestamp: new Date()
				}
			}
		}
	}

	/**
	 * Get templates by category
	 */
	static getTemplatesByCategory(category: TemplateCategory): MCPResult<FormTemplate[]> {
		const startTime = performance.now()
		
		try {
			MCPLogger.debug('TemplateLibraryMCP.getTemplatesByCategory', 'Retrieving templates by category', { category })

			const templates = this.templates.filter(template => template.category === category)

			const executionTime = performance.now() - startTime
			MCPLogger.debug('TemplateLibraryMCP.getTemplatesByCategory', 'Templates retrieved successfully', { 
				category,
				count: templates.length 
			}, executionTime)

			return {
				success: true,
				data: [...templates],
				metadata: { executionTime }
			}
		} catch (error) {
			const executionTime = performance.now() - startTime
			MCPLogger.error('TemplateLibraryMCP.getTemplatesByCategory', error as Error, { category, executionTime })
			
			return {
				success: false,
				error: {
					code: 'TEMPLATE_RETRIEVAL_ERROR',
					message: 'Failed to retrieve templates by category',
					details: { category, error: (error as Error).message },
					timestamp: new Date()
				}
			}
		}
	}

	/**
	 * Search templates by name, description, or tags
	 */
	static searchTemplates(query: string): MCPResult<FormTemplate[]> {
		const startTime = performance.now()
		
		try {
			MCPLogger.debug('TemplateLibraryMCP.searchTemplates', 'Searching templates', { query })

			const searchTerm = query.toLowerCase()
			const results = this.templates.filter(template => 
				template.name.toLowerCase().includes(searchTerm) ||
				template.description.toLowerCase().includes(searchTerm) ||
				template.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm))
			)

			const executionTime = performance.now() - startTime
			MCPLogger.debug('TemplateLibraryMCP.searchTemplates', 'Search completed successfully', { 
				query,
				resultsCount: results.length 
			}, executionTime)

			return {
				success: true,
				data: [...results],
				metadata: { executionTime }
			}
		} catch (error) {
			const executionTime = performance.now() - startTime
			MCPLogger.error('TemplateLibraryMCP.searchTemplates', error as Error, { query, executionTime })
			
			return {
				success: false,
				error: {
					code: 'SEARCH_ERROR',
					message: 'Failed to search templates',
					details: { query, error: (error as Error).message },
					timestamp: new Date()
				}
			}
		}
	}

	/**
	 * Validate template configuration
	 */
	static validateTemplate(template: FormTemplate): MCPResult<boolean> {
		const startTime = performance.now()
		const errors: MCPError[] = []

		try {
			MCPLogger.debug('TemplateLibraryMCP.validateTemplate', 'Validating template', { templateId: template.id })

			// Validate required fields
			if (!template.id) {
				errors.push({
					code: 'TEMPLATE_ERROR',
					message: 'Template ID is required',
					field: 'id',
					timestamp: new Date()
				})
			}

			if (!template.name?.trim()) {
				errors.push({
					code: 'TEMPLATE_ERROR',
					message: 'Template name is required',
					field: 'name',
					timestamp: new Date()
				})
			}

			if (!template.category) {
				errors.push({
					code: 'TEMPLATE_ERROR',
					message: 'Template category is required',
					field: 'category',
					timestamp: new Date()
				})
			}

			// Validate layout
			if (!template.layout) {
				errors.push({
					code: 'TEMPLATE_ERROR',
					message: 'Template layout is required',
					field: 'layout',
					timestamp: new Date()
				})
			}

			// Validate fields
			if (!template.fields || template.fields.length === 0) {
				errors.push({
					code: 'TEMPLATE_ERROR',
					message: 'Template must have at least one field',
					field: 'fields',
					timestamp: new Date()
				})
			}

			// Validate metadata
			if (!template.metadata) {
				errors.push({
					code: 'TEMPLATE_ERROR',
					message: 'Template metadata is required',
					field: 'metadata',
					timestamp: new Date()
				})
			}

			const executionTime = performance.now() - startTime
			
			if (errors.length > 0) {
				MCPLogger.warn('TemplateLibraryMCP.validateTemplate', 'Template validation failed', { 
					templateId: template.id,
					errorsCount: errors.length 
				}, executionTime)
				
				return {
					success: false,
					errors,
					metadata: { executionTime }
				}
			}

			MCPLogger.debug('TemplateLibraryMCP.validateTemplate', 'Template validation successful', { 
				templateId: template.id 
			}, executionTime)

			return {
				success: true,
				data: true,
				metadata: { executionTime }
			}
		} catch (error) {
			const executionTime = performance.now() - startTime
			MCPLogger.error('TemplateLibraryMCP.validateTemplate', error as Error, { 
				templateId: template.id, 
				executionTime 
			})
			
			return {
				success: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: 'Failed to validate template',
					details: { templateId: template.id, error: (error as Error).message },
					timestamp: new Date()
				}
			}
		}
	}

	/**
	 * Get template categories
	 */
	static getTemplateCategories(): MCPResult<TemplateCategory[]> {
		const startTime = performance.now()
		
		try {
			MCPLogger.debug('TemplateLibraryMCP.getTemplateCategories', 'Retrieving template categories')

			const categories: TemplateCategory[] = [
				'legal',
				'medical',
				'business',
				'education',
				'survey',
				'contact',
				'registration',
				'feedback',
				'custom'
			]

			const executionTime = performance.now() - startTime
			MCPLogger.debug('TemplateLibraryMCP.getTemplateCategories', 'Template categories retrieved successfully', { 
				count: categories.length 
			}, executionTime)

			return {
				success: true,
				data: categories,
				metadata: { executionTime }
			}
		} catch (error) {
			const executionTime = performance.now() - startTime
			MCPLogger.error('TemplateLibraryMCP.getTemplateCategories', error as Error, { executionTime })
			
			return {
				success: false,
				error: {
					code: 'CATEGORIES_ERROR',
					message: 'Failed to retrieve template categories',
					details: { error: (error as Error).message },
					timestamp: new Date()
				}
			}
		}
	}

	/**
	 * Create default templates for the library
	 */
	private static createDefaultTemplates(): FormTemplate[] {
		return [
			{
				id: 'contact-form-template',
				name: 'Contact Form',
				description: 'Basic contact form with name, email, and message fields',
				category: 'contact',
				preview: 'Contact form with name, email, and message fields',
				layout: {
					id: 'single-column-layout',
					name: 'Single Column',
					description: 'Simple single-column layout',
					type: 'single-column',
					sections: [
						{
							id: 'main-section',
							name: 'Main Content',
							type: 'content',
							columns: [
								{
									id: 'main-column',
									width: 12,
									fields: ['name-field', 'email-field', 'message-field'],
									style: {}
								}
							],
							style: { padding: '1rem' },
							behavior: {}
						}
					],
					metadata: {
						author: 'Form Flow',
						version: '1.0.0',
						tags: ['basic', 'single-column'],
						responsive: true,
						accessibility: true
					}
				},
				fields: [
					{
						id: 'name-field',
						label: 'Full Name',
						type: 'text',
						required: true,
						placeholder: 'Enter your full name'
					},
					{
						id: 'email-field',
						label: 'Email Address',
						type: 'email',
						required: true,
						placeholder: 'Enter your email address'
					},
					{
						id: 'message-field',
						label: 'Message',
						type: 'textarea',
						required: true,
						placeholder: 'Enter your message',
						textareaRows: 5
					}
				],
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['contact', 'basic', 'simple'],
					difficulty: 'beginner',
					estimatedTime: 5,
					features: ['Name field', 'Email validation', 'Message textarea'],
					requirements: ['Basic form knowledge']
				}
			},
			{
				id: 'registration-form-template',
				name: 'User Registration',
				description: 'Complete user registration form with personal and contact information',
				category: 'registration',
				preview: 'User registration form with personal and contact information',
				layout: {
					id: 'two-column-layout',
					name: 'Two Column',
					description: 'Two-column layout for organized forms',
					type: 'two-column',
					sections: [
						{
							id: 'main-section',
							name: 'Main Content',
							type: 'content',
							columns: [
								{
									id: 'left-column',
									width: 6,
									fields: ['first-name-field', 'last-name-field', 'email-field', 'phone-field'],
									style: { padding: '0.5rem' }
								},
								{
									id: 'right-column',
									width: 6,
									fields: ['password-field', 'confirm-password-field', 'terms-field'],
									style: { padding: '0.5rem' }
								}
							],
							style: { padding: '1rem' },
							behavior: {}
						}
					],
					metadata: {
						author: 'Form Flow',
						version: '1.0.0',
						tags: ['two-column', 'organized'],
						responsive: true,
						accessibility: true
					}
				},
				fields: [
					{
						id: 'first-name-field',
						label: 'First Name',
						type: 'text',
						required: true,
						placeholder: 'Enter your first name'
					},
					{
						id: 'last-name-field',
						label: 'Last Name',
						type: 'text',
						required: true,
						placeholder: 'Enter your last name'
					},
					{
						id: 'email-field',
						label: 'Email Address',
						type: 'email',
						required: true,
						placeholder: 'Enter your email address'
					},
					{
						id: 'phone-field',
						label: 'Phone Number',
						type: 'phone',
						required: false,
						placeholder: '(555) 123-4567'
					},
					{
						id: 'password-field',
						label: 'Password',
						type: 'password',
						required: true,
						placeholder: 'Enter your password'
					},
					{
						id: 'confirm-password-field',
						label: 'Confirm Password',
						type: 'password',
						required: true,
						placeholder: 'Confirm your password'
					},
					{
						id: 'terms-field',
						label: 'I agree to the terms and conditions',
						type: 'yesno',
						required: true,
						options: ['Yes', 'No']
					}
				],
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['registration', 'user', 'account'],
					difficulty: 'intermediate',
					estimatedTime: 10,
					features: ['Personal information', 'Contact details', 'Password security', 'Terms agreement'],
					requirements: ['Email validation', 'Password confirmation', 'Terms acceptance']
				}
			},
			{
				id: 'feedback-form-template',
				name: 'Customer Feedback',
				description: 'Comprehensive feedback form with rating and comments',
				category: 'feedback',
				preview: 'Customer feedback form with rating and comments',
				layout: {
					id: 'single-column-layout',
					name: 'Single Column',
					description: 'Simple single-column layout',
					type: 'single-column',
					sections: [
						{
							id: 'main-section',
							name: 'Main Content',
							type: 'content',
							columns: [
								{
									id: 'main-column',
									width: 12,
									fields: ['service-rating-field', 'experience-field', 'improvements-field', 'contact-field'],
									style: {}
								}
							],
							style: { padding: '1rem' },
							behavior: {}
						}
					],
					metadata: {
						author: 'Form Flow',
						version: '1.0.0',
						tags: ['basic', 'single-column'],
						responsive: true,
						accessibility: true
					}
				},
				fields: [
					{
						id: 'service-rating-field',
						label: 'How would you rate our service?',
						type: 'rating',
						required: true,
						ratingMax: 5,
						ratingIcons: 'star'
					},
					{
						id: 'experience-field',
						label: 'Tell us about your experience',
						type: 'textarea',
						required: true,
						placeholder: 'Share your experience with us',
						textareaRows: 4
					},
					{
						id: 'improvements-field',
						label: 'What could we improve?',
						type: 'textarea',
						required: false,
						placeholder: 'Suggestions for improvement',
						textareaRows: 3
					},
					{
						id: 'contact-field',
						label: 'Would you like us to contact you?',
						type: 'yesno',
						required: false,
						options: ['Yes', 'No']
					}
				],
				metadata: {
					author: 'Form Flow',
					version: '1.0.0',
					tags: ['feedback', 'rating', 'customer'],
					difficulty: 'beginner',
					estimatedTime: 8,
					features: ['Service rating', 'Experience feedback', 'Improvement suggestions', 'Contact preference'],
					requirements: ['Rating system', 'Text feedback', 'Optional contact']
				}
			}
		]
	}
}
