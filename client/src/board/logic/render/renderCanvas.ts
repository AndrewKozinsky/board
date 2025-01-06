import { getStore } from '../../store/store.ts'
import { pixiUtils } from '../../../utils/pixiUtils.ts'
import { figureRenderer } from './figureRenderer.ts'

export const renderCanvas = {
	/** Отрисовка сцены */
	render() {
		requestAnimationFrame(() => this.buildScene())
	},

	/** Сборка сцены */
	buildScene() {
		const { app } = getStore

		const { scale } = getStore.canvas
		const { offset } = getStore.canvas
		const { cursor } = getStore

		app.stage.position.x = offset.x
		app.stage.position.y = offset.y
		app.stage.scale = scale / 100

		app.canvas.style.cursor = cursor

		this.drawElements()

		pixiUtils.rerenderFonts(scale)
	},

	drawElements() {
		const elements = getStore.canvas.elements

		for (let i = 0; i < elements.length; i++) {
			const element = elements[i]

			if (element.type === 'figureElement') {
				figureRenderer.drawFigure(elements, element)
			}
		}
	},
}
