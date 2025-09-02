import { MCPResult } from './types'
import {
	FormTemplate,
	TemplateCategory,
	FormLayout,
	FormField,
	TemplateMetadata,
} from '@/types'

export interface ITemplateLibraryProtocol {
	/**
	 * Get all available form templates
	 */
	getTemplates(): MCPResult<FormTemplate[]>

	/**
	 * Get a specific template by ID
	 */
	getTemplate(templateId: string): MCPResult<FormTemplate>

	/**
	 * Get templates by category
	 */
	getTemplatesByCategory(category: TemplateCategory): MCPResult<FormTemplate[]>

	/**
	 * Search templates by name, description, or tags
	 */
	searchTemplates(query: string): MCPResult<FormTemplate[]>

	/**
	 * Create a new template
	 */
	createTemplate(template: Omit<FormTemplate, 'id'>): MCPResult<FormTemplate>

	/**
	 * Update an existing template
	 */
	updateTemplate(
		templateId: string,
		updates: Partial<FormTemplate>
	): MCPResult<FormTemplate>

	/**
	 * Delete a template
	 */
	deleteTemplate(templateId: string): MCPResult<boolean>

	/**
	 * Clone a template with modifications
	 */
	cloneTemplate(
		templateId: string,
		modifications: Partial<FormTemplate>
	): MCPResult<FormTemplate>

	/**
	 * Validate template configuration
	 */
	validateTemplate(template: FormTemplate): MCPResult<boolean>

	/**
	 * Get template preview
	 */
	getTemplatePreview(templateId: string): MCPResult<string>

	/**
	 * Get template fields
	 */
	getTemplateFields(templateId: string): MCPResult<FormField[]>

	/**
	 * Get template layout
	 */
	getTemplateLayout(templateId: string): MCPResult<FormLayout>

	/**
	 * Add field to template
	 */
	addFieldToTemplate(templateId: string, field: FormField): MCPResult<boolean>

	/**
	 * Remove field from template
	 */
	removeFieldFromTemplate(
		templateId: string,
		fieldId: string
	): MCPResult<boolean>

	/**
	 * Update field in template
	 */
	updateFieldInTemplate(
		templateId: string,
		fieldId: string,
		updates: Partial<FormField>
	): MCPResult<boolean>

	/**
	 * Reorder fields in template
	 */
	reorderTemplateFields(
		templateId: string,
		fieldIds: string[]
	): MCPResult<boolean>

	/**
	 * Get template metadata
	 */
	getTemplateMetadata(templateId: string): MCPResult<TemplateMetadata>

	/**
	 * Update template metadata
	 */
	updateTemplateMetadata(
		templateId: string,
		metadata: Partial<TemplateMetadata>
	): MCPResult<boolean>

	/**
	 * Get template categories
	 */
	getTemplateCategories(): MCPResult<TemplateCategory[]>

	/**
	 * Get templates by difficulty level
	 */
	getTemplatesByDifficulty(
		difficulty: 'beginner' | 'intermediate' | 'advanced'
	): MCPResult<FormTemplate[]>

	/**
	 * Get templates by estimated time
	 */
	getTemplatesByTimeRange(
		minMinutes: number,
		maxMinutes: number
	): MCPResult<FormTemplate[]>

	/**
	 * Export template
	 */
	exportTemplate(templateId: string, format: 'json' | 'yaml'): MCPResult<string>

	/**
	 * Import template
	 */
	importTemplate(data: string, format: 'json' | 'yaml'): MCPResult<FormTemplate>

	/**
	 * Get template usage statistics
	 */
	getTemplateUsageStats(templateId: string): MCPResult<TemplateUsageStats>

	/**
	 * Get popular templates
	 */
	getPopularTemplates(limit?: number): MCPResult<FormTemplate[]>

	/**
	 * Get recent templates
	 */
	getRecentTemplates(limit?: number): MCPResult<FormTemplate[]>
}

export interface TemplateUsageStats {
	templateId: string
	usageCount: number
	lastUsed: Date
	averageRating: number
	ratingCount: number
	completionRate: number
}
