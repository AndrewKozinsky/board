import { FederatedPointerEvent } from 'pixi.js'
import { arrUtils } from '../../utils/arrayUtils.ts'
import { canvasStore } from '../canvasStore/canvasStore.ts'
import { CanvasElement, InteractionStatus } from '../canvasStore/canvasStoreTypes.ts'

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
			canvasStore.elements,
			'interactionStatus',
			InteractionStatus.Selected,
		)

		if (!selectedElem) return

		this.updateCanvasElement(selectedElem.id, {
			interactionStatus: InteractionStatus.Default,
		})
	},

	/**
	 * Так как все части трансформирующего прямоугольника должны иметь такую же толщину линий
	 * при любом масштабе холста, то их следует умножить на множитель масштаба.
	 */
	getScaleMultiplier() {
		return 1 / (canvasStore.scale / 100)
	},

	getElemUnderCursor(e: FederatedPointerEvent) {
		const elemLabel = e.target.label
		const elemId = +elemLabel

		if (isNaN(elemId)) {
			return false
		}

		return arrUtils.getItemByPropNameAndValue(canvasStore.elements, 'id', elemId)
	},

	getSelectedElems() {
		// Если уже есть выделенный элемент, то сделать его невыделенным.
		return canvasStore.elements.filter((elem) => elem.interactionStatus === InteractionStatus.Selected)
	},

	updateCanvasElement: (elementId: number, elementNewData: Partial<CanvasElement>) => {
		const elementIdx = arrUtils.getItemIdxByPropNameAndValue(canvasStore.elements, 'id', elementId)
		if (elementIdx < 0) return

		Object.assign(canvasStore.elements[elementIdx], elementNewData)
	},
}
