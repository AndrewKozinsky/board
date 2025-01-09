import { keyboardUtils } from '../../../utils/keyboardUtils.ts'
import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { canvasUtils } from '../misc/canvasUtils.ts'
import { FigureElement } from '../render/figureRenderer.ts'
import { renderCanvas } from '../render/renderCanvas.ts'

export const deleteElements = {
	init() {
		document.addEventListener('keydown', (event) => {
			if (keyboardUtils.isDeletePressed(event)) {
				this.deleteSelectedElems()
			}
		})
	},

	deleteSelectedElems() {
		this.setDeletionStatusForSelectedElems()
		renderCanvas.render()
		this.eraseDeletedElems()
		this.deleteFromDataElemsWithDeletionStatus()
	},

	/** Помечает выделенные элементы на удаление */
	setDeletionStatusForSelectedElems() {
		const selectedElems = canvasUtils.getSelectedElems()
		if (!selectedElems.length) return

		selectedElems.forEach((elem) => (elem.delete = true))
	},

	/** Стирает на холсте элементы помеченные на удаление */
	eraseDeletedElems() {
		canvasStore.elements.forEach((elem) => {
			if (!elem.delete || !(elem instanceof FigureElement)) return

			elem.graphics!.destroy()
		})
	},

	/** Удаляет данные элементов отмеченных на удаление */
	deleteFromDataElemsWithDeletionStatus() {
		canvasStore.elements = canvasStore.elements.filter((elem) => !elem.delete)
	},
}
