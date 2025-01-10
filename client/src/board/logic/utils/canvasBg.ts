import { Graphics } from 'pixi.js'
import { boardColors } from './boardConfig.ts'
import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { canvasUtils } from './canvasUtils.ts'
import { renderCanvas } from '../render/renderCanvas.ts'

// Фоновый прямоугольник чтобы ловить щелчки по холсту и убирать выделение со всех элементов
export const canvasBg = {
	/** Создание фонового прямоугольника */
	create() {
		const bgRectGraphic = new Graphics()
		this.drawRectangle(bgRectGraphic)

		this.addEventListeners(bgRectGraphic)

		canvasStore.$bgContainer.addChild(bgRectGraphic)
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

	/** Убирает выделение с выделенного элемента */
	clearSelection() {
		canvasUtils.makeAllElemsUnselected()

		renderCanvas.render()
	},
}
