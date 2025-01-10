import Button from '../../../../../shared/Button/Button.tsx'
import { tools } from '../../../../logic/tools/tools.ts'
import { ToolsName } from '../../../../types/commonTypes.ts'
import { useUIStore } from '../../../../uiStore/uiStore.ts'
import { SelectIcon } from '../../../icons/SelectIcon.tsx'
import { ShapesIcon } from '../../../icons/ShapesIcon.tsx'
import './ToolsPanel.scss'

function ToolsPanel() {
	const tool = useUIStore((s) => s.tool)

	return (
		<div className='tools-panel'>
			<Button
				onClick={() => {
					tools.changeTool(ToolsName.Select)
				}}
				active={tool.name === ToolsName.Select}
				size='big'
			>
				<SelectIcon />
			</Button>
			<Button
				onClick={() => {
					tools.changeTool(ToolsName.Shape)
				}}
				active={tool.name === ToolsName.Shape}
				size='big'
			>
				<ShapesIcon />
			</Button>
		</div>
	)
}

export default ToolsPanel
