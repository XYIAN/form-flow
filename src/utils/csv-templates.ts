/**
 * CSV Template Generator
 * 
 * Generates sample CSV templates for different form types
 */

import { CSVTemplate, FieldType } from '@/types' // FieldType used in fieldTypes arrays

export const CSV_TEMPLATES: Record<string, CSVTemplate> = {
	contact: {
		name: 'Contact Information Form',
		description: 'Basic contact information collection form',
		headers: ['name', 'email', 'phone', 'company', 'position', 'address', 'city', 'state', 'zipcode', 'country'],
		sampleData: [
			['John Doe', 'john@example.com', '(555) 123-4567', 'Acme Corp', 'Manager', '123 Main St', 'New York', 'NY', '10001', 'United States'],
			['Jane Smith', 'jane@example.com', '(555) 987-6543', 'Tech Inc', 'Developer', '456 Oak Ave', 'San Francisco', 'CA', '94102', 'United States'],
			['Bob Johnson', 'bob@example.com', '(555) 456-7890', 'Design Co', 'Designer', '789 Pine Rd', 'Austin', 'TX', '73301', 'United States']
		],
		fieldTypes: ['text', 'email', 'phone', 'text', 'text', 'address', 'text', 'state', 'zipcode', 'country'],
		instructions: 'This template includes common contact fields. Replace the sample data with your actual data, keeping the header row intact.'
	},
	
	registration: {
		name: 'Event Registration Form',
		description: 'Event registration with attendee information',
		headers: ['first_name', 'last_name', 'email', 'phone', 'company', 'dietary_restrictions', 'emergency_contact', 'emergency_phone', 'registration_date', 'payment_status'],
		sampleData: [
			['John', 'Doe', 'john@example.com', '(555) 123-4567', 'Acme Corp', 'Vegetarian', 'Jane Doe', '(555) 123-4568', '2024-01-15', 'Paid'],
			['Jane', 'Smith', 'jane@example.com', '(555) 987-6543', 'Tech Inc', 'None', 'John Smith', '(555) 987-6544', '2024-01-16', 'Pending'],
			['Bob', 'Johnson', 'bob@example.com', '(555) 456-7890', 'Design Co', 'Gluten-Free', 'Mary Johnson', '(555) 456-7891', '2024-01-17', 'Paid']
		],
		fieldTypes: ['text', 'text', 'email', 'phone', 'text', 'textarea', 'text', 'phone', 'date', 'select'],
		instructions: 'Perfect for event registrations. Include dietary restrictions, emergency contacts, and payment status tracking.'
	},
	
	survey: {
		name: 'Customer Satisfaction Survey',
		description: 'Customer feedback and satisfaction survey',
		headers: ['customer_id', 'product_name', 'purchase_date', 'overall_rating', 'price_rating', 'quality_rating', 'service_rating', 'recommendation', 'comments', 'contact_permission'],
		sampleData: [
			['CUST001', 'Premium Widget', '2024-01-10', '5', '4', '5', '5', 'Yes', 'Excellent product, highly recommend!', 'Yes'],
			['CUST002', 'Basic Widget', '2024-01-12', '3', '3', '3', '4', 'Maybe', 'Good product but could be better', 'No'],
			['CUST003', 'Deluxe Widget', '2024-01-14', '4', '4', '4', '3', 'Yes', 'Great quality, fast shipping', 'Yes']
		],
		fieldTypes: ['text', 'text', 'date', 'rating', 'rating', 'rating', 'rating', 'yesno', 'textarea', 'yesno'],
		instructions: 'Ideal for customer feedback collection. Includes rating scales and permission tracking for follow-up contact.'
	},
	
	application: {
		name: 'Job Application Form',
		description: 'Comprehensive job application form',
		headers: ['first_name', 'last_name', 'email', 'phone', 'address', 'city', 'state', 'zipcode', 'position', 'experience_years', 'education_level', 'skills', 'availability', 'salary_expectation', 'references'],
		sampleData: [
			['John', 'Doe', 'john@example.com', '(555) 123-4567', '123 Main St', 'New York', 'NY', '10001', 'Software Engineer', '5', 'Bachelor', 'JavaScript, React, Node.js', 'Immediate', '80000', 'Jane Smith - jane@example.com'],
			['Jane', 'Smith', 'jane@example.com', '(555) 987-6543', '456 Oak Ave', 'San Francisco', 'CA', '94102', 'UX Designer', '3', 'Master', 'Figma, Sketch, Adobe Creative Suite', '2 weeks', '75000', 'Bob Johnson - bob@example.com'],
			['Bob', 'Johnson', 'bob@example.com', '(555) 456-7890', '789 Pine Rd', 'Austin', 'TX', '73301', 'Product Manager', '7', 'MBA', 'Agile, Scrum, Product Strategy', '1 month', '95000', 'Alice Brown - alice@example.com']
		],
		fieldTypes: ['text', 'text', 'email', 'phone', 'address', 'text', 'state', 'zipcode', 'text', 'number', 'select', 'tags', 'text', 'money', 'textarea'],
		instructions: 'Complete job application template. Includes personal info, experience, education, and references.'
	},
	
	feedback: {
		name: 'Product Feedback Form',
		description: 'Product feedback and feature requests',
		headers: ['user_id', 'product_version', 'feedback_type', 'priority', 'category', 'title', 'description', 'steps_to_reproduce', 'expected_behavior', 'actual_behavior', 'browser', 'os', 'submitted_date'],
		sampleData: [
			['USER001', '2.1.0', 'Bug Report', 'High', 'UI', 'Login button not working', 'The login button does not respond when clicked', '1. Go to login page\n2. Enter credentials\n3. Click login button', 'User should be logged in', 'Nothing happens when button is clicked', 'Chrome 120', 'Windows 11', '2024-01-15'],
			['USER002', '2.1.0', 'Feature Request', 'Medium', 'Functionality', 'Dark mode support', 'Would like to see a dark mode option', 'N/A', 'Dark mode toggle in settings', 'N/A', 'Firefox 121', 'macOS 14', '2024-01-16'],
			['USER003', '2.0.9', 'Enhancement', 'Low', 'Performance', 'Slow page loading', 'The dashboard takes too long to load', '1. Login to account\n2. Navigate to dashboard', 'Dashboard should load within 2 seconds', 'Dashboard takes 10+ seconds to load', 'Safari 17', 'macOS 14', '2024-01-17']
		],
		fieldTypes: ['text', 'text', 'select', 'select', 'select', 'text', 'textarea', 'textarea', 'textarea', 'textarea', 'text', 'text', 'date'],
		instructions: 'Comprehensive feedback collection template. Perfect for bug reports, feature requests, and user feedback.'
	}
}

export function generateCSVContent(template: CSVTemplate): string {
	const lines = [
		template.headers.join(','),
		...template.sampleData.map(row => row.join(','))
	]
	return lines.join('\n')
}

export function downloadCSVTemplate(template: CSVTemplate): void {
	const content = generateCSVContent(template)
	const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
	const link = document.createElement('a')
	
	if (link.download !== undefined) {
		const url = URL.createObjectURL(blob)
		link.setAttribute('href', url)
		link.setAttribute('download', `${template.name.replace(/\s+/g, '_')}_template.csv`)
		link.style.visibility = 'hidden'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}
}

export function getTemplateCategories(): string[] {
	return Object.keys(CSV_TEMPLATES)
}

export function getTemplatesByCategory(category: string): CSVTemplate[] {
	return Object.values(CSV_TEMPLATES).filter(template => 
		template.name.toLowerCase().includes(category.toLowerCase()) ||
		template.description.toLowerCase().includes(category.toLowerCase())
	)
}
