import { isKeysPressed } from '../../../utils/keyboardUtils.ts'
import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { Cursor } from '../../canvasStore/canvasStoreTypes.ts'
import { ShapeElementFigure, ShapeToolStatus, ToolsName } from '../../types/commonTypes.ts'
import { boardConfig } from '../utils/boardConfig.ts'
import { canvasUtils } from '../utils/canvasUtils.ts'

export const tools = {
	/** Добавляет обработчики на выбор инструмента через горячие клавиши */
	init() {
		document.addEventListener('keydown', (event) => {
			if (isKeysPressed(event, boardConfig.commands.switchToSelectTool.hotKeys)) {
				this.changeTool(ToolsName.Select) // Zoom out (scale up by 25%)
			} else if (isKeysPressed(event, boardConfig.commands.switchToFigureTool.hotKeys)) {
				this.changeTool(ToolsName.Shape) // Zoom in (scale down by 25%)
			}
		})
	},

	/**
	 * Делает активным указанный инструмент
	 * @param toolName — имя инструмента
	 */
	changeTool(toolName: ToolsName) {
		if (canvasStore.tool.name !== ToolsName.Select) {
			canvasUtils.makeAllElemsUnselected()
		}

		if (toolName === ToolsName.Select) {
			canvasStore.tool = {
				name: ToolsName.Select,
			}
			canvasUtils.clearCursor()
		} else if (toolName === ToolsName.Shape) {
			canvasStore.tool = {
				name: ToolsName.Shape,
				shape: ShapeElementFigure.Rectangle,
				status: ShapeToolStatus.ReadyForDrawing,
			}

			canvasUtils.setCursor(Cursor.DrawRectangle)
		}
	},

	/**
	 * Делает активным указанный инструмент
	 * @param toolName — имя инструмента
	 */
	changeFigureShape(toolName: ShapeElementFigure) {
		canvasStore.tool = {
			name: ToolsName.Shape,
			shape: toolName,
			status: ShapeToolStatus.ReadyForDrawing,
		}

		const cursorNameMapper: Record<ShapeElementFigure, Cursor> = {
			[ShapeElementFigure.Rectangle]: Cursor.DrawRectangle,
			[ShapeElementFigure.Circle]: Cursor.DrawCircle,
			[ShapeElementFigure.Diamond]: Cursor.DrawDiamond,
			[ShapeElementFigure.Hexagon]: Cursor.DrawHexagon,
			[ShapeElementFigure.LeftArrow]: Cursor.DrawLeftArrow,
			[ShapeElementFigure.RightArrow]: Cursor.DrawRightArrow,
			[ShapeElementFigure.SpeechBalloon]: Cursor.DrawSpeechBalloon,
			[ShapeElementFigure.Star]: Cursor.DrawStar,
			[ShapeElementFigure.Triangle]: Cursor.DrawTriangle,
		}

		canvasUtils.setCursor(cursorNameMapper[toolName])
	},
}
