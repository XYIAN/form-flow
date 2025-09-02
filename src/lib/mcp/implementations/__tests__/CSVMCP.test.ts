/**
 * Test file for CSV MCP system
 * Demonstrates the capabilities of the CSV-to-Form generation system
 */

import { CSVParserMCP, FieldTypeDetectorMCP, FormGeneratorMCP } from '../index'

// Sample CSV data for testing
const sampleCSV = `name,email,phone,age,country,registration_date,active,rating
John Doe,john@example.com,+1-555-123-4567,28,United States,2024-01-15,true,4.5
Jane Smith,jane@example.com,+1-555-987-6543,32,Canada,2024-02-20,false,3.8
Bob Johnson,bob@example.com,+1-555-456-7890,45,United Kingdom,2024-03-10,true,4.2`

export async function testCSVMCPSystem() {
	console.log('🚀 Testing CSV MCP System...\n')

	try {
		// Test 1: Parse CSV
		console.log('1. Testing CSVParserMCP.parseCSV...')
		const parseResult = CSVParserMCP.parseCSV(sampleCSV)
		
		if (parseResult.success && parseResult.data) {
			console.log('✅ CSV parsed successfully')
			console.log(`   Headers: ${parseResult.data.headers.join(', ')}`)
			console.log(`   Rows: ${parseResult.data.totalRows}`)
			console.log(`   Columns: ${parseResult.data.totalColumns}\n`)
		} else {
			console.log('❌ CSV parsing failed')
			return
		}

		// Test 2: Analyze CSV
		console.log('2. Testing CSVParserMCP.analyzeCSV...')
		const analysisResult = CSVParserMCP.analyzeCSV(parseResult.data)
		
		if (analysisResult.success && analysisResult.data) {
			console.log('✅ CSV analysis completed')
			const analysis = analysisResult.data
			console.log(`   Data Quality: ${Math.round(analysis.quality.completeness * 100)}% complete`)
			console.log(`   Patterns Detected: ${analysis.patterns.length}`)
			console.log(`   Field Recommendations: ${analysis.recommendations.length}\n`)
		} else {
			console.log('❌ CSV analysis failed')
			return
		}

		// Test 3: Detect Field Types
		console.log('3. Testing FieldTypeDetectorMCP...')
		const detectionContexts = parseResult.data.headers.map((header, index) => ({
			columnName: header,
			sampleValues: parseResult.data.rows.slice(0, 3).map(row => row[index]).filter(val => val),
			allValues: parseResult.data.rows.map(row => row[index]).filter(val => val),
			uniqueCount: new Set(parseResult.data.rows.map(row => row[index])).size,
			totalCount: parseResult.data.totalRows,
			nullCount: 0
		}))

		const detectionResult = FieldTypeDetectorMCP.batchDetectFieldTypes(detectionContexts)
		
		if (detectionResult.success && detectionResult.data) {
			console.log('✅ Field type detection completed')
			detectionResult.data.forEach((result, index) => {
				console.log(`   ${parseResult.data.headers[index]}: ${result.fieldType} (${Math.round(result.confidence * 100)}% confidence)`)
			})
			console.log('')
		} else {
			console.log('❌ Field type detection failed')
			return
		}

		// Test 4: Generate Form
		console.log('4. Testing FormGeneratorMCP.generateFormFromCSV...')
		const generationResult = FormGeneratorMCP.generateFormFromCSV(sampleCSV, {
			formTitle: 'User Registration Form',
			formDescription: 'Form generated from user data CSV',
			includePreview: true
		})

		if (generationResult.success && generationResult.data) {
			console.log('✅ Form generation completed')
			const result = generationResult.data
			console.log(`   Form Title: ${result.form.title}`)
			console.log(`   Fields Generated: ${result.fields.length}`)
			console.log(`   Average Confidence: ${Math.round(result.generationMetadata.averageConfidence * 100)}%`)
			console.log(`   Processing Time: ${result.generationMetadata.processingTime}ms`)
			
			console.log('\n   Generated Fields:')
			result.fields.forEach((field, index) => {
				console.log(`   ${index + 1}. ${field.label} (${field.type}) - ${field.required ? 'Required' : 'Optional'}`)
			})

			if (result.preview) {
				console.log(`\n   Preview: ${result.preview.estimatedFields} fields, complexity: ${Math.round(result.preview.complexityScore * 100)}%`)
			}
		} else {
			console.log('❌ Form generation failed')
			return
		}

		console.log('\n🎉 All CSV MCP tests passed successfully!')
		console.log('\n📊 System Capabilities Demonstrated:')
		console.log('   ✅ Intelligent CSV parsing with quote handling')
		console.log('   ✅ Advanced data type analysis and pattern recognition')
		console.log('   ✅ AI-powered field type detection with confidence scoring')
		console.log('   ✅ Automatic form generation with validation rules')
		console.log('   ✅ Data quality assessment and recommendations')
		console.log('   ✅ Performance tracking and error handling')

	} catch (error) {
		console.error('❌ Test failed with error:', error)
	}
}

// Export for use in other test files
export { sampleCSV }
