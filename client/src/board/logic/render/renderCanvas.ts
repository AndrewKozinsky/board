import { pixiUtils } from '../../../utils/pixiUtils.ts'
import { canvasStore } from '../../canvasStore/canvasStoreProxy.ts'
import { FigureElement } from '../elems/FigureElement.ts'
import { transformRect } from './transformRect.ts'

export const renderCanvas = {
	/** Отрисовка сцены */
	render() {
		requestAnimationFrame(() => this.buildScene())
	},

	/** Сборка сцены */
	buildScene() {
		const { app, $mainContainer, $contentContainer, scale, offset, cursor, specialCursor } = canvasStore

		$mainContainer.scale = scale / 100
		$contentContainer.position.x = offset.x
		$contentContainer.position.y = offset.y

		app.canvas.style.cursor = specialCursor ? specialCursor : cursor

		this.drawElements()
		transformRect.init()

		pixiUtils.rerenderFonts(scale)
	},

	/* Отрисовка элементов сцены */
	drawElements() {
		const elemsData = canvasStore.elements

		for (let i = 0; i < elemsData.length; i++) {
			const elemData = elemsData[i]

			if (elemData instanceof FigureElement) {
				elemData.updateFigure()
			}
		}
	},
}
