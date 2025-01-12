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
	startX: 0,
	startY: 0,

	init() {
		canvasStore.app.stage.on('pointerdown', (e) => this.onInteractiveElemMouseDown(e))
		canvasStore.app.stage.on('pointermove', (e) => this.onInteractiveElemMove(e))
		canvasStore.app.stage.on('pointerup', this.onInteractiveElemMouseUp)
	},

	/**
	 * Фигуры могут рисовать на масштабированном холсте.
	 * Функция переводит переданную координату в как будто её нарисовали на холсте без масштабирования.
	 * @param x — координата X
	 * @param y — координата Y
	 */
	toUnscaledCoordinates(x: number, y: number) {
		const canvasSize = canvasUtils.getCanvasSize()

		const centerX = canvasSize.width / 2
		const centerY = canvasSize.height / 2
		const scale = canvasStore.scale / 100

		const unscaledX = (x - centerX) / scale + centerX
		const unscaledY = (y - centerY) / scale + centerY

		return { x: unscaledX, y: unscaledY }
	},

	/**
	 * Обработчик нажатия мыши по холсту для начала рисования фигуры
	 * @param e — объект события
	 */
	onInteractiveElemMouseDown(e: FederatedPointerEvent) {
		if (canvasStore.tool.name !== ToolsName.Shape) return

		this.startX = e.global.x
		this.startY = e.global.y

		// Convert mouse coordinates to unscaled canvas space
		const { x, y } = this.toUnscaledCoordinates(this.startX, this.startY)

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

		let width = 0
		let height = 0
		const scale = canvasStore.scale / 100

		// Если русуют с низу справа наверх слева
		/*if (this.startX > e.x && this.startY > e.y) {
			width = (this.startX - e.x) / scale
			height = (this.startY - e.y) / scale
		}*/

		// Adjust width and height for the unscaled canvas
		width = (e.x - this.startX) / scale
		height = (e.y - this.startY) / scale

		// Draw the rectangle
		drawnFigure.width = width
		drawnFigure.height = height

		renderCanvas.render()
	},

	/** Обработчик отпускания мыши после рисования фигуры */
	onInteractiveElemMouseUp() {
		if (!drawnFigure) return

		if (!drawnFigure.width && !drawnFigure.height) {
			deleteElements.deleteElemById(drawnFigure!.id)
		}

		drawnFigure = null
	},
}
