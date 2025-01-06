import { Application, Graphics, Renderer } from 'pixi.js'

export enum Cursor {
	Default = 'default',
	Palm = 'grab',
	Dragging = 'grabbing',
}

export type BoardStore = {
	app: Application<Renderer>
	canvas: {
		devicePixelRatio: number
		// Уровень масштабирования холста. 1 = 100%
		scale: number
		// Смещение холста
		offset: {
			x: number
			y: number
		}
		elements: CanvasElement[]
	}
	cursor: Cursor
}

export type CanvasElement = ShapeElement | TextElement

type ElementBase = {
	id: number
	x: number
	y: number
}

export type ShapeElement = ElementBase & {
	type: 'figureElement'
	graphics: null | Graphics
	width: number
	height: number
	shape: ShapeElementFigure
	backgroundColor: string
}

export enum ShapeElementFigure {
	Rectangle = 'rectangle',
	Circle = 'circle',
	Triangle = 'triangle',
	Diamond = 'diamond',
	Hexagon = 'hexagon',
	Star = 'star',
	LeftArrow = 'leftArrow',
	RightArrow = 'rightArrow',
	SpeechBalloon = 'speechBalloon',
}

type TextElement = ElementBase & {
	type: 'textElement'
}
