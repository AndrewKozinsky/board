import { Tools } from '../types/commonTypes.ts'

export type UIStore = {
	// Текущий инструмент
	tool: Tools
	canvas: {
		scale: number
	}
	// Выделенный элемент
	selectedElem: null | UIElement
	// Установщик масштаба холста
	setCanvasScale: (scale: number) => void
}

export type UIElement = UIFigureElement | UITextElement

export type UIFigureElement = {
	id: number
	type: 'figureElement'
	backgroundColor: null | string
}

export type UITextElement = {
	id: number
	type: 'textElement'
}
