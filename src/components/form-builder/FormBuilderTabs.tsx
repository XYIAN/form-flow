/**
 * Form Builder Tabs Component
 *
 * Main tabs container for the form builder
 */

import { useState } from 'react'
import { TabView, TabPanel } from 'primereact/tabview'
import { FormField } from '@/types'
import ManualFormTab from './ManualFormTab'
import CSVUploadTab from './CSVUploadTab'

interface FormBuilderTabsProps {
	// Form data
	title: string
	setTitle: (title: string) => void
	description: string
	setDescription: (description: string) => void
	fields: FormField[]
	onAddField: (field: FormField) => void
	onUpdateField: (fieldId: string, updates: Partial<FormField>) => void
	onDeleteField: (fieldId: string) => void
	onSaveForm: () => void
	isLoading: boolean

	// CSV data
	csvTitle: string
	setCsvTitle: (title: string) => void
	csvDescription: string
	setCsvDescription: (description: string) => void
	csvHeaders: string[]
	setCsvHeaders: (headers: string[]) => void
	generatedFields: FormField[]
	setGeneratedFields: (fields: FormField[]) => void
	csvProcessing: boolean
	setCsvProcessing: (processing: boolean) => void
	onCreateFromCsv: () => void

	// Error handling
	onError: (error: string) => void
	onMcpStatusChange: (status: 'idle' | 'running' | 'success' | 'error') => void
	onMcpExecutionTime: (time: number) => void
	onMcpError: (error: string) => void
}

export default function FormBuilderTabs({
	title,
	setTitle,
	description,
	setDescription,
	fields,
	onAddField,
	onUpdateField,
	onDeleteField,
	onSaveForm,
	isLoading,
	csvTitle,
	setCsvTitle,
	csvDescription,
	setCsvDescription,
	csvHeaders,
	setCsvHeaders,
	generatedFields,
	setGeneratedFields,
	csvProcessing,
	setCsvProcessing,
	onCreateFromCsv,
	onError,
	onMcpStatusChange,
	onMcpExecutionTime,
	onMcpError,
}: FormBuilderTabsProps) {
	const [activeTab, setActiveTab] = useState(0)

	return (
		<div className='w-full'>
			<TabView activeIndex={activeTab} onTabChange={e => setActiveTab(e.index)}>
				<TabPanel header='Manual Builder' leftIcon='pi pi-pencil'>
					<ManualFormTab
						title={title}
						setTitle={setTitle}
						description={description}
						setDescription={setDescription}
						fields={fields}
						onAddField={onAddField}
						onUpdateField={onUpdateField}
						onDeleteField={onDeleteField}
						onSaveForm={onSaveForm}
						isLoading={isLoading}
					/>
				</TabPanel>

				<TabPanel header='CSV Import' leftIcon='pi pi-file-import'>
					<CSVUploadTab
						csvTitle={csvTitle}
						setCsvTitle={setCsvTitle}
						csvDescription={csvDescription}
						setCsvDescription={setCsvDescription}
						csvHeaders={csvHeaders}
						setCsvHeaders={setCsvHeaders}
						generatedFields={generatedFields}
						setGeneratedFields={setGeneratedFields}
						csvProcessing={csvProcessing}
						setCsvProcessing={setCsvProcessing}
						onCreateFromCsv={onCreateFromCsv}
						onError={onError}
						onMcpStatusChange={onMcpStatusChange}
						onMcpExecutionTime={onMcpExecutionTime}
						onMcpError={onMcpError}
					/>
				</TabPanel>

				<TabPanel header='Components' leftIcon='pi pi-th-large'>
					<div className='p-4 text-center text-gray-400'>
						<i className='pi pi-cog text-4xl mb-4'></i>
						<h3 className='text-xl font-medium mb-2'>Component Library</h3>
						<p>Drag and drop pre-built components to create your form</p>
						<p className='text-sm mt-2'>Coming soon...</p>
					</div>
				</TabPanel>

				<TabPanel header='Layouts' leftIcon='pi pi-sitemap'>
					<div className='p-4 text-center text-gray-400'>
						<i className='pi pi-cog text-4xl mb-4'></i>
						<h3 className='text-xl font-medium mb-2'>Layout Builder</h3>
						<p>Choose from pre-designed form layouts</p>
						<p className='text-sm mt-2'>Coming soon...</p>
					</div>
				</TabPanel>

				<TabPanel header='Templates' leftIcon='pi pi-file'>
					<div className='p-4 text-center text-gray-400'>
						<i className='pi pi-cog text-4xl mb-4'></i>
						<h3 className='text-xl font-medium mb-2'>Form Templates</h3>
						<p>Start with a pre-built form template</p>
						<p className='text-sm mt-2'>Coming soon...</p>
					</div>
				</TabPanel>
			</TabView>
		</div>
	)
}
