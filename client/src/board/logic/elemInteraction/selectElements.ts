import { FederatedPointerEvent } from 'pixi.js'
import { canvasUtils } from '../canvasUtils.ts'
import { renderCanvas } from '../render/renderCanvas.ts'
import { canvasStore } from '../store/canvasStore.ts'
import { InteractionStatus, ToolsName } from '../store/canvasStoreTypes.ts'

export const selectElements = {
	init() {
		canvasStore.app.stage.on('pointerdown', (e) => {
			this.selectFigure(e)
		})
	},

	/**
	 * Делает фигуру выделенной
	 * @param e — событие щелчка по элементу или холсту
	 */
	selectFigure(e: FederatedPointerEvent) {
		const elemUnderCursor = canvasUtils.getElemUnderCursor(e)
		if (!elemUnderCursor) return

		if (canvasStore.tool !== ToolsName.Select || elemUnderCursor.interactionStatus === InteractionStatus.Selected)
			return

		canvasUtils.makeAllElemsUnselected()

		canvasUtils.updateCanvasElement(elemUnderCursor.id, {
			interactionStatus: InteractionStatus.Selected,
		})

		renderCanvas.render()
	},
}
