import { FederatedPointerEvent } from 'pixi.js'
import { arrUtils } from '../../utils/arrayUtils.ts'
import { canvasStore } from './store/canvasStore.ts'
import { CanvasElement, InteractionStatus } from './store/canvasStoreTypes.ts'

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
			canvasStore.canvas.elements,
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

		return arrUtils.getItemByPropNameAndValue(canvasStore.canvas.elements, 'id', elemId)
	},

	getSelectedElems() {
		// Если уже есть выделенный элемент, то сделать его невыделенным.
		return canvasStore.canvas.elements.filter((elem) => elem.interactionStatus === InteractionStatus.Selected)
	},

	updateCanvasElement: (elementId: number, elementNewData: Partial<CanvasElement>) => {
		const elementIdx = arrUtils.getItemIdxByPropNameAndValue(canvasStore.canvas.elements, 'id', elementId)
		if (elementIdx < 0) return

		Object.assign(canvasStore.canvas.elements[elementIdx], elementNewData)
	},
}
