import React from 'react'
import Button from '../../../../../shared/Button/Button.tsx'
import { tools } from '../../../../logic/tools/tools.ts'
import { ToolsName } from '../../../../types/commonTypes.ts'
import { useUIStore } from '../../../../uiStore/uiStore.ts'
import { buttonsConfig } from './fn/buttonsConfig.ts'
import './SelectShapePanel.scss'

function SelectFigurePanel() {
	const currentTool = useUIStore((s) => s.tool)

	if (currentTool.name !== ToolsName.Shape) {
		return null
	}

	return (
		<div className='select-figure-panel'>
			{buttonsConfig.map((toolConfig) => {
				const Icon = toolConfig.Icon as any

				return (
					<Button
						onClick={() => {
							tools.changeFigureShape(toolConfig.shapeName)
						}}
						active={currentTool.shape === toolConfig.shapeName}
						key={toolConfig.shapeName}
					>
						<Icon />
					</Button>
				)
			})}
		</div>
	)
}

export default SelectFigurePanel
