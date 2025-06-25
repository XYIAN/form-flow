'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { useAuth } from '@/context/AuthContext'
import { useForms } from '@/context/FormContext'
import { Form } from '@/types'
import { formatDate } from '@/utils'
import Navigation from '@/components/Navigation'

interface UserDashboardProps {
	params: Promise<{
		userid: string
	}>
}

export default function UserDashboard({ params }: UserDashboardProps) {
	const { user, isAuthenticated } = useAuth()
	const { getFormsByUserId, deleteForm } = useForms()
	const router = useRouter()
	const [forms, setForms] = useState<Form[]>([])
	const [resolvedParams, setResolvedParams] = useState<{ userid: string } | null>(null)

	// Resolve params promise
	useEffect(() => {
		params.then((resolved) => {
			setResolvedParams(resolved)
		})
	}, [params])

	// Redirect if not authenticated or wrong user
	useEffect(() => {
		if (!isAuthenticated || !user || !resolvedParams) {
			if (!isAuthenticated || !user) {
				router.push('/')
			}
			return
		}

		if (user.email !== resolvedParams.userid) {
			router.push(`/user/${user.email}`)
			return
		}

		const userForms = getFormsByUserId(user.id)
		setForms(userForms)
	}, [isAuthenticated, user, resolvedParams, router, getFormsByUserId])

	const handleEditForm = (formId: string) => {
		if (!resolvedParams) return
		router.push(`/user/${resolvedParams.userid}/${formId}`)
	}

	const handleDeleteForm = (formId: string) => {
		confirmDialog({
			message: 'Are you sure you want to delete this form? This action cannot be undone.',
			header: 'Delete Confirmation',
			icon: 'pi pi-exclamation-triangle',
			accept: () => {
				deleteForm(formId)
				setForms(prev => prev.filter(form => form.id !== formId))
			}
		})
	}

	const handleCreateForm = () => {
		if (!resolvedParams) return
		router.push(`/user/${resolvedParams.userid}/create`)
	}

	const actionTemplate = (rowData: Form) => (
		<div className="flex gap-2">
			<Button
				icon="pi pi-pencil"
				className="p-button-sm p-button-outlined p-button-secondary"
				onClick={() => handleEditForm(rowData.id)}
				tooltip="Edit Form"
			/>
			<Button
				icon="pi pi-trash"
				className="p-button-sm p-button-outlined p-button-danger"
				onClick={() => handleDeleteForm(rowData.id)}
				tooltip="Delete Form"
			/>
		</div>
	)

	const titleTemplate = (rowData: Form) => (
		<div>
			<div className="font-semibold text-white">{rowData.title}</div>
			{rowData.description && (
				<div className="text-sm text-gray-400">{rowData.description}</div>
			)}
		</div>
	)

	const dateTemplate = (rowData: Form) => (
		<span className="text-gray-300">{formatDate(rowData.updatedAt)}</span>
	)

	const fieldsTemplate = (rowData: Form) => (
		<span className="text-gray-300">{rowData.fields.length} fields</span>
	)

	if (!isAuthenticated || !user || !resolvedParams) {
		return null
	}

	return (
		<div className="form-flow-container">
			<Navigation userEmail={user.email} companyName={user.companyName} />
			
			<div className="p-4">
				<div className="max-w-7xl mx-auto">
					<div className="flex justify-content-between align-items-center mb-4">
						<h2 className="text-2xl font-bold text-white">My Forms</h2>
						<Button
							label="Create New Form"
							icon="pi pi-plus"
							onClick={handleCreateForm}
							className="p-button-primary"
						/>
					</div>

					<Card className="form-flow-card">
						{forms.length === 0 ? (
							<div className="text-center py-8">
								<i className="pi pi-file-edit text-6xl text-gray-500 mb-4"></i>
								<h3 className="text-xl font-semibold text-white mb-2">No Forms Yet</h3>
								<p className="text-gray-400 mb-4">
									Create your first form to start collecting information from affected individuals.
								</p>
								<Button
									label="Create Your First Form"
									icon="pi pi-plus"
									onClick={handleCreateForm}
									className="p-button-primary"
								/>
							</div>
						) : (
							<DataTable
								value={forms}
								paginator
								rows={10}
								rowsPerPageOptions={[5, 10, 25]}
								className="p-datatable-sm"
								emptyMessage="No forms found"
							>
								<Column
									field="title"
									header="Form"
									body={titleTemplate}
									style={{ minWidth: '200px' }}
								/>
								<Column
									field="fields"
									header="Fields"
									body={fieldsTemplate}
									style={{ width: '100px' }}
								/>
								<Column
									field="updatedAt"
									header="Last Modified"
									body={dateTemplate}
									style={{ width: '150px' }}
								/>
								<Column
									body={actionTemplate}
									style={{ width: '120px' }}
								/>
							</DataTable>
						)}
					</Card>
				</div>
			</div>

			<ConfirmDialog />
		</div>
	)
} 