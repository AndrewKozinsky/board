import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { ToolsName } from '../../types/commonTypes.ts'
import { canvasUtils } from '../misc/canvasUtils.ts'

export const tools = {
	changeTool(toolName: ToolsName) {
		canvasStore.tool = toolName

		if (canvasStore.tool !== ToolsName.Select) {
			canvasUtils.makeAllElemsUnselected()
		}
	},
}
