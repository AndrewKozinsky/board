import { pixiUtils } from '../../../utils/pixiUtils.ts'
import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { FigureElement } from '../elems/FigureElement.ts'
import { transformRect } from './transformRect.ts'

export const renderCanvas = {
	/** Отрисовка сцены */
	render() {
		requestAnimationFrame(() => this.buildScene())
	},

	/** Сборка сцены */
	buildScene() {
		const { $mainContainer, app, $contentContainer } = canvasStore

		const { scale, offset, cursor } = canvasStore

		$mainContainer.scale = scale / 100
		$contentContainer.position.x = offset.x
		$contentContainer.position.y = offset.y

		app.canvas.style.cursor = cursor

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
