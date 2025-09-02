import { render, fireEvent, screen } from '@testing-library/react'
import { DragProvider, useDrag } from '../context/DragContext'

// Test component that uses the drag context
function TestComponent() {
	const { draggedItem, isDragging, startDrag, endDrag } = useDrag()

	return (
		<div>
			<button
				onClick={() =>
					startDrag({
						type: 'component',
						data: { id: 'test', type: 'text' },
					})
				}
			>
				Start Drag
			</button>
			<button onClick={endDrag}>End Drag</button>
			<div data-testid='drag-status'>
				{isDragging ? 'Dragging' : 'Not Dragging'}
			</div>
			<div data-testid='drag-item'>
				{draggedItem ? JSON.stringify(draggedItem) : 'No Item'}
			</div>
		</div>
	)
}

describe('DragContext', () => {
	it('provides drag state and methods', () => {
		render(
			<DragProvider>
				<TestComponent />
			</DragProvider>
		)

		// Initial state
		expect(screen.getByTestId('drag-status')).toHaveTextContent('Not Dragging')
		expect(screen.getByTestId('drag-item')).toHaveTextContent('No Item')

		// Start drag
		fireEvent.click(screen.getByText('Start Drag'))
		expect(screen.getByTestId('drag-status')).toHaveTextContent('Dragging')
		expect(screen.getByTestId('drag-item')).toContain('test')

		// End drag
		fireEvent.click(screen.getByText('End Drag'))
		expect(screen.getByTestId('drag-status')).toHaveTextContent('Not Dragging')
		expect(screen.getByTestId('drag-item')).toHaveTextContent('No Item')
	})

	it('throws error when used outside provider', () => {
		const consoleError = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {})
		expect(() => render(<TestComponent />)).toThrow(
			'useDrag must be used within a DragProvider'
		)
		consoleError.mockRestore()
	})
})
