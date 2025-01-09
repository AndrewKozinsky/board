import { Application, Container, ContainerChild, Graphics, Renderer } from 'pixi.js'

export enum ToolsName {
	Select = 'select',
	Shape = 'shape',
}

export enum Cursor {
	Default = 'default',
	Palm = 'grab',
	Dragging = 'grabbing',
}

export enum InteractionStatus {
	Default = 'default',
	Hovered = 'hovered',
	Selected = 'selected',
}

export type CanvasStoreType = {
	app: Application<Renderer>
	devicePixelRatio: number
	$bgContainer: Container<ContainerChild>
	$mainContainer: Container<ContainerChild>
	// Уровень масштабирования холста. 1 = 100%
	tool: ToolsName
	// Масштабирование холста
	scale: number
	// Смещение холста
	offset: {
		x: number
		y: number
	}
	canvas: {
		elements: CanvasElement[]
	}
	cursor: Cursor
}

export type CanvasElement = ShapeElement | TextElement

type ElementBase = {
	id: number
	x: number
	y: number
	// Навели ли на элемент (должна появиться синяя обводка)
	interactionStatus?: InteractionStatus
	delete: boolean
}

export type ShapeElement = ElementBase & {
	type: 'figureElement'
	shape: ShapeElementFigure
	// Если элемента ещё нет на холсте, то тут будет null.
	// Если есть, то ссылка объект Graphics потому что я обновляю параметры этого объекта, а не создаю новый при каждой перерисовке.
	graphics: null | Graphics
	width: number
	height: number
	backgroundColor?: string
	strokeColor?: string
	strokeWidth?: number
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
