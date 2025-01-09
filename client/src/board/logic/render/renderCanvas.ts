import { getStore } from '../../store/store.ts'
import { pixiUtils } from '../../../utils/pixiUtils.ts'
import { figureRenderer } from './figureRenderer.ts'
import { transformRectRenderer } from './transformRectRenderer.ts'

export const renderCanvas = {
	/** Отрисовка сцены */
	render() {
		requestAnimationFrame(() => this.buildScene())
	},

	/** Сборка сцены */
	buildScene() {
		const { $mainContainer, app } = getStore

		const { scale } = getStore.canvas
		const { offset } = getStore.canvas
		const { cursor } = getStore

		$mainContainer.position.x = offset.x
		$mainContainer.position.y = offset.y
		$mainContainer.scale = scale / 100

		app.canvas.style.cursor = cursor

		this.drawElements()
		transformRectRenderer.init()

		pixiUtils.rerenderFonts(scale)
	},

	/* Отрисовка элементов сцены */
	drawElements() {
		const elemsData = getStore.canvas.elements

		for (let i = 0; i < elemsData.length; i++) {
			const elemData = elemsData[i]

			if (elemData.type === 'figureElement') {
				figureRenderer.entryPoint(elemData)
			}
		}
	},
}
