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

		drawnFigure = new FigureElement({
			x: e.global.x - canvasStore.offset.x,
			y: e.global.y - canvasStore.offset.y,
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

		const width = e.x - this.startMouseX
		const height = e.y - this.startMouseY

		// drawnFigure.width = width
		// drawnFigure.height = height
		drawnFigure.width = width * canvasUtils.getScaleMultiplier()
		drawnFigure.height = height * canvasUtils.getScaleMultiplier()

		renderCanvas.render()
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
