import { keyboardUtils } from '../../../utils/keyboardUtils.ts'
import { getStore, updateStore } from '../../store/store.ts'
import { InteractionStatus } from '../../store/storeTypes.ts'
import { canvasUtils } from '../canvasUtils.ts'
import { renderCanvas } from '../render/renderCanvas.ts'

export const deleteElements = {
	init() {
		document.addEventListener('keydown', (event) => {
			if (keyboardUtils.isDeletePressed(event)) {
				this.deleteSelectedElems()
			}
		})
	},

	/** Удаляет выделенные элементы */
	deleteSelectedElems() {
		const selectedElems = canvasUtils.getSelectedElems()
		if (!selectedElems.length) return

		updateStore.canvas.elements = getStore.canvas.elements.filter(
			(elem) => elem.interactionStatus !== InteractionStatus.Selected,
		)

		renderCanvas.render()
	},
}
