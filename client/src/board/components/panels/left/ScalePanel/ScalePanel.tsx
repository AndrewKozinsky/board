import Button from '../../../../../shared/Button/Button.tsx'
import { scaleCanvas, ZoomDirection } from '../../../../logic/canvas/scaleCanvas.ts'
import { useUIStore } from '../../../../uiStore/uiStore.ts'
import { MinusIcon } from '../../../icons/MinusIcon.tsx'
import { PlusIcon } from '../../../icons/PlusIcon.tsx'
import './ScalePanel.scss'

function ScalePanel() {
	const scale = useUIStore((s) => s.canvas.scale)

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