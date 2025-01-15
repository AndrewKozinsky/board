import { throttle } from '../../utils/miscUtils.ts'
import { FigureElement } from '../logic/elems/FigureElement.ts'
import { TextElement } from '../logic/elems/TextElement.ts'
import { useUIStore } from '../uiStore/uiStore.ts'
import { UIElement, UIFigureElement, UITextElement } from '../uiStore/uiStoreTypes.ts'
import { canvasStoreObj } from './canvasStore.ts'
import { CanvasElement, InteractionStatus } from './canvasStoreTypes.ts'

const afterElementsArrChangedThrottled = throttle(afterElementsArrChanged, 250)

/**
 * Создаёт обёртку над массивом элементов
 * @param arr — исходный массив элементов холста
 */
export const createElementsArrayProxy = (arr: CanvasElement[] = []) => {
	return new Proxy(arr, {
		set(target, property, value: CanvasElement, receiver) {
			const canvasElemProxy = createCanvasElementProxy(value)
			const result = Reflect.set(target, property, canvasElemProxy, receiver)

			if (property !== 'length') {
				afterElementsArrChangedThrottled()
			}

			return result
		},
	})
}

/**
 * Создаёт обёртку над объектом элемента холста
 * @param element — экземпляр класса элемента холста
 */
function createCanvasElementProxy(element: number | CanvasElement) {
	if (typeof element === 'number') {
		return element
	}

	return new Proxy(element, {
		get(target, property) {
			return Reflect.get(target, property)
		},
		set(target, property, value) {
			// @ts-ignore
			target[property] = value
			afterElementsArrChangedThrottled()
			return true
		},
	})
}

/**
 * Функция, срабатывающая после изменения длины массива элементов холста и после изменения самих элементов.
 * Находит в массиве выделенный элемент и пишет в useUIStore.
 * Если не находит, то заносит null.
 */
function afterElementsArrChanged() {
	const selectedElement = canvasStoreObj.elements.find(
		(elem) => elem.interactionStatus === InteractionStatus.Selected,
	)

	if (!selectedElement) {
		useUIStore.setState({ selectedElem: null })
		return
	}

	useUIStore.setState({ selectedElem: convertCanvasElementForUIStore(selectedElement) })
}

/**
 * Переводит объект элемента холста в элемент холста для пользовательского интерфейса
 * @param canvasElement — объект элемента холста
 */
function convertCanvasElementForUIStore(canvasElement: CanvasElement): UIElement {
	if (canvasElement instanceof FigureElement) {
		return {
			id: canvasElement.id,
			type: 'figureElement',
			backgroundColor: canvasElement.backgroundColor,
		} satisfies UIFigureElement
	} else if (canvasElement instanceof TextElement) {
		return {
			id: canvasElement.id,
			type: 'textElement',
		} satisfies UITextElement
	}

	const _exhaustiveCheck: never = canvasElement
	throw new Error(`Unhandled element type: ${_exhaustiveCheck}`)
}
