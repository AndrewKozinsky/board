import { FederatedPointerEvent } from 'pixi.js'
import { KeyboardKeys, keyboardUtils } from '../../../utils/keyboardUtils.ts'
import { canvasStore } from '../../canvasStore/canvasStoreProxy.ts'
import { ToolsName } from '../../types/commonTypes.ts'
import { boardConfig } from '../canvas/boardConfig.ts'
import { deleteElements } from '../elemInteraction/deleteElements.ts'
import { renderCanvas } from '../render/renderCanvas.ts'
import { canvasUtils } from '../canvas/canvasUtils.ts'
import { FigureElement } from './FigureElement.ts'

let drawnFigure: null | FigureElement = null

// Рисует фигуру
export const drawFigures = {
	isSpacePressed: false,

	// Ставит обработчики для рисования фигуры
	init() {
		canvasStore.app.stage.on('pointerdown', (e) => this.onMouseDown(e))
		canvasStore.app.stage.on('pointermove', (e) => this.onMouseMove(e))
		canvasStore.app.stage.on('pointerup', this.onMouseUp)

		// Просто проверка, что клавиши в конфигурации не изменились
		if (boardConfig.commands.moveCanvas2.hotKeys[0] === KeyboardKeys.Space) {
			this.checkIsSpacePressed()
		} else {
			throw new Error('Клавиша перемещение холста изменилась')
		}
	},

	checkIsSpacePressed() {
		document.addEventListener('keydown', (event) => {
			if (keyboardUtils.isSpacePressed(event) && !event.repeat) {
				this.isSpacePressed = true
			}
		})

		document.addEventListener('keyup', (event) => {
			if (keyboardUtils.isSpacePressed(event)) {
				this.isSpacePressed = false
			}
		})
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
	onMouseDown(e: FederatedPointerEvent) {
		const { startX, startY } = canvasStore.mouseMetrics
		if (canvasStore.tool.name !== ToolsName.Shape || this.isSpacePressed || !startX || !startY) return

		// Convert mouse coordinates to unscaled canvas space
		const { x, y } = this.toUnscaledCoordinates(startX, startY)

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
	onMouseMove(e: FederatedPointerEvent) {
		const { startX, startY } = canvasStore.mouseMetrics
		if (!drawnFigure || this.isSpacePressed || !startX || !startY) return

		let width = 0
		let height = 0
		const scale = canvasStore.scale / 100

		// Если рисуют снизу справа наверх слева
		if (startX > e.x && startY > e.y) {
			const { x, y } = this.toUnscaledCoordinates(e.x, e.y)
			drawnFigure.x = x
			drawnFigure.y = y

			width = (startX - e.x) / scale
			height = (startY - e.y) / scale
		}
		// Если рисуют снизу слева наверх слева
		else if (startX < e.x && startY > e.y) {
			const { y } = this.toUnscaledCoordinates(e.x, e.y)
			drawnFigure.y = y

			width = (e.x - startX) / scale
			height = (startY - e.y) / scale
		}
		// Если рисуют сверху слева вниз слева
		else if (startX < e.x && startY < e.y) {
			width = (e.x - startX) / scale
			height = (e.y - startY) / scale
		}
		// Если рисуют сверху справа вниз налево
		else if (startX > e.x && startY < e.y) {
			const { x } = this.toUnscaledCoordinates(e.x, e.y)
			drawnFigure.x = x

			width = (startX - e.x) / scale
			height = (e.y - startY) / scale
		}

		// Draw the rectangle
		drawnFigure.width = width
		drawnFigure.height = height

		renderCanvas.render()
	},

	/** Обработчик отпускания мыши после рисования фигуры */
	onMouseUp() {
		if (!drawnFigure) return

		if (!drawnFigure.width && !drawnFigure.height) {
			deleteElements.deleteElemById(drawnFigure!.id)
		}

		drawnFigure = null
	},
}
