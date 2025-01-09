import Button from '../../../../shared/Button/Button.tsx'
import { scaleCanvas, ZoomDirection } from '../../../logic/canvasInteraction/scaleCanvas.ts'
import { MinusIcon } from '../../icons/MinusIcon.tsx'
import { PlusIcon } from '../../icons/PlusIcon.tsx'
import './ScalePanel.scss'

function ScalePanel() {
	// const scale = useBoardStore((s) => s.canvas.scale)
	const scale = 100

	return (
		<div className='scale-panel'>
			<Button onClick={() => scaleCanvas.zoomCanvasOneStep(ZoomDirection.In)}>
				<PlusIcon />
			</Button>
			<p className='scale-panel__scale-text'>
				{scale}
				<span className='mini-space'> </span>%
			</p>
			<Button onClick={() => scaleCanvas.zoomCanvasOneStep(ZoomDirection.Out)}>
				<MinusIcon />
			</Button>
		</div>
	)
}

export default ScalePanel
