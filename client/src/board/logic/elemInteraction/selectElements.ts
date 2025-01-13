import { FederatedPointerEvent } from 'pixi.js'
import { ToolsName } from '../../types/commonTypes.ts'
import { canvasUtils } from '../canvas/canvasUtils.ts'
import { renderCanvas } from '../render/renderCanvas.ts'
import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { InteractionStatus } from '../../canvasStore/canvasStoreTypes.ts'

// Ставит обработчики на выделение элемента
export const selectElements = {
	init() {
		canvasStore.app.stage.on('pointerdown', (e) => {
			this.selectElem(e)
		})
	},

	/**
	 * Делает фигуру выделенной
	 * @param e — событие щелчка по элементу или холсту
	 */
	selectElem(e: FederatedPointerEvent) {
		const elemUnderCursor = canvasUtils.getElemUnderCursor(e)
		if (!elemUnderCursor) return

		if (
			canvasStore.tool.name !== ToolsName.Select ||
			elemUnderCursor.interactionStatus === InteractionStatus.Selected
		)
			return

		canvasUtils.makeAllElemsUnselected()

		elemUnderCursor.interactionStatus = InteractionStatus.Selected

		renderCanvas.render()
	},
}
