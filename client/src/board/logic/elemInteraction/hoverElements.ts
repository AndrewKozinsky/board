import { FederatedPointerEvent, log2 } from 'pixi.js'
import { ToolsName } from '../../types/commonTypes.ts'
import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { canvasUtils } from '../misc/canvasUtils.ts'
import { renderCanvas } from '../render/renderCanvas.ts'
import { InteractionStatus } from '../../canvasStore/canvasStoreTypes.ts'

export const hoverElements = {
	init() {
		canvasStore.app.stage.on('pointerover', (e) => {
			this.toggleHover(e, true)
		})
		canvasStore.app.stage.on('pointerout', (e) => {
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

		if (canvasStore.tool !== ToolsName.Select || elemUnderCursor.interactionStatus === InteractionStatus.Selected)
			return

		canvasUtils.updateCanvasElement(elemUnderCursor.id, {
			interactionStatus: isUnderHover ? InteractionStatus.Hovered : InteractionStatus.Default,
		})

		renderCanvas.render()
	},
}
