import { FederatedPointerEvent } from 'pixi.js'
import { getStore } from '../../store/store.ts'
import { InteractionStatus, ToolsName } from '../../store/storeTypes.ts'
import { canvasUtils } from '../canvasUtils.ts'
import { renderCanvas } from '../render/renderCanvas.ts'

export const selectElements = {
	init() {
		getStore.app.stage.on('pointerdown', (e) => {
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

		if (getStore.tool !== ToolsName.Select || elemUnderCursor.interactionStatus === InteractionStatus.Selected)
			return

		canvasUtils.makeAllElemsUnselected()

		getStore.updateCanvasElement(elemUnderCursor.id, {
			interactionStatus: InteractionStatus.Selected,
		})

		renderCanvas.render()
	},
}
