import { Graphics } from 'pixi.js'
import { boardColors } from './boardConfig.ts'
import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { canvasUtils } from './canvasUtils.ts'
import { renderCanvas } from '../render/renderCanvas.ts'

// Фоновый прямоугольник чтобы ловить щелчки по холсту и убирать выделение со всех элементов
export const canvasBackground = {
	/** Создание фонового прямоугольника */
	init() {
		const bgRectGraphic = new Graphics()
		bgRectGraphic.label = 'backgroundRect'

		this.drawRectangle(bgRectGraphic)

		this.addEventListeners(bgRectGraphic)

		canvasStore.app.stage.addChild(bgRectGraphic)
	},

	/**
	 * Отрисовка прямоугольника
	 * @param bgRectGraphic — объект графики куда рисуется прямоугольник.
	 */
	drawRectangle(bgRectGraphic: Graphics) {
		bgRectGraphic.clear()

		const canvasSize = canvasUtils.getCanvasSize()
		bgRectGraphic.rect(0, 0, canvasSize.width, canvasSize.height)
		bgRectGraphic.fill(boardColors.canvasBackground)
	},

	/** Добавление слушателей событий для фонового прямоугольника */
	addEventListeners(bgRectGraphic: Graphics) {
		bgRectGraphic.eventMode = 'static'

		bgRectGraphic.addEventListener('pointerdown', () => {
			this.clearSelection()
		})

		addEventListener('resize', () => {
			this.drawRectangle(bgRectGraphic)
		})
	},

	/** Убирает выделение с выделенного элемента */
	clearSelection() {
		canvasUtils.makeAllElemsUnselected()

		renderCanvas.render()
	},
}
