import { FederatedPointerEvent } from 'pixi.js'
import { arrUtils } from '../../utils/arrayUtils.ts'
import { getStore } from '../store/store.ts'
import { InteractionStatus, ToolsName } from '../store/storeTypes.ts'
import { canvasUtils } from './canvasUtils.ts'
import { renderCanvas } from './render/renderCanvas.ts'

export const moveElements = {
	init() {
		getStore.app.stage.eventMode = 'static'
		getStore.app.stage.on('pointermove', (e) => {
			this.moveElemUnderCursor(e)
		})

		getStore.app.stage.on('pointerdown', (e) => {
			console.log(e.target.label)
		})
	},

	/**
	 * Обработчик движения мыши для перемещения выделенного элемента.
	 * @param e e — объект события
	 */
	moveElemUnderCursor(e: FederatedPointerEvent) {
		// Найду фигуры, у которых в объекте moving свойства startMouseX и startMouseY не имеют нулевые значения
		const elemUnderCursor = getStore.canvas.elements.find(
			(elem) => elem.moving.startMouseX && elem.moving.startMouseY,
		)

		if (!elemUnderCursor) return
		if (getStore.tool !== ToolsName.Select || elemUnderCursor.interactionStatus !== InteractionStatus.Selected)
			return

		const diffX = (e.global.x - elemUnderCursor.moving.startMouseX) * canvasUtils.getScaleMultiplier()
		const diffY = (e.global.y - elemUnderCursor.moving.startMouseY) * canvasUtils.getScaleMultiplier()

		const newX = elemUnderCursor.moving.shapeInitialX + diffX
		const newY = elemUnderCursor.moving.shapeInitialY + diffY

		getStore.updateCanvasElement(elemUnderCursor.id, { x: newX, y: newY })

		renderCanvas.render()
	},
}
