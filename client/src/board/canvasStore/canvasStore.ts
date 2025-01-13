import { ShapeElementFigure, ShapeToolStatus, Tools, ToolsName } from '../types/commonTypes.ts'
import { getUIStore, useUIStore } from '../uiStore/uiStore'
import { CanvasStoreType, Cursor } from './canvasStoreTypes.ts'

export const canvasStore: CanvasStoreType = {
	app: null as any,
	devicePixelRatio: window.devicePixelRatio || 1,
	$bgContainer: null as any,
	$mainContainer: null as any,
	$contentContainer: null as any,

	_tool: {
		name: ToolsName.Select,
	},
	/*_tool: {
		name: ToolsName.Shape,
		shape: ShapeElementFigure.Rectangle,
		status: ShapeToolStatus.ReadyForDrawing,
	},*/
	get tool() {
		return this._tool
	},
	set tool(value: Tools) {
		useUIStore.setState({ tool: value })
		this._tool = value
	},

	_scale: 100,
	// _scale: 7,
	get scale() {
		return this._scale
	},
	set scale(value: number) {
		getUIStore.setCanvasScale(value)
		this._scale = value
	},
	scalePivotX: 0.5,
	scalePivotY: 0.5,

	offset: {
		x: 0,
		y: 0,
	},

	cursor: Cursor.Default,
	specialCursor: null,

	pressedKeys: {
		ctrl: false,
		alt: false,
		shift: false,
	},

	elements: [],
}
