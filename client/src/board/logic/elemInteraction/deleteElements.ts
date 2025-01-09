import { keyboardUtils } from '../../../utils/keyboardUtils.ts'
import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { canvasUtils } from '../canvasUtils.ts'
import { renderCanvas } from '../render/renderCanvas.ts'

export const deleteElements = {
	init() {
		document.addEventListener('keydown', (event) => {
			if (keyboardUtils.isDeletePressed(event)) {
				this.setDeletionStatusForSelectedElems()
			}
		})
	},

	/** Помечает выделенные элементы на удаление */
	setDeletionStatusForSelectedElems() {
		const selectedElems = canvasUtils.getSelectedElems()
		if (!selectedElems.length) return

		selectedElems.forEach((elem) => (elem.delete = true))
		renderCanvas.render()
	},

	/** Стирает на холсте элементы помеченные на удаление */
	eraseDeletedElems() {
		canvasStore.elements.forEach((elem) => {
			if (!elem.delete || elem.type !== 'figureElement') return

			elem.graphics!.destroy()
		})
	},

	/** Удаляет данные элементов отмеченных на удаление */
	deleteFromDataElemsWithDeletionStatus() {
		canvasStore.elements = canvasStore.elements.filter((elem) => !elem.delete)
	},
}
