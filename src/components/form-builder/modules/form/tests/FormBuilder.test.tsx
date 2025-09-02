import { render, fireEvent, screen } from '@testing-library/react'
import FormBuilder from '../components/FormBuilder'

describe('FormBuilder', () => {
	const mockSections = [
		{
			id: 'section-1',
			title: 'Section 1',
			columns: [
				{ id: 'col-1', width: '1fr', field: 'field-1' },
				{ id: 'col-2', width: '1fr', field: null },
			],
		},
		{
			id: 'section-2',
			title: 'Section 2',
			columns: [{ id: 'col-3', width: '1fr', field: null }],
		},
	]

	const setup = () => {
		const mockProps = {
			sections: mockSections,
			onAddComponent: jest.fn(),
			onApplyLayout: jest.fn(),
			onApplyTemplate: jest.fn(),
			onRemoveSection: jest.fn(),
			onMoveSection: jest.fn(),
		}

		render(<FormBuilder {...mockProps} />)
		return mockProps
	}

	it('renders sections correctly', () => {
		setup()
		expect(screen.getByText('Section 1')).toBeInTheDocument()
		expect(screen.getByText('Section 2')).toBeInTheDocument()
	})

	it('handles section removal', () => {
		const { onRemoveSection } = setup()
		const removeButtons = screen.getAllByRole('button', {
			name: /remove section/i,
		})

		fireEvent.click(removeButtons[0])
		expect(onRemoveSection).toHaveBeenCalledWith('section-1')
	})

	it('handles section movement', () => {
		const { onMoveSection } = setup()
		const moveButtons = screen.getAllByRole('button', {
			name: /move section/i,
		})

		fireEvent.click(moveButtons[0])
		expect(onMoveSection).toHaveBeenCalledWith('section-1', 'down')
	})

	it('renders empty state correctly', () => {
		render(
			<FormBuilder
				sections={[]}
				onAddComponent={jest.fn()}
				onApplyLayout={jest.fn()}
				onApplyTemplate={jest.fn()}
				onRemoveSection={jest.fn()}
				onMoveSection={jest.fn()}
			/>
		)

		expect(screen.getByText(/drag and drop components/i)).toBeInTheDocument()
	})

	it('handles component drops', () => {
		const { onAddComponent } = setup()
		const dropZones = screen.getAllByText(/drop component here/i)

		fireEvent.drop(dropZones[0], {
			dataTransfer: {
				getData: () =>
					JSON.stringify({
						type: 'component',
						data: { id: 'test-component', type: 'text' },
					}),
			},
		})

		expect(onAddComponent).toHaveBeenCalledWith(
			{ id: 'test-component', type: 'text' },
			'section-1'
		)
	})

	it('handles layout drops', () => {
		const { onApplyLayout } = setup()
		const mainDropZone = screen.getByText(/drag and drop components/i)

		fireEvent.drop(mainDropZone, {
			dataTransfer: {
				getData: () =>
					JSON.stringify({
						type: 'layout',
						data: { id: 'test-layout', type: 'grid' },
					}),
			},
		})

		expect(onApplyLayout).toHaveBeenCalledWith({
			id: 'test-layout',
			type: 'grid',
		})
	})

	it('handles template drops', () => {
		const { onApplyTemplate } = setup()
		const mainDropZone = screen.getByText(/drag and drop components/i)

		fireEvent.drop(mainDropZone, {
			dataTransfer: {
				getData: () =>
					JSON.stringify({
						type: 'template',
						data: { id: 'test-template', name: 'Test Template' },
					}),
			},
		})

		expect(onApplyTemplate).toHaveBeenCalledWith({
			id: 'test-template',
			name: 'Test Template',
		})
	})
})
