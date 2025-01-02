import './LeftPanel.scss'
import ScalePanel from '../ScalePanel/ScalePanel.tsx'
import { useGetScale } from '../ScalePanel/fn/getScale.ts'

function LeftPanel() {
	return (
		<div className="left-panel">
			<ScalePanel />
		</div>
	)
}

export default LeftPanel
