import { FederatedPointerEvent } from 'pixi.js'
import { canvasUtils } from '../canvasUtils.ts'
import { renderCanvas } from '../render/renderCanvas.ts'
import { canvasStore } from '../store/canvasStore.ts'
import { InteractionStatus, ToolsName } from '../store/canvasStoreTypes.ts'

// При щелчке по управляющим элементам сюда будут помещаться данные выделенной фигуры
// для правильного расчёта после перемещения.
const shapeInitialCoords = { x: 0, y: 0 }
let elemUnderCursorId: null | number = null

// Глобальные координаты точки по которой щелкнули мышью
// для начала перетаскивания управляющих прямоугольников для изменения размера фигуры.
let startMouseX = 0
let startMouseY = 0

export const moveElements = {
	init() {
		canvasStore.app.stage.on('pointerdown', (e) => {
			this.setMovingStartCoords(e)
		})

		canvasStore.app.stage.on('pointermove', (e) => {
			this.moveElemUnderCursor(e)
		})

		canvasStore.app.stage.on('pointerup', (e) => {
			this.clearMovingStartCoords()
		})
	},

	setMovingStartCoords(e: FederatedPointerEvent) {
		const elemUnderCursor = canvasUtils.getElemUnderCursor(e)
		if (!elemUnderCursor) return

		elemUnderCursorId = elemUnderCursor.id

		if (canvasStore.tool !== ToolsName.Select || elemUnderCursor.interactionStatus !== InteractionStatus.Selected)
			return

		startMouseX = e.global.x
		startMouseY = e.global.y

		shapeInitialCoords.x = elemUnderCursor.x
		shapeInitialCoords.y = elemUnderCursor.y
	},

	/**
	 * Обработчик движения мыши для перемещения выделенного элемента.
	 * @param e e — объект события
	 */
	moveElemUnderCursor(e: FederatedPointerEvent) {
		if (!elemUnderCursorId) return

		if (canvasStore.tool !== ToolsName.Select) return

		const diffX = (e.global.x - startMouseX) * canvasUtils.getScaleMultiplier()
		const diffY = (e.global.y - startMouseY) * canvasUtils.getScaleMultiplier()

		const newX = shapeInitialCoords.x + diffX
		const newY = shapeInitialCoords.y + diffY

		canvasUtils.updateCanvasElement(elemUnderCursorId, { x: newX, y: newY })

		renderCanvas.render()
	},

	clearMovingStartCoords() {
		elemUnderCursorId = null
	},
}
