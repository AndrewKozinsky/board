import { FederatedPointerEvent } from 'pixi.js'
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

	/**
	 * Так как все части трансформирующего прямоугольника должны иметь такую же толщину линий
	 * при любом масштабе холста, то их следует умножить на множитель масштаба.
	 */
	getScaleMultiplier() {
		return 1 / (getStore.canvas.scale / 100)
	},

	getElemUnderCursor(e: FederatedPointerEvent) {
		const elemLabel = e.target.label
		const elemId = +elemLabel

		if (isNaN(elemId)) {
			return false
		}

		return arrUtils.getItemByPropNameAndValue(getStore.canvas.elements, 'id', elemId)
	},
}
