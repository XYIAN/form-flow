import { useState } from 'react'
import { ColorPicker } from 'primereact/colorpicker'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Slider } from 'primereact/slider'

interface CustomizableBackgroundProps {
	children: React.ReactNode
	className?: string
	defaultBackground?: string
	defaultOpacity?: number
	onCustomize?: (style: { background: string; opacity: number }) => void
}

export default function CustomizableBackground({
	children,
	className = '',
	defaultBackground = '#ffffff',
	defaultOpacity = 1,
	onCustomize,
}: CustomizableBackgroundProps) {
	const [showCustomizer, setShowCustomizer] = useState(false)
	const [background, setBackground] = useState(defaultBackground)
	const [opacity, setOpacity] = useState(defaultOpacity * 100)
	const [pattern, setPattern] = useState<string>('')

	const patterns = {
		none: '',
		dots: 'radial-gradient(circle, #00000010 1px, transparent 1px) 0 0 / 10px 10px',
		grid: 'linear-gradient(to right, #00000010 1px, transparent 1px) 0 0 / 20px 20px, linear-gradient(to bottom, #00000010 1px, transparent 1px) 0 0 / 20px 20px',
		diagonal:
			'repeating-linear-gradient(45deg, #00000010 0, #00000010 1px, transparent 0, transparent 50%) 0 0 / 10px 10px',
	}

	const handleApply = () => {
		const style = {
			background,
			opacity: opacity / 100,
		}
		onCustomize?.(style)
		setShowCustomizer(false)
	}

	const backgroundStyle = {
		backgroundColor: background,
		opacity: opacity / 100,
		backgroundImage: patterns[pattern as keyof typeof patterns] || '',
	}

	return (
		<div className='relative'>
			<div
				className={`absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity`}
			>
				<Button
					icon='pi pi-cog'
					className='p-button-rounded p-button-text'
					onClick={() => setShowCustomizer(true)}
				/>
			</div>

			<div className={`relative ${className} group`} style={backgroundStyle}>
				{children}
			</div>

			<Dialog
				header='Customize Background'
				visible={showCustomizer}
				onHide={() => setShowCustomizer(false)}
				className='w-full max-w-lg'
			>
				<div className='space-y-6 p-4'>
					<div className='space-y-2'>
						<label className='block text-sm font-medium'>
							Background Color
						</label>
						<div className='flex items-center gap-2'>
							<ColorPicker
								value={background}
								onChange={e => setBackground('#' + e.value)}
								className='w-2rem h-2rem'
							/>
							<InputText
								value={background}
								onChange={e => setBackground(e.target.value)}
								className='w-32'
							/>
						</div>
					</div>

					<div className='space-y-2'>
						<label className='block text-sm font-medium'>Opacity</label>
						<div className='flex items-center gap-4'>
							<Slider
								value={opacity}
								onChange={e => setOpacity(e.value as number)}
								className='w-full'
							/>
							<span className='w-12 text-right'>{opacity}%</span>
						</div>
					</div>

					<div className='space-y-2'>
						<label className='block text-sm font-medium'>Pattern</label>
						<div className='grid grid-cols-2 gap-2'>
							{Object.entries(patterns).map(([name, value]) => (
								<div
									key={name}
									className={`p-4 border rounded-lg cursor-pointer transition-all ${
										pattern === name ? 'ring-2 ring-primary' : ''
									}`}
									style={{ backgroundImage: value }}
									onClick={() => setPattern(name)}
								>
									<span className='capitalize'>{name}</span>
								</div>
							))}
						</div>
					</div>

					<div className='flex justify-end gap-2 pt-4'>
						<Button
							label='Cancel'
							className='p-button-text'
							onClick={() => setShowCustomizer(false)}
						/>
						<Button label='Apply' onClick={handleApply} />
					</div>
				</div>
			</Dialog>
		</div>
	)
}
