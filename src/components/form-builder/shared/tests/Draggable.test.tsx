import { render, fireEvent, screen } from '@testing-library/react'
import { DragProvider } from '../context/DragContext'
import { Draggable } from '../components/Draggable'

describe('Draggable', () => {
	const mockComponent = {
		id: 'test-component',
		type: 'text',
		name: 'Test Component',
	}

	const setup = () => {
		const onDragStart = jest.fn()
		const onDragEnd = jest.fn()

		render(
			<DragProvider>
				<Draggable
					type='component'
					data={mockComponent}
					onDragStart={onDragStart}
					onDragEnd={onDragEnd}
				>
					<div data-testid='draggable-content'>Drag Me</div>
				</Draggable>
			</DragProvider>
		)

		return { onDragStart, onDragEnd }
	}

	it('renders children correctly', () => {
		setup()
		expect(screen.getByTestId('draggable-content')).toHaveTextContent('Drag Me')
	})

	it('handles mouse events correctly', () => {
		const { onDragStart, onDragEnd } = setup()
		const element = screen.getByTestId('draggable-content')

		// Start drag
		fireEvent.mouseDown(element)
		expect(onDragStart).toHaveBeenCalled()

		// Move
		fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })

		// End drag
		fireEvent.mouseUp(document)
		expect(onDragEnd).toHaveBeenCalled()
	})

	it('applies correct styles', () => {
		setup()
		const element = screen.getByTestId('draggable-content').parentElement
		expect(element).toHaveClass('cursor-grab')
	})

	it('handles custom className', () => {
		render(
			<DragProvider>
				<Draggable
					type='component'
					data={mockComponent}
					className='custom-class'
				>
					<div data-testid='draggable-content'>Drag Me</div>
				</Draggable>
			</DragProvider>
		)

		const element = screen.getByTestId('draggable-content').parentElement
		expect(element).toHaveClass('custom-class')
	})
})
