import ScalePanel from '../ScalePanel/ScalePanel.tsx'
import ToolsPanel from '../ToolsPanel/ToolsPanel.tsx'
import './LeftPanelsWrapper.scss'

function LeftPanelsWrapper() {
	return (
		<div className='left-panel'>
			<ToolsPanel />
			<ScalePanel />
		</div>
	)
}

export default LeftPanelsWrapper
