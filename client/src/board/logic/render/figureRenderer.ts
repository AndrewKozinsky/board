import { Graphics } from 'pixi.js'
import { OutlineFilter } from 'pixi-filters'
import { boardColors } from '../boardConfig.ts'
import { canvasStore } from '../store/canvasStore.ts'
import { canvasUtils } from '../canvasUtils.ts'
import { InteractionStatus, ShapeElement, ShapeElementFigure } from '../store/canvasStoreTypes.ts'

export const figureRenderer = {
	/**
	 * По полученным данным фигуры отрисовывает новую на холсте или изменяет уже существующую
	 * @param figureData — данные фигуры
	 */
	entryPoint(figureData: ShapeElement) {
		const { graphics } = figureData

		graphics === null ? this.drawNewFigure(figureData) : this.updateFigure(graphics!, figureData)
	},

	/**
	 * Создаёт новую фигуру на холсте по переданным данным
	 * @param figureData — данные фигуры
	 */
	drawNewFigure(figureData: ShapeElement) {
		const graphics = new Graphics()

		// Включение интерактивности чтобы заработали обработчики событий на фигуре
		graphics.eventMode = 'static'
		graphics.label = figureData.id.toString()

		this.updateFigure(graphics, figureData)

		canvasStore.$mainContainer.addChild(graphics)

		canvasUtils.updateCanvasElement(figureData.id, { graphics })
	},

	/**
	 * Обновляет фигуру по переданным данным
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param figureData — данные фигуры
	 */
	updateFigure(graphics: Graphics, figureData: ShapeElement) {
		graphics.clear()

		const updateShapeFn = figureShape.getUpdateFigureFunction(figureData.shape)
		updateShapeFn(graphics, figureData)

		graphics.x = figureData.x
		graphics.y = figureData.y

		this.setShapeStyle(graphics, figureData)
	},

	/**
	 * Устанавливает стили фигуры
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param figureData — данные фигуры
	 */
	setShapeStyle(graphics: Graphics, figureData: ShapeElement) {
		const { backgroundColor, strokeColor, strokeWidth = 0 } = figureData

		if (backgroundColor) {
			graphics.fill(backgroundColor)
		}

		if (strokeColor) {
			graphics.stroke({ color: strokeColor, width: strokeWidth })
		}

		if (figureData.interactionStatus === InteractionStatus.Hovered) {
			const filter = new OutlineFilter({
				color: boardColors.selected,
				quality: 10,
				thickness: 1,
			})
			filter.antialias = 'on'
			filter.resolution = canvasStore.devicePixelRatio

			graphics.filters = [filter]
		} else {
			graphics.filters = []
		}
	},
}

const figureShape = {
	/**
	 * Принимает тип фигуры и возвращает функцию обновляющую параметры фигуры этого типа
	 * @param figureType — тип фигуры
	 */
	getUpdateFigureFunction(figureType: ShapeElementFigure) {
		const obj: Record<ShapeElementFigure, (graphics: Graphics, settings: ShapeElement) => void> = {
			[ShapeElementFigure.Rectangle]: this.updateRectangle,
			[ShapeElementFigure.Circle]: this.updateCircle,
			[ShapeElementFigure.Triangle]: this.updateTriangle,
			[ShapeElementFigure.Diamond]: this.updateDiamond,
			[ShapeElementFigure.Hexagon]: this.updateHexagon,
			[ShapeElementFigure.Star]: this.updateStar,
			[ShapeElementFigure.LeftArrow]: this.updateLeftArrow,
			[ShapeElementFigure.RightArrow]: this.updateRightArrow,
			[ShapeElementFigure.SpeechBalloon]: this.updateSpeechBalloon,
		}

		return obj[figureType]
	},

	/**
	 * Обновляет параметры прямоугольника
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param figureData — данные фигуры
	 */
	updateRectangle(graphics: Graphics, figureData: ShapeElement) {
		const { width, height } = figureData

		graphics.rect(0, 0, width, height)
	},

	/**
	 * Обновляет параметры круга
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param figureData — данные фигуры
	 */
	updateCircle(graphics: Graphics, figureData: ShapeElement) {
		const { width, height } = figureData

		graphics.ellipse(0, 0, width, height)
	},

	/**
	 * Обновляет параметры треугольника
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param figureData — данные фигуры
	 */
	updateTriangle(graphics: Graphics, figureData: ShapeElement) {
		const { width, height } = figureData

		graphics
			.moveTo(width / 2, 0)
			.lineTo(width, height)
			.lineTo(0, height)
			.closePath()
	},

	/**
	 * Обновляет параметры ромба
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param figureData — данные фигуры
	 */
	updateDiamond(graphics: Graphics, figureData: ShapeElement) {
		const { width, height } = figureData

		graphics
			.moveTo(width / 2, 0)
			.lineTo(width, height / 2)
			.lineTo(width / 2, height)
			.lineTo(0, height / 2)
			.closePath()
	},

	/**
	 * Обновляет параметры шестиугольника
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param figureData — данные фигуры
	 */
	updateHexagon(graphics: Graphics, figureData: ShapeElement) {
		const { width, height } = figureData

		const onePcWidth = width / 100

		graphics
			.moveTo(onePcWidth * 23, 0) // 1
			.lineTo(onePcWidth * 77, 0) // 2
			.lineTo(width, height / 2) // 3
			.lineTo(onePcWidth * 77, height) // 4
			.lineTo(onePcWidth * 23, height) // 5
			.lineTo(0, height / 2) // 6
			.closePath()
	},

	/**
	 * Обновляет параметры звезды
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param figureData — данные фигуры
	 */
	updateStar(graphics: Graphics, figureData: ShapeElement) {
		const { width, height } = figureData

		const onePcWidth = width / 100
		const onePcHeight = height / 100

		graphics
			.moveTo(width / 2, 0) // 1
			.lineTo(onePcWidth * 62, onePcHeight * 38) // 2
			.lineTo(width, onePcHeight * 38) // 3
			.lineTo(onePcWidth * 69, onePcHeight * 62) // 4
			.lineTo(onePcWidth * 81, height) // 5
			.lineTo(width / 2, onePcHeight * 76) // 6
			.lineTo(onePcWidth * 19, height) // 7
			.lineTo(onePcWidth * 31, onePcHeight * 62) // 8
			.lineTo(0, onePcHeight * 38) // 9
			.lineTo(onePcWidth * 38, onePcHeight * 38) // 10
			.closePath()
	},

	/**
	 * Обновляет параметры стрелки влево
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param figureData — данные фигуры
	 */
	updateLeftArrow(graphics: Graphics, figureData: ShapeElement) {
		const { width, height } = figureData

		const onePcWidth = width / 100
		const onePcHeight = height / 100

		graphics
			.moveTo(0, height / 2) // 1
			.lineTo(onePcWidth * 50, 0) // 2
			.lineTo(onePcWidth * 50, onePcHeight * 28) // 3
			.lineTo(width, onePcHeight * 28) // 4
			.lineTo(width, onePcHeight * 72) // 5
			.lineTo(onePcWidth * 50, onePcHeight * 72) // 6
			.lineTo(onePcWidth * 50, height) // 7
			.closePath()
	},

	/**
	 * Обновляет параметры стрелки вправо
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param figureData — данные фигуры
	 */
	updateRightArrow(graphics: Graphics, figureData: ShapeElement) {
		const { width, height } = figureData

		const onePcWidth = width / 100
		const onePcHeight = height / 100

		graphics
			.moveTo(0, onePcHeight * 28) // 1
			.lineTo(onePcWidth * 50, onePcHeight * 28) // 2
			.lineTo(onePcWidth * 50, 0) // 3
			.lineTo(width, height / 2) // 4
			.lineTo(onePcWidth * 50, height) // 5
			.lineTo(onePcWidth * 50, onePcHeight * 72) // 6
			.lineTo(0, onePcHeight * 72) // 7
			.closePath()
	},

	/**
	 * Обновляет параметры выноски с речью
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param figureData — данные фигуры
	 */
	updateSpeechBalloon(graphics: Graphics, figureData: ShapeElement) {
		const { width, height } = figureData

		const onePcWidth = width / 100
		const onePcHeight = height / 100

		graphics
			.moveTo(0, 0) // 1
			.lineTo(width, 0) // 2
			.lineTo(width, onePcHeight * 71) // 3
			.lineTo(onePcWidth * 34, onePcHeight * 71) // 4
			.lineTo(onePcWidth * 13, height) // 5
			.lineTo(onePcWidth * 13, onePcHeight * 71) // 6
			.lineTo(0, onePcHeight * 71) // 7
			.closePath()
	},
}
