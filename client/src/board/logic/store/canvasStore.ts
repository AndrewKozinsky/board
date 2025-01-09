import { CanvasStoreType, Cursor, InteractionStatus, ShapeElementFigure, ToolsName } from './canvasStoreTypes.ts'

export const canvasStore: CanvasStoreType = {
	app: null as any,
	devicePixelRatio: window.devicePixelRatio || 1,
	$bgContainer: null as any,
	$mainContainer: null as any,
	tool: ToolsName.Select,
	scale: 100,
	offset: {
		x: 120,
		y: 90,
	},
	canvas: {
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
	},
	cursor: Cursor.Default,
}
