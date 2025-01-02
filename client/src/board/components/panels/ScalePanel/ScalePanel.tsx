import Button from '../../../../shared/Button/Button.tsx'
import { scaleCanvas, ZoomDirection } from '../../../logic/scaleCanvas.ts'
import { useGetScale } from './fn/getScale.ts'
import './ScalePanel.scss'

function ScalePanel() {
	const scale = useGetScale()

	return (
		<div className='scale-panel'>
			<Button onClick={() => scaleCanvas.zoomCanvasOneStep(ZoomDirection.In)}>+</Button>
			<p className='scale-panel__scale-text'>
				{scale}
				<span className='mini-space'> </span>%
			</p>
			<Button onClick={() => scaleCanvas.zoomCanvasOneStep(ZoomDirection.Out)}>-</Button>
		</div>
	)
}

export default ScalePanel
