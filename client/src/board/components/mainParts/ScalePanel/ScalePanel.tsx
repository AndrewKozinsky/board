import Button from '../../../../shared/Button/Button.tsx'
import './ScalePanel.scss'

function ScalePanel() {
	return (
		<div className='scale-panel'>
			<Button>+</Button>
			<p>100%</p>
			<Button>-</Button>
		</div>
	)
}

export default ScalePanel
