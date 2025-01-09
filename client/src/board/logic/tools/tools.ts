import { isKeysPressed } from '../../../utils/keyboardUtils.ts'
import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { ToolsName } from '../../types/commonTypes.ts'
import { boardConfig } from '../misc/boardConfig.ts'
import { canvasUtils } from '../misc/canvasUtils.ts'

export const tools = {
	/** Добавляет обработчики на выбор инструменто через горячие клавиши */
	init() {
		document.addEventListener('keydown', (event) => {
			if (isKeysPressed(event, boardConfig.commands.switchToSelectTool.hotKeys)) {
				this.changeTool(ToolsName.Select) // Zoom out (scale up by 25%)
			} else if (isKeysPressed(event, boardConfig.commands.switchToFigureTool.hotKeys)) {
				this.changeTool(ToolsName.Shape) // Zoom in (scale down by 25%)
			}
		})
	},

	/**
	 * Делает активным указанный инструмент
	 * @param toolName — имя инструмента
	 */
	changeTool(toolName: ToolsName) {
		canvasStore.tool = toolName

		if (canvasStore.tool !== ToolsName.Select) {
			canvasUtils.makeAllElemsUnselected()
		}
	},
}
