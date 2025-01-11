import { keyboardUtils } from '../../../utils/keyboardUtils.ts'
import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { canvasUtils } from '../canvas/canvasUtils.ts'
import { FigureElement } from '../elems/FigureElement.ts'
import { renderCanvas } from '../render/renderCanvas.ts'

export const deleteElements = {
	init() {
		document.addEventListener('keydown', (event) => {
			if (keyboardUtils.isDeletePressed(event)) {
				this.deleteSelectedElems()
			}
		})
	},

	/** Удаляет выделенные на сцене элементы */
	deleteSelectedElems() {
		this.setDeletionStatusForSelectedElems()
		renderCanvas.render()
		this.eraseDeletedElems()
	},

	/**
	 * Удаляет элемент по переданному идентификатору
	 * @param id — идентификатор элемента
	 */
	deleteElemById(id: number) {
		this.setDeletionStatusForElemWithId(id)
		renderCanvas.render()
		this.eraseDeletedElems()
	},

	/** Помечает выделенные элементы на удаление */
	setDeletionStatusForSelectedElems() {
		const selectedElems = canvasUtils.getSelectedElems()
		if (!selectedElems.length) return

		selectedElems.forEach((elem) => (elem.delete = true))
	},

	/** Помечает элемент с указанным идентификатором на удаление */
	setDeletionStatusForElemWithId(id: number) {
		const elem = canvasUtils.getElemById(id)
		if (!elem) return

		elem.delete = true
	},

	/** Стирает на холсте и в данных элементы помеченные на удаление */
	eraseDeletedElems() {
		canvasStore.elements.forEach((elem) => {
			if (!elem.delete || !(elem instanceof FigureElement)) return

			elem.graphics!.destroy()
		})

		canvasStore.elements = canvasStore.elements.filter((elem) => !elem.delete)
	},
}
