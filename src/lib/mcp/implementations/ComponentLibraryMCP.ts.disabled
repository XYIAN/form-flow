import { IComponentLibraryProtocol } from '../protocols/IComponentLibraryProtocol'
import { MCPResult, MCPError } from '../protocols/types'
import { MCPLogger } from './logger'
import { CSVParserMCP, CSVData } from './CSVParserMCP'
import { FieldTypeDetectorMCP } from './FieldTypeDetectorMCP'
import {
	ComponentLibrary,
	FormComponent,
	ComponentCategory,
	ComponentProps,
	CSVComponentMapping,
	FieldType,
} from '@/types'

export class ComponentLibraryMCP implements IComponentLibraryProtocol {
	private static libraries: ComponentLibrary[] = []
	private static components: FormComponent[] = []

	// ... existing methods ...

	/**
	 * Import components from CSV data
	 */
	static importFromCSV(
		csvContent: string,
		mapping?: CSVComponentMapping
	): MCPResult<FormComponent[]> {
		const startTime = performance.now()

		try {
			MCPLogger.info(
				'ComponentLibraryMCP.importFromCSV',
				'Importing components from CSV',
				{ hasMapping: !!mapping }
			)

			// Parse CSV
			const parseResult = CSVParserMCP.parseCSV(csvContent)
			if (!parseResult.success || !parseResult.data) {
				return {
					success: false,
					errors: parseResult.errors,
					metadata: { executionTime: performance.now() - startTime },
				}
			}

			// Analyze CSV structure
			const analysisResult = CSVParserMCP.analyzeCSV(parseResult.data)
			if (!analysisResult.success || !analysisResult.data) {
				return {
					success: false,
					errors: analysisResult.errors,
					metadata: { executionTime: performance.now() - startTime },
				}
			}

			// Create detection contexts
			const detectionContexts = this.createDetectionContexts(
				parseResult.data,
				analysisResult.data
			)

			// Detect field types
			const detectionResult =
				FieldTypeDetectorMCP.batchDetectFieldTypes(detectionContexts)
			if (!detectionResult.success || !detectionResult.data) {
				return {
					success: false,
					errors: detectionResult.errors,
					metadata: { executionTime: performance.now() - startTime },
				}
			}

			// Convert detected fields to components
			const components = this.convertToComponents(
				parseResult.data,
				detectionResult.data,
				mapping
			)

			const executionTime = performance.now() - startTime
			MCPLogger.info(
				'ComponentLibraryMCP.importFromCSV',
				'Components imported successfully',
				{
					count: components.length,
					executionTime,
				}
			)

			return {
				success: true,
				data: components,
				metadata: { executionTime },
			}
		} catch (error) {
			const executionTime = performance.now() - startTime
			MCPLogger.error('ComponentLibraryMCP.importFromCSV', error as Error, {
				executionTime,
			})

			return {
				success: false,
				errors: [
					{
						code: 'IMPORT_ERROR',
						message: 'Failed to import components from CSV',
						details: { error: (error as Error).message },
						timestamp: new Date(),
					},
				],
				metadata: { executionTime },
			}
		}
	}

	/**
	 * Create detection contexts for field type detection
	 */
	private static createDetectionContexts(csvData: CSVData, analysis: any) {
		return csvData.headers.map((header, index) => ({
			fieldName: header,
			sampleData: csvData.rows.map(row => row[index]),
			patterns: analysis.patterns.filter(p => p.columnIndex === index),
			dataType: analysis.dataTypes[index],
		}))
	}

	/**
	 * Convert detected fields to components
	 */
	private static convertToComponents(
		csvData: CSVData,
		detectedTypes: FieldType[],
		mapping?: CSVComponentMapping
	): FormComponent[] {
		return csvData.headers.map((header, index) => {
			const fieldType = detectedTypes[index]
			const category = this.determineCategory(fieldType)

			const component: FormComponent = {
				id: `csv-${header}-${Date.now()}`,
				name: this.formatComponentName(header),
				description: `Generated from CSV column: ${header}`,
				category,
				type: fieldType,
				icon: this.getIconForType(fieldType),
				preview: `${this.formatComponentName(header)} Field`,
				props: this.generateDefaultProps(
					fieldType,
					mapping?.columnMappings?.[header]
				),
				validation: this.generateDefaultValidation(fieldType),
				metadata: {
					author: 'Form Flow CSV Import',
					version: '1.0.0',
					tags: [header, fieldType, category],
					documentation: `Component generated from CSV column: ${header}`,
					source: {
						type: 'csv',
						columnName: header,
						sampleData: csvData.rows.slice(0, 3).map(row => row[index]),
					},
				},
			}

			return component
		})
	}

	/**
	 * Determine component category based on field type
	 */
	private static determineCategory(fieldType: FieldType): ComponentCategory {
		switch (fieldType) {
			case 'email':
			case 'phone':
			case 'address':
				return 'contact'
			case 'number':
			case 'money':
			case 'percentage':
				return 'financial'
			case 'date':
			case 'time':
			case 'datetime':
				return 'datetime'
			case 'select':
			case 'multiselect':
			case 'radio':
			case 'checkbox':
				return 'choice'
			case 'file':
			case 'image':
				return 'media'
			default:
				return 'basic'
		}
	}

	/**
	 * Format component name from CSV header
	 */
	private static formatComponentName(header: string): string {
		return header
			.split(/[_\s-]+/)
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ')
	}

	/**
	 * Get icon for field type
	 */
	private static getIconForType(fieldType: FieldType): string {
		const iconMap: Record<FieldType, string> = {
			text: 'pi pi-pencil',
			email: 'pi pi-envelope',
			phone: 'pi pi-phone',
			number: 'pi pi-hashtag',
			money: 'pi pi-dollar',
			date: 'pi pi-calendar',
			time: 'pi pi-clock',
			datetime: 'pi pi-calendar-plus',
			select: 'pi pi-list',
			multiselect: 'pi pi-th-large',
			radio: 'pi pi-circle',
			checkbox: 'pi pi-check-square',
			file: 'pi pi-file',
			image: 'pi pi-image',
			address: 'pi pi-map-marker',
			url: 'pi pi-link',
			password: 'pi pi-lock',
			color: 'pi pi-palette',
			percentage: 'pi pi-percentage',
			rating: 'pi pi-star',
			tags: 'pi pi-tags',
			switch: 'pi pi-toggle-on',
			slider: 'pi pi-sliders-h',
			textarea: 'pi pi-align-left',
			editor: 'pi pi-pencil',
			mask: 'pi pi-shield',
			search: 'pi pi-search',
			chips: 'pi pi-plus-circle',
			knob: 'pi pi-circle',
			listbox: 'pi pi-bars',
			dropdown: 'pi pi-chevron-down',
		}

		return iconMap[fieldType] || 'pi pi-pencil'
	}

	/**
	 * Generate default props for component
	 */
	private static generateDefaultProps(
		fieldType: FieldType,
		mapping?: any
	): ComponentProps {
		const props: ComponentProps = {
			required: false,
			placeholder: `Enter ${fieldType}...`,
			validation: this.generateDefaultValidation(fieldType),
		}

		if (mapping) {
			Object.assign(props, mapping)
		}

		return props
	}

	/**
	 * Generate default validation rules for field type
	 */
	private static generateDefaultValidation(fieldType: FieldType) {
		const validationMap: Record<FieldType, any> = {
			email: {
				rules: [
					{ type: 'email', message: 'Please enter a valid email address' },
				],
				messages: {
					required: 'Email is required',
					invalid: 'Please enter a valid email address',
				},
			},
			phone: {
				rules: [
					{
						type: 'pattern',
						value: '^[\\d\\s\\-\\(\\)\\+]+$',
						message: 'Please enter a valid phone number',
					},
				],
				messages: {
					required: 'Phone number is required',
					invalid: 'Please enter a valid phone number',
				},
			},
			money: {
				rules: [{ type: 'number', message: 'Please enter a valid amount' }],
				messages: {
					required: 'Amount is required',
					invalid: 'Please enter a valid amount',
				},
			},
			// Add more field type validations as needed
		}

		return (
			validationMap[fieldType] || {
				rules: [{ type: 'required', message: 'This field is required' }],
				messages: {
					required: 'This field is required',
					invalid: 'Please enter valid input',
				},
			}
		)
	}
}
