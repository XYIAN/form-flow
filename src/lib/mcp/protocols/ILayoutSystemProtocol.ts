import { MCPResult } from './types'
import { FormLayout, FormSection, FormColumn, LayoutType } from '@/types'

export interface ILayoutSystemProtocol {
	/**
	 * Get all available layout templates
	 */
	getLayouts(): MCPResult<FormLayout[]>

	/**
	 * Get a specific layout by ID
	 */
	getLayout(layoutId: string): MCPResult<FormLayout>

	/**
	 * Get layouts by type
	 */
	getLayoutsByType(type: LayoutType): MCPResult<FormLayout[]>

	/**
	 * Create a new layout
	 */
	createLayout(layout: Omit<FormLayout, 'id'>): MCPResult<FormLayout>

	/**
	 * Update an existing layout
	 */
	updateLayout(
		layoutId: string,
		updates: Partial<FormLayout>
	): MCPResult<FormLayout>

	/**
	 * Delete a layout
	 */
	deleteLayout(layoutId: string): MCPResult<boolean>

	/**
	 * Clone a layout with modifications
	 */
	cloneLayout(
		layoutId: string,
		modifications: Partial<FormLayout>
	): MCPResult<FormLayout>

	/**
	 * Validate layout configuration
	 */
	validateLayout(layout: FormLayout): MCPResult<boolean>

	/**
	 * Get layout preview
	 */
	getLayoutPreview(layoutId: string): MCPResult<string>

	/**
	 * Add section to layout
	 */
	addSection(
		layoutId: string,
		section: Omit<FormSection, 'id'>
	): MCPResult<FormSection>

	/**
	 * Update section in layout
	 */
	updateSection(
		sectionId: string,
		updates: Partial<FormSection>
	): MCPResult<FormSection>

	/**
	 * Remove section from layout
	 */
	removeSection(sectionId: string): MCPResult<boolean>

	/**
	 * Reorder sections in layout
	 */
	reorderSections(layoutId: string, sectionIds: string[]): MCPResult<boolean>

	/**
	 * Add column to section
	 */
	addColumn(
		sectionId: string,
		column: Omit<FormColumn, 'id'>
	): MCPResult<FormColumn>

	/**
	 * Update column in section
	 */
	updateColumn(
		columnId: string,
		updates: Partial<FormColumn>
	): MCPResult<FormColumn>

	/**
	 * Remove column from section
	 */
	removeColumn(columnId: string): MCPResult<boolean>

	/**
	 * Add field to column
	 */
	addFieldToColumn(columnId: string, fieldId: string): MCPResult<boolean>

	/**
	 * Remove field from column
	 */
	removeFieldFromColumn(columnId: string, fieldId: string): MCPResult<boolean>

	/**
	 * Move field between columns
	 */
	moveFieldToColumn(
		fieldId: string,
		fromColumnId: string,
		toColumnId: string
	): MCPResult<boolean>

	/**
	 * Get responsive breakpoints for layout
	 */
	getResponsiveBreakpoints(layoutId: string): MCPResult<ResponsiveBreakpoints>

	/**
	 * Validate responsive layout
	 */
	validateResponsiveLayout(layoutId: string): MCPResult<boolean>

	/**
	 * Export layout
	 */
	exportLayout(layoutId: string, format: 'json' | 'yaml'): MCPResult<string>

	/**
	 * Import layout
	 */
	importLayout(data: string, format: 'json' | 'yaml'): MCPResult<FormLayout>
}

export interface ResponsiveBreakpoints {
	mobile: { maxWidth: number; columns: number }
	tablet: { minWidth: number; maxWidth: number; columns: number }
	desktop: { minWidth: number; columns: number }
}
