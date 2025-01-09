import { FederatedPointerEvent } from 'pixi.js'
import { getStore } from '../../store/store.ts'
import { InteractionStatus, ToolsName } from '../../store/storeTypes.ts'
import { canvasUtils } from '../canvasUtils.ts'
import { renderCanvas } from '../render/renderCanvas.ts'

export const hoverElements = {
	init() {
		getStore.app.stage.on('pointerover', (e) => {
			this.toggleHover(e, true)
		})
		getStore.app.stage.on('pointerout', (e) => {
			this.toggleHover(e, false)
		})
	},

	/**
	 * Переключает в данных показ/скрытие обводки сообщающий о наведение на элемент
	 * @param e
	 * @param isUnderHover — навели ли на фигуру
	 */
	toggleHover(e: FederatedPointerEvent, isUnderHover: boolean) {
		const elemUnderCursor = canvasUtils.getElemUnderCursor(e)
		if (!elemUnderCursor) return

		if (getStore.tool !== ToolsName.Select || elemUnderCursor.interactionStatus === InteractionStatus.Selected)
			return

		getStore.updateCanvasElement(elemUnderCursor.id, {
			interactionStatus: isUnderHover ? InteractionStatus.Hovered : InteractionStatus.Default,
		})

		renderCanvas.render()
	},
}
