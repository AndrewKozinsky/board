import { ToolsName } from '../types/commonTypes.ts'
import { getUIStore, useUIStore } from '../uiStore/uiStore'
import { CanvasStoreType, Cursor, InteractionStatus, ShapeElementFigure } from './canvasStoreTypes.ts'

export const canvasStore: CanvasStoreType = {
	app: null as any,
	devicePixelRatio: window.devicePixelRatio || 1,
	$bgContainer: null as any,
	$mainContainer: null as any,

	_tool: ToolsName.Select,
	get tool() {
		return this._tool
	},
	set tool(value: ToolsName) {
		useUIStore.setState({ tool: value })
		this._tool = value
	},

	_scale: 100,
	get scale() {
		return this._scale
	},
	set scale(value: number) {
		getUIStore.setCanvasScale(value)
		this._scale = value
	},

	offset: {
		x: 120,
		y: 90,
	},
	cursor: Cursor.Default,
	elements: [
		{
			id: 1,
			type: 'figureElement',
			shape: ShapeElementFigure.Rectangle,
			graphics: null,
			x: 150,
			y: 70,
			width: 100,
			height: 200,
			backgroundColor: 'ccc',
			delete: false,
		},
		{
			id: 2,
			type: 'figureElement',
			shape: ShapeElementFigure.Star,
			graphics: null,
			x: 350,
			y: 270,
			width: 200,
			height: 200,
			backgroundColor: 'ccc',
			interactionStatus: InteractionStatus.Selected,
			delete: false,
		},
	],
}
