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

export type BoardStore = {
	app: Application<Renderer>
	$bgContainer: Container<ContainerChild>
	$mainContainer: Container<ContainerChild>
	tool: ToolsName
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
	updateCanvasElement: (elementId: number, elementNewData: Partial<CanvasElement>) => void
	updateCanvasElementMovingSettings: (
		elementId: number,
		newMovingSettings: Pick<CanvasElementMovingSettings, 'startMouseX' | 'startMouseY'>,
	) => void
}

export type CanvasElement = ShapeElement | TextElement

type ElementBase = {
	id: number
	x: number
	y: number
	// Навели ли на элемент (должна появиться синяя обводка)
	interactionStatus?: InteractionStatus
	moving: CanvasElementMovingSettings
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

// Данные элемента необходимые для перемещения
export type CanvasElementMovingSettings = {
	// Координаты элемента до перемещения
	shapeInitialX: number
	shapeInitialY: number
	// Координата точку по которой щелкнули мышью для начала перемещения.
	// Если стоят нули, то значит мышь отпустили.
	// Таким образом можно понять, что курсор находится над этой фигурой.
	startMouseX: number
	startMouseY: number
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
