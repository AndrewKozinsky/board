import { Graphics } from 'pixi.js'
import { OutlineFilter } from 'pixi-filters'
import { getElementIdx } from '../../../utils/arrayUtils.ts'
import { getStore, updateStore } from '../../store/store.ts'
import { CanvasElement, ShapeElement, ShapeElementFigure } from '../../store/storeTypes.ts'
import { boardColors } from '../boardConfig.ts'

export const figureRenderer = {
	/**
	 * По полученным данным фигуры отрисовывает новую на холсте или изменяет уже существующую
	 * @param elements — массив всех элементов сцены
	 * @param figureData — данные фигуры
	 */
	drawFigure(elements: CanvasElement[], figureData: ShapeElement) {
		const { graphics } = figureData

		graphics === null ? this.drawNewFigure(elements, figureData) : this.updateFigure(graphics!, figureData)
	},

	/**
	 * Создаёт новую фигуру на холсте по переданным данным
	 * @param elements — массив всех элементов сцены
	 * @param figureData — данные фигуры
	 */
	drawNewFigure(elements: CanvasElement[], figureData: ShapeElement) {
		const graphics = new Graphics()

		this.updateFigure(graphics, figureData)

		getStore.app.stage.addChild(graphics)

		// Поставить ссылку на созданный элемент в Хранилище
		const elementIdx = getElementIdx(elements, 'id', figureData.id)
		if (getStore.canvas.elements[elementIdx].type === 'figureElement') {
			updateStore.canvas.elements[elementIdx] = {
				...getStore.canvas.elements[elementIdx],
				graphics: graphics,
			}
		}
	},

	/**
	 * Обновляет фигуру по переданным данным
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param figureData — данные фигуры
	 */
	updateFigure(graphics: Graphics, figureData: ShapeElement) {
		const updateShapeFn = this.getUpdateFigureFunction(figureData.shape)

		updateShapeFn(graphics, figureData)
		this.setStyle(graphics, figureData)
	},

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
	 * @param shapeData — данные для обновления фигуры
	 */
	updateRectangle(graphics: Graphics, shapeData: ShapeElement) {
		const { x, y, width, height } = shapeData

		graphics.rect(x, y, width, height)
	},

	/**
	 * Обновляет параметры круга
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param shapeData — данные для обновления фигуры
	 */
	updateCircle(graphics: Graphics, shapeData: ShapeElement) {
		const { x, y, width, height } = shapeData

		graphics.ellipse(x, y, width, height)
	},

	/**
	 * Обновляет параметры треугольника
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param shapeData — данные для обновления фигуры
	 */
	updateTriangle(graphics: Graphics, shapeData: ShapeElement) {
		const { x, y, width, height } = shapeData

		graphics
			.moveTo(x + width / 2, y)
			.lineTo(x + width, y + height)
			.lineTo(x, y + height)
			.closePath()
	},

	/**
	 * Обновляет параметры ромба
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param shapeData — данные для обновления фигуры
	 */
	updateDiamond(graphics: Graphics, shapeData: ShapeElement) {
		const { x, y, width, height } = shapeData

		graphics
			.moveTo(x + width / 2, y)
			.lineTo(x + width, y + height / 2)
			.lineTo(x + width / 2, y + height)
			.lineTo(x, y + height / 2)
			.closePath()
	},

	/**
	 * Обновляет параметры шестиугольника
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param shapeData — данные для обновления фигуры
	 */
	updateHexagon(graphics: Graphics, shapeData: ShapeElement) {
		const { x, y, width, height } = shapeData

		const onePcWidth = width / 100

		graphics
			.moveTo(x + onePcWidth * 23, y) // 1
			.lineTo(x + onePcWidth * 77, y) // 2
			.lineTo(x + width, y + height / 2) // 3
			.lineTo(x + onePcWidth * 77, y + height) // 4
			.lineTo(x + onePcWidth * 23, y + height) // 5
			.lineTo(x, y + height / 2) // 6
			.closePath()
	},

	/**
	 * Обновляет параметры звезды
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param shapeData — данные для обновления фигуры
	 */
	updateStar(graphics: Graphics, shapeData: ShapeElement) {
		const { x, y, width, height } = shapeData

		const onePcWidth = width / 100
		const onePcHeight = height / 100

		graphics
			.moveTo(x + width / 2, y) // 1
			.lineTo(x + onePcWidth * 62, y + onePcHeight * 38) // 2
			.lineTo(x + width, y + onePcHeight * 38) // 3
			.lineTo(x + onePcWidth * 69, y + onePcHeight * 62) // 4
			.lineTo(x + onePcWidth * 81, y + height) // 5
			.lineTo(x + width / 2, y + onePcHeight * 76) // 6
			.lineTo(x + onePcWidth * 19, y + height) // 7
			.lineTo(x + onePcWidth * 31, y + onePcHeight * 62) // 8
			.lineTo(x, y + onePcHeight * 38) // 9
			.lineTo(x + onePcWidth * 38, y + onePcHeight * 38) // 10
			.closePath()
	},

	/**
	 * Обновляет параметры стрелки влево
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param shapeData — данные для обновления фигуры
	 */
	updateLeftArrow(graphics: Graphics, shapeData: ShapeElement) {
		const { x, y, width, height } = shapeData

		const onePcWidth = width / 100
		const onePcHeight = height / 100

		graphics
			.moveTo(x, y + height / 2) // 1
			.lineTo(x + onePcWidth * 50, y) // 2
			.lineTo(x + onePcWidth * 50, y + onePcHeight * 28) // 3
			.lineTo(x + width, y + onePcHeight * 28) // 4
			.lineTo(x + width, y + onePcHeight * 72) // 5
			.lineTo(x + onePcWidth * 50, y + onePcHeight * 72) // 6
			.lineTo(x + onePcWidth * 50, y + height) // 7
			.closePath()
	},

	/**
	 * Обновляет параметры стрелки вправо
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param shapeData — данные для обновления фигуры
	 */
	updateRightArrow(graphics: Graphics, shapeData: ShapeElement) {
		const { x, y, width, height } = shapeData

		const onePcWidth = width / 100
		const onePcHeight = height / 100

		graphics
			.moveTo(x, y + onePcHeight * 28) // 1
			.lineTo(x + onePcWidth * 50, y + onePcHeight * 28) // 2
			.lineTo(x + onePcWidth * 50, y) // 3
			.lineTo(x + width, y + height / 2) // 4
			.lineTo(x + onePcWidth * 50, y + height) // 5
			.lineTo(x + onePcWidth * 50, y + onePcHeight * 72) // 6
			.lineTo(x, y + onePcHeight * 72) // 7
			.closePath()
	},

	/**
	 * Обновляет параметры выноски с речью
	 * @param graphics — ссылка на объект Graphics из Pixi.js
	 * @param shapeData — данные для обновления фигуры
	 */
	updateSpeechBalloon(graphics: Graphics, shapeData: ShapeElement) {
		const { x, y, width, height } = shapeData

		const onePcWidth = width / 100
		const onePcHeight = height / 100

		graphics
			.moveTo(x, y) // 1
			.lineTo(x + width, y) // 2
			.lineTo(x + width, y + onePcHeight * 71) // 3
			.lineTo(x + onePcWidth * 34, y + onePcHeight * 71) // 4
			.lineTo(x + onePcWidth * 13, y + height) // 5
			.lineTo(x + onePcWidth * 13, y + onePcHeight * 71) // 6
			.lineTo(x, y + onePcHeight * 71) // 7
			.closePath()
	},

	setStyle(graphics: Graphics, shapeData: ShapeElement) {
		const { backgroundColor, strokeColor, strokeWidth = 0 } = shapeData

		if (backgroundColor) {
			graphics.fill(backgroundColor)
		}

		if (strokeColor) {
			graphics.stroke({ color: strokeColor, width: strokeWidth })
		}

		if (shapeData.underHover) {
			const filter = new OutlineFilter({
				color: boardColors.selected,
				quality: 10,
				thickness: 2,
			})
			filter.antialias = 'on'
			filter.resolution = getStore.canvas.devicePixelRatio

			graphics.filters = [filter]
		}
	},
}
