import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { ToolsName } from '../../types/commonTypes.ts'

export const tools = {
	changeTool(toolName: ToolsName) {
		canvasStore.tool = toolName
	},
}
