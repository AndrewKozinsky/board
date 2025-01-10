import { Graphics } from 'pixi.js'
import { OutlineFilter } from 'pixi-filters'
import { arrUtils } from '../../../utils/arrayUtils.ts'
import { boardColors } from '../misc/boardConfig.ts'
import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { InteractionStatus } from '../../canvasStore/canvasStoreTypes.ts'
import { ShapeElementFigure } from '../../types/commonTypes.ts'

type FigureElementInput = {
	id?: number
	x: number
	y: number
	shape: ShapeElementFigure
	width: number
	height: number
	backgroundColor: string
	strokeColor?: string
	strokeWidth?: number
}

export class FigureElement {
	id: number
	x: number
	y: number
	// Навели ли на элемент (должна появиться синяя обводка)
	interactionStatus = InteractionStatus.Default
	delete = false
	graphics: Graphics
	shape: ShapeElementFigure
	width: number
	height: number
	backgroundColor: string
	strokeColor?: string
	strokeWidth?: number

	constructor(inputData: FigureElementInput) {
		this.id = inputData.id ?? arrUtils.getHighestItemId(canvasStore.elements) + 1
		const graphics = new Graphics()
		this.graphics = graphics

		// Включение интерактивности чтобы заработали обработчики событий на фигуре
		graphics.eventMode = 'static'
		graphics.label = this.id.toString()
		this.x = inputData.x
		this.y = inputData.y
		this.shape = inputData.shape
		this.width = inputData.width
		this.height = inputData.height
		this.backgroundColor = inputData.backgroundColor
		this.strokeColor = inputData.strokeColor
		this.strokeWidth = inputData.strokeWidth

		canvasStore.$mainContainer.addChild(graphics)

		this.updateFigure()
	}

	/** Обновляет фигуру по переданным данным */
	updateFigure() {
		this.graphics.clear()

		this.updateFigureCoords()

		this.graphics.x = this.x
		this.graphics.y = this.y

		this.setShapeStyle()
	}

	/** Устанавливает стили фигуры */
	setShapeStyle() {
		const { backgroundColor, strokeColor, strokeWidth = 0 } = this

		if (backgroundColor) {
			this.graphics.fill(backgroundColor)
		}

		if (strokeColor) {
			this.graphics.stroke({ color: strokeColor, width: strokeWidth })
		}

		if (this.interactionStatus === InteractionStatus.Hovered) {
			const filter = new OutlineFilter({
				color: boardColors.selected,
				quality: 10,
				thickness: 1,
			})
			filter.antialias = 'on'
			filter.resolution = canvasStore.devicePixelRatio

			this.graphics.filters = [filter]
		} else {
			this.graphics.filters = []
		}
	}

	/**
	 * Принимает тип фигуры и возвращает функцию обновляющую параметры фигуры этого типа
	 */
	updateFigureCoords() {
		const obj: Record<ShapeElementFigure, () => void> = {
			[ShapeElementFigure.Rectangle]: () => this.updateRectangle(),
			[ShapeElementFigure.Circle]: () => this.updateCircle(),
			[ShapeElementFigure.Triangle]: () => this.updateTriangle(),
			[ShapeElementFigure.Diamond]: () => this.updateDiamond(),
			[ShapeElementFigure.Hexagon]: () => this.updateHexagon(),
			[ShapeElementFigure.Star]: () => this.updateStar(),
			[ShapeElementFigure.LeftArrow]: () => this.updateLeftArrow(),
			[ShapeElementFigure.RightArrow]: () => this.updateRightArrow(),
			[ShapeElementFigure.SpeechBalloon]: () => this.updateSpeechBalloon(),
		}

		return obj[this.shape]()
	}

	/** Обновляет параметры прямоугольника */
	updateRectangle() {
		const { width, height, graphics } = this

		graphics.rect(0, 0, width, height)
	}

	/** Обновляет параметры круга */
	updateCircle() {
		const { width, height, graphics } = this

		graphics.ellipse(0, 0, width, height)
	}

	/** Обновляет параметры треугольника */
	updateTriangle() {
		const { width, height, graphics } = this

		graphics
			.moveTo(width / 2, 0)
			.lineTo(width, height)
			.lineTo(0, height)
			.closePath()
	}

	/** Обновляет параметры ромба */
	updateDiamond() {
		const { width, height, graphics } = this

		graphics
			.moveTo(width / 2, 0)
			.lineTo(width, height / 2)
			.lineTo(width / 2, height)
			.lineTo(0, height / 2)
			.closePath()
	}

	/** Обновляет параметры шестиугольника */
	updateHexagon() {
		const { width, height, graphics } = this

		const onePcWidth = width / 100

		graphics
			.moveTo(onePcWidth * 23, 0) // 1
			.lineTo(onePcWidth * 77, 0) // 2
			.lineTo(width, height / 2) // 3
			.lineTo(onePcWidth * 77, height) // 4
			.lineTo(onePcWidth * 23, height) // 5
			.lineTo(0, height / 2) // 6
			.closePath()
	}

	/** Обновляет параметры звезды */
	updateStar() {
		const { width, height, graphics } = this

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
	}

	/** Обновляет параметры стрелки влево */
	updateLeftArrow() {
		const { width, height, graphics } = this

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
	}

	/** Обновляет параметры стрелки вправо */
	updateRightArrow() {
		const { width, height, graphics } = this

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
	}

	/** Обновляет параметры выноски с речью */
	updateSpeechBalloon() {
		const { width, height, graphics } = this

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
	}
}
