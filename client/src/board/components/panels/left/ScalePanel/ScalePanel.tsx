import Button from '../../../../../shared/Button/Button.tsx'
import { fullScreen } from '../../../../logic/canvas/fullScreen.ts'
import { scaleCanvas, ZoomDirection } from '../../../../logic/canvas/scaleCanvas.ts'
import { useUIStore } from '../../../../uiStore/uiStore.ts'
import { FullscreenIcon } from '../../../icons/FullscreenIcon.tsx'
import { MinusIcon } from '../../../icons/MinusIcon.tsx'
import { PlusIcon } from '../../../icons/PlusIcon.tsx'
import './ScalePanel.scss'

function ScalePanel() {
	const scale = useUIStore((s) => s.canvas.scale)

	return (
		<div className='scale-panel'>
			<div className='scale-panel__top'>
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
			<Button onClick={fullScreen.toggleFullScreen}>
				<FullscreenIcon />
			</Button>
		</div>
	)
}

export default ScalePanel
