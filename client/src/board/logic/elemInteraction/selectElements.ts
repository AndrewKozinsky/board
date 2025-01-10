import { FederatedPointerEvent } from 'pixi.js'
import { ToolsName } from '../../types/commonTypes.ts'
import { canvasUtils } from '../misc/canvasUtils.ts'
import { renderCanvas } from '../render/renderCanvas.ts'
import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { InteractionStatus } from '../../canvasStore/canvasStoreTypes.ts'

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

		if (
			canvasStore.tool.name !== ToolsName.Select ||
			elemUnderCursor.interactionStatus === InteractionStatus.Selected
		)
			return

		canvasUtils.makeAllElemsUnselected()

		canvasUtils.updateCanvasElement(elemUnderCursor.id, {
			interactionStatus: InteractionStatus.Selected,
		})

		renderCanvas.render()
	},
}
