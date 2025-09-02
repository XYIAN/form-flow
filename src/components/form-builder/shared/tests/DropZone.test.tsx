import { render, fireEvent, screen } from '@testing-library/react'
import { DragProvider } from '../context/DragContext'
import { DropZone } from '../components/DropZone'

describe('DropZone', () => {
	const setup = () => {
		const onDrop = jest.fn()

		render(
			<DragProvider>
				<DropZone
					accepts={['component', 'layout']}
					onDrop={onDrop}
					className='test-zone'
					activeClassName='active-zone'
				>
					<div data-testid='drop-content'>Drop Here</div>
				</DropZone>
			</DragProvider>
		)

		return { onDrop }
	}

	it('renders children correctly', () => {
		setup()
		expect(screen.getByTestId('drop-content')).toHaveTextContent('Drop Here')
	})

	it('handles drag events correctly', () => {
		setup()
		const zone = screen.getByTestId('drop-content').parentElement

		// Drag enter
		fireEvent.dragEnter(zone)
		expect(zone).toHaveClass('test-zone')

		// Drag over
		fireEvent.dragOver(zone)
		expect(zone).toHaveClass('test-zone')

		// Drag leave
		fireEvent.dragLeave(zone)
		expect(zone).toHaveClass('test-zone')
	})

	it('handles drop events', () => {
		const { onDrop } = setup()
		const zone = screen.getByTestId('drop-content').parentElement

		// Drop
		fireEvent.drop(zone)
		expect(onDrop).toHaveBeenCalled()
	})

	it('applies correct classes', () => {
		setup()
		const zone = screen.getByTestId('drop-content').parentElement
		expect(zone).toHaveClass('test-zone')
		expect(zone).toHaveClass('transition-all')
	})

	it('handles active state correctly', () => {
		setup()
		const zone = screen.getByTestId('drop-content').parentElement

		// Simulate active state
		fireEvent.dragEnter(zone, {
			dataTransfer: { types: ['component'] },
		})
		expect(zone).toHaveClass('active-zone')

		// Simulate inactive state
		fireEvent.dragLeave(zone)
		expect(zone).not.toHaveClass('active-zone')
	})
})
