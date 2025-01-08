import { arrUtils } from '../../utils/arrayUtils.ts'
import { getStore } from '../store/store.ts'
import { InteractionStatus } from '../store/storeTypes.ts'

// Методы для работы с холстом
export const canvasUtils = {
	/** Получение размера холста */
	getCanvasSize() {
		const windowWidth = document.documentElement.clientWidth
		const windowHeight = document.documentElement.clientHeight

		return {
			width: windowWidth,
			height: windowHeight,
		}
	},

	/** Делает все элементы невыделенными */
	makeAllElemsUnselected() {
		// Если уже есть выделенный элемент, то сделать его невыделенным.
		const selectedElem = arrUtils.getItemByPropNameAndValue(
			getStore.canvas.elements,
			'interactionStatus',
			InteractionStatus.Selected,
		)

		if (!selectedElem) return

		getStore.updateCanvasElement(selectedElem.id, {
			interactionStatus: InteractionStatus.Default,
		})
	},
}
