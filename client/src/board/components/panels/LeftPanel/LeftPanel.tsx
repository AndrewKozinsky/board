import ScalePanel from '../ScalePanel/ScalePanel.tsx'
import './LeftPanel.scss'
import ToolsPanel from '../ToolsPanel/ToolsPanel.tsx'

function LeftPanel() {
	return (
		<div className='left-panel'>
			<ToolsPanel />
			<ScalePanel />
		</div>
	)
}

export default LeftPanel
