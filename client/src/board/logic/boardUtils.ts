import { arrUtils } from '../../utils/arrayUtils.ts'
import { getStore } from '../store/store.ts'
import { InteractionStatus } from '../store/storeTypes.ts'

export const boardUtils = {
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
