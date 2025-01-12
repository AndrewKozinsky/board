import { FederatedPointerEvent } from 'pixi.js'
import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { ToolsName } from '../../types/commonTypes.ts'
import { deleteElements } from '../elemInteraction/deleteElements.ts'
import { renderCanvas } from '../render/renderCanvas.ts'
import { canvasUtils } from '../canvas/canvasUtils.ts'
import { FigureElement } from './FigureElement.ts'

let drawnFigure: null | FigureElement = null

export const drawFigures = {
	// Глобальные координаты точки по которой щелкнули мышью
	// для начала рисования фигуры.
	startMouseX: 0,
	startMouseY: 0,

	init() {
		canvasStore.app.stage.on('pointerdown', (e) => this.onInteractiveElemMouseDown(e))
		canvasStore.app.stage.on('pointermove', (e) => this.onInteractiveElemMove(e))
		canvasStore.app.stage.on('pointerup', this.onInteractiveElemMouseUp)
	},

	/**
	 * Обработчик нажатия мыши по холсту для начала рисования фигуры
	 * @param e — объект события
	 */
	onInteractiveElemMouseDown(e: FederatedPointerEvent) {
		if (canvasStore.tool.name !== ToolsName.Shape) return

		this.startMouseX = e.global.x
		this.startMouseY = e.global.y

		// Convert mouse coordinates to unscaled canvas space
		const { x, y } = this.toUnscaledCoordinates(this.startMouseX, this.startMouseY)

		drawnFigure = new FigureElement({
			x: x - canvasStore.offset.x,
			y: y - canvasStore.offset.y,
			shape: canvasStore.tool.shape,
			height: 0,
			width: 0,
		})

		canvasStore.elements.push(drawnFigure)
	},

	/**
	 * Обработчик движения мыши для рисования размеров фигуры.
	 * В соответствии с движением изменяется размер рисуемой фигуры.
	 * @param e e — объект события
	 */
	onInteractiveElemMove(e: FederatedPointerEvent) {
		if (!drawnFigure) return

		// Adjust width and height for the unscaled canvas
		const rectWidth = (e.x - this.startMouseX) / (canvasStore.scale / 100)
		const rectHeight = (e.y - this.startMouseY) / (canvasStore.scale / 100)

		// Draw the rectangle
		drawnFigure.width = rectWidth
		drawnFigure.height = rectHeight

		renderCanvas.render()
	},

	// Convert mouse coordinates to unscaled canvas space
	toUnscaledCoordinates(mouseX: number, mouseY: number): { x: number; y: number } {
		const canvasSize = canvasUtils.getCanvasSize()
		const centerX = canvasSize.width / 2
		const centerY = canvasSize.height / 2
		const scale = canvasStore.scale / 100

		const unscaledX = (mouseX - centerX) / scale + centerX
		const unscaledY = (mouseY - centerY) / scale + centerY
		return { x: unscaledX, y: unscaledY }
	},

	/** Обработчик отпускания мыши после рисования фигуры */
	onInteractiveElemMouseUp: function () {
		if (!drawnFigure) return

		if (!drawnFigure.width && !drawnFigure.height) {
			deleteElements.deleteElemById(drawnFigure!.id)
		}

		drawnFigure = null
	},
}
