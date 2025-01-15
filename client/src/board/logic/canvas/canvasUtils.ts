import { FederatedPointerEvent } from 'pixi.js'
import { arrUtils } from '../../../utils/arrayUtils.ts'
import { canvasStore } from '../../canvasStore/canvasStoreProxy.ts'
import { CanvasElement, CanvasStoreType, Cursor, InteractionStatus } from '../../canvasStore/canvasStoreTypes.ts'
import { renderCanvas } from '../render/renderCanvas.ts'

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

		selectedElem.interactionStatus = InteractionStatus.Default
	},

	/**
	 * Так как все части трансформирующего прямоугольника должны иметь такую же толщину линий
	 * при любом масштабе холста, то их следует умножить на множитель масштаба.
	 */
	getScaleMultiplier() {
		return 100 / canvasStore.scale
	},

	/**
	 * Получение элемента под курсором мыши
	 * @param e — объект события
	 */
	getElemUnderCursor(e: FederatedPointerEvent) {
		const elemLabel = e.target.label
		const elemId = +elemLabel

		if (isNaN(elemId)) {
			return false
		}

		return arrUtils.getItemByPropNameAndValue(canvasStore.elements, 'id', elemId)
	},

	/** Получить элементы сцены отмеченные выделенными */
	getSelectedElems() {
		return canvasStore.elements.filter((elem) => elem.interactionStatus === InteractionStatus.Selected)
	},

	/**
	 * Получить элемент по идентификатору
	 * @param id — идентификатор элемента
	 */
	getElemById(id: number) {
		return canvasStore.elements.find((elem) => elem.id === id)
	},

	/**
	 * Изменение данных указанного элемента холста
	 * @param elementId — идентификатор элемента
	 * @param elementNewData — новые данные элемента
	 */
	updateCanvasElement: (elementId: number, elementNewData: Partial<CanvasElement>) => {
		const elementIdx = arrUtils.getItemIdxByPropNameAndValue(canvasStore.elements, 'id', elementId)
		if (elementIdx < 0) return

		Object.assign(canvasStore.elements[elementIdx], elementNewData)
	},

	/**
	 * Установка курсора для холста
	 * @param cursorType — тип курсора
	 */
	setCursor(cursorType: Cursor) {
		canvasStore.cursor = cursorType
		renderCanvas.render()
	},

	/**
	 * Установка курсора для холста
	 * @param cursorType — тип курсора
	 */
	setSpecialCursor(cursorType: CanvasStoreType['specialCursor']) {
		canvasStore.specialCursor = cursorType
		renderCanvas.render()
	},
}
