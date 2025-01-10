export enum ToolsName {
	Select = 'select',
	Shape = 'shape',
}

export type Tools = SelectTool | ShapeTool

type SelectTool = {
	name: ToolsName.Select
}

type ShapeTool = {
	name: ToolsName.Shape
	shape: ShapeElementFigure
	status: ShapeToolStatus
}
export enum ShapeToolStatus {
	ReadyForDrawing = 'readyForDrawing',
	Drawing = 'drawing',
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
