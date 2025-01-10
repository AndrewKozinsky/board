import { Application, Container, ContainerChild, Renderer } from 'pixi.js'
import { FigureElement } from '../logic/elements/FigureElement.ts'
import { TextElement } from '../logic/elements/TextElement.ts'
import { Tools } from '../types/commonTypes.ts'

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

	_tool: Tools
	get tool(): Tools
	set tool(val: Tools)

	// Уровень масштабирования холста. 1 = 100%
	_scale: number
	get scale(): number
	set scale(val: number)

	// Смещение холста
	offset: {
		x: number
		y: number
	}
	cursor: Cursor
	elements: CanvasElement[]
}

export type CanvasElement = FigureElement | TextElement
