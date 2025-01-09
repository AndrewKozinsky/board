import { pixiUtils } from '../../../utils/pixiUtils.ts'
import { deleteElements } from '../elemInteraction/deleteElements.ts'
import { canvasStore } from '../store/canvasStore.ts'
import { figureRenderer } from './figureRenderer.ts'
import { transformRectRenderer } from './transformRectRenderer.ts'

export const renderCanvas = {
	/** Отрисовка сцены */
	render() {
		requestAnimationFrame(() => this.buildScene())
	},

	/** Сборка сцены */
	buildScene() {
		const { $mainContainer, app } = canvasStore

		const { scale, offset, cursor } = canvasStore

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
		const elemsData = canvasStore.canvas.elements

		for (let i = 0; i < elemsData.length; i++) {
			const elemData = elemsData[i]

			if (elemData.type === 'figureElement') {
				figureRenderer.entryPoint(elemData)
			}
		}

		deleteElements.eraseDeletedElems()
		deleteElements.deleteFromDataElemsWithDeletionStatus()
	},
}
