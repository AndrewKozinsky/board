import { Graphics } from 'pixi.js'
import { getStore } from '../store/store.ts'
import { boardColors } from './boardConfig.ts'
import { boardUtils } from './boardUtils.ts'
import { renderCanvas } from './render/renderCanvas.ts'

// Фоновый прямоугольник, который нужен, чтобы ловить щелчки.
// После этого должно пропасть выделение со всех элементов.
export const canvasBg = {
	createCanvasBg() {
		const bgRectGraphic = new Graphics()
		getStore.app.stage.addChild(bgRectGraphic)

		bgRectGraphic.rect(0, 0, 600, 600)
		bgRectGraphic.fill(boardColors.canvasBackground)
		bgRectGraphic.eventMode = 'static'

		bgRectGraphic.addEventListener('pointerdown', () => {
			this.removeSelectionFromElems()
		})

		// TODO Этот прямоугольник как-то нужно сделать чтобы автоматически перемещался
		//  в зависимости от смещения камеры. И менял размеры в зависимости от
		// масштаба камеры.
	},

	/** Убирает выделение с выделенного элемента */
	removeSelectionFromElems() {
		boardUtils.makeAllElemsUnselected()

		renderCanvas.render()
	},
}
