import { Assets, Graphics, Sprite, Text, Texture } from 'pixi.js'
import { getElementIdx, getHighestElementId } from '../../../utils/arrayUtils.ts'
import { getStore, updateStore } from '../../store/store.ts'
import { pixiUtils } from '../../../utils/pixiUtils.ts'
import { CanvasElement, ShapeElement, ShapeElementFigure } from '../../store/storeTypes.ts'

type DrawShapeSettings = {
	graphics: Graphics
	x: number
	y: number
	width: number
	height: number
	color: string
}

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

		updateShapeFn({
			graphics,
			x: figureData.x,
			y: figureData.y,
			width: figureData.width,
			height: figureData.height,
			color: figureData.backgroundColor,
		})
	},

	/**
	 * Принимает тип фигуры и возвращает функцию обновляющую параметры фигуры этого типа
	 * @param figureType — тип фигуры
	 */
	getUpdateFigureFunction(figureType: ShapeElementFigure) {
		const obj: Record<ShapeElementFigure, (settings: DrawShapeSettings) => void> = {
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
	 * @param params — данные для обновления фигуры
	 */
	updateRectangle(params: DrawShapeSettings) {
		const { graphics, x, y, width, height, color } = params

		graphics.rect(x, y, width, height).fill(color)
	},

	/**
	 * Обновляет параметры круга
	 * @param params — данные для обновления фигуры
	 */
	updateCircle(params: DrawShapeSettings) {
		const { graphics, x, y, width, height, color } = params

		graphics.ellipse(x, y, width, height).fill(color)
	},

	/**
	 * Обновляет параметры треугольника
	 * @param params — данные для обновления фигуры
	 */
	updateTriangle(params: DrawShapeSettings) {
		const { graphics, x, y, width, height, color } = params

		graphics
			.moveTo(x + width / 2, y)
			.lineTo(x + width, y + height)
			.lineTo(x, y + height)
			.closePath()
			.fill(color)
	},

	/**
	 * Обновляет параметры ромба
	 * @param params — данные для обновления фигуры
	 */
	updateDiamond(params: DrawShapeSettings) {
		const { graphics, x, y, width, height, color } = params

		graphics
			.moveTo(x + width / 2, y)
			.lineTo(x + width, y + height / 2)
			.lineTo(x + width / 2, y + height)
			.lineTo(x, y + height / 2)
			.closePath()
			.fill(color)
	},

	/**
	 * Обновляет параметры шестиугольника
	 * @param params — данные для обновления фигуры
	 */
	updateHexagon(params: DrawShapeSettings) {
		const { graphics, x, y, width, height, color } = params

		const onePcWidth = width / 100

		graphics
			.moveTo(x + onePcWidth * 23, y) // 1
			.lineTo(x + onePcWidth * 77, y) // 2
			.lineTo(x + width, y + height / 2) // 3
			.lineTo(x + onePcWidth * 77, y + height) // 4
			.lineTo(x + onePcWidth * 23, y + height) // 5
			.lineTo(x, y + height / 2) // 6
			.closePath()
			.fill(color)
	},

	/**
	 * Обновляет параметры звезды
	 * @param params — данные для обновления фигуры
	 */
	updateStar(params: DrawShapeSettings) {
		const { graphics, x, y, width, height, color } = params

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
			.fill(color)
	},

	/**
	 * Обновляет параметры стрелки влево
	 * @param params — данные для обновления фигуры
	 */
	updateLeftArrow(params: DrawShapeSettings) {
		const { graphics, x, y, width, height, color } = params

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
			.fill(color)
	},

	/**
	 * Обновляет параметры стрелки вправо
	 * @param params — данные для обновления фигуры
	 */
	updateRightArrow(params: DrawShapeSettings) {
		const { graphics, x, y, width, height, color } = params

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
			.fill(color)
	},

	/**
	 * Обновляет параметры выноски с речью
	 * @param params — данные для обновления фигуры
	 */
	updateSpeechBalloon(params: DrawShapeSettings) {
		const { graphics, x, y, width, height, color } = params

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
			.fill(color)
	},
}
