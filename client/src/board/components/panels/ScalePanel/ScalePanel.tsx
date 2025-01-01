import Button from '../../../../shared/Button/Button.tsx'
import {useGetScale} from './fn/getScale.ts'
import './ScalePanel.scss'

function ScalePanel() {
	const scale = useGetScale()

	return (
		<div className='scale-panel'>
			<Button>+</Button>
			<p className='scale-panel__scale-text'>
				{scale}
				<span className='mini-space'> </span>
				%
			</p>
			<Button>-</Button>
		</div>
	)
}

export default ScalePanel
