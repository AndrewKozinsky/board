import { FederatedPointerEvent, Graphics, Rectangle } from 'pixi.js'
import { arrUtils } from '../../../utils/arrayUtils.ts'
import { getStore } from '../../store/store.ts'
import { InteractionStatus, ShapeElement } from '../../store/storeTypes.ts'
import { boardColors } from '../boardConfig.ts'
import { renderCanvas } from './renderCanvas.ts'

// Названия интерактивных элементов с помощью которых изменяется размер выделенной фигуры.
enum InteractiveElemNames {
	LeftTop = 'leftTopCorner',
	RightTop = 'rightTopCorner',
	RightBottom = 'rightBottom',
	LeftBottom = 'leftBottom',
	Top = 'topSide',
	Right = 'rightSide',
	Bottom = 'bottomSide',
	Left = 'leftSide',
}

// Тут будет храниться графика Pixi для отрисовки частей трансформирующего прямоугольника.
let sideRectsGraphics: Graphics[] = []
let cornerRectsGraphics: Graphics[] = []

// При щелчке по управляющим элементам сюда будут помещаться данные выделенной фигуры
// для правильного расчёта после трансформации.
const shapeInitialCoords = { x: 0, y: 0, width: 0, height: 0 }

// Глобальные координаты точки по которой щелкнули мышью
// для начала перетаскивания управляющих прямоугольников для изменения размера фигуры.
let startMouseX = 0
let startMouseY = 0

// Название интерактивного прямоугольника, по которому щелкнули.
let selectedInteractiveRectName: null | InteractiveElemNames = null

type BoxCoords = {
	x: number
	y: number
	width: number
	height: number
}

// Набор методов для создания и управления трансформирующего прямоугольника
export const transformRectRenderer = {
	/**
	 * Функция, запускаемая при каждой перерисовке сцены.
	 * Тут определяется нужно ли создавать графику для отрисовки трансформирующего прямоугольника
	 * или сразу приступить к изменению размера и координат для правильного местоположения и вида.
	 */
	init() {
		// Данные выделенной фигуры
		const selectedFigure = arrUtils.getItemByPropNameAndValue(
			getStore.canvas.elements,
			'interactionStatus',
			InteractionStatus.Selected,
		)

		// Стереть трансформирующий прямоугольник если ничего не выделено
		if (!selectedFigure) {
			this.eraseTransformRect()
			return
		}

		if (selectedFigure.type !== 'figureElement') {
			return
		}

		// Если графика для т. прямоугольника ещё не создана, то создать
		if (!sideRectsGraphics.length) {
			this.createGraphics()
		}

		// Поставить правильные координаты и размеры для всех частей т. прямоугольника
		this.updateAllCoordsAndSize(selectedFigure)
	},

	/** Создаёт графику для всех частей трансформирующего прямоугольника. */
	createGraphics() {
		// Создать 4 интерактивные невидимые полоски
		// которые пользователь будет тащить для изменения размера фигуры по одной из осей.
		const sideRectNames = [
			InteractiveElemNames.Top,
			InteractiveElemNames.Right,
			InteractiveElemNames.Bottom,
			InteractiveElemNames.Left,
		]
		for (let i = 0; i < 4; i++) {
			this.createSideRectGraphics(sideRectNames[i])
		}

		// Создать 4 интерактивных квадратика за которые пользователь будет тащить для изменения размера фигуры
		const cornerRectNames = [
			InteractiveElemNames.LeftTop,
			InteractiveElemNames.RightTop,
			InteractiveElemNames.RightBottom,
			InteractiveElemNames.LeftBottom,
		]
		for (let i = 0; i < 4; i++) {
			this.createCornerRectGraphics(cornerRectNames[i])
		}
	},

	/**
	 * Создаёт графику для боковых частей прямоугольника.
	 * @param sideRectName — название создаваемого прямоугольника.
	 */
	createSideRectGraphics(sideRectName: InteractiveElemNames) {
		const graphics = new Graphics()

		// Включение интерактивности чтобы заработали обработчики событий на фигуре
		graphics.eventMode = 'static'

		graphics.cursor =
			sideRectName === InteractiveElemNames.Left || sideRectName === InteractiveElemNames.Right
				? 'ew-resize'
				: 'ns-resize'

		graphics.on('pointerdown', (e) => this.onInteractiveElemMouseDown(e, sideRectName))
		graphics.on('globalpointermove', (e) => this.onInteractiveElemMove(e))
		graphics.on('pointerup', this.onInteractiveElemMouseOn)

		sideRectsGraphics.push(graphics)

		getStore.$mainContainer.addChild(graphics)
	},

	/**
	 * Создаёт графику для квадратов изменения размеров выделенной фигуры.
	 * @param cornerRectName — название создаваемого прямоугольника.
	 */
	createCornerRectGraphics(cornerRectName: InteractiveElemNames) {
		const graphics = new Graphics()

		// Включение интерактивности чтобы заработали обработчики событий на фигуре
		graphics.eventMode = 'static'

		graphics.cursor =
			cornerRectName === InteractiveElemNames.LeftTop || cornerRectName === InteractiveElemNames.RightBottom
				? 'nwse-resize'
				: 'nesw-resize'

		graphics.on('pointerdown', (e) => this.onInteractiveElemMouseDown(e, cornerRectName))
		graphics.on('globalpointermove', (e) => this.onInteractiveElemMove(e))
		graphics.on('pointerup', this.onInteractiveElemMouseOn)

		cornerRectsGraphics.push(graphics)

		getStore.$mainContainer.addChild(graphics)
	},

	/**
	 * Обновляет размеры и координаты всех частей трансформирующего прямоугольника в зависимости от объекта выделенного на холсте.
	 * @param selectedElem — данные выделенного элемента
	 */
	updateAllCoordsAndSize(selectedElem: ShapeElement) {
		const { x, y, width, height } = selectedElem

		const visibleBoxThickness = 1
		const hitBoxThickness = 5

		this.updateSideRectCoordsAndSize(
			sideRectsGraphics[0],
			{
				x,
				y: y - visibleBoxThickness,
				width,
				height: visibleBoxThickness,
			},
			{
				x,
				y: y - hitBoxThickness,
				width,
				height: hitBoxThickness,
			},
		)
		this.updateSideRectCoordsAndSize(
			sideRectsGraphics[1],
			{ x: x + width, y, width: visibleBoxThickness, height },
			{ x: x + width, y, width: hitBoxThickness, height },
		)
		this.updateSideRectCoordsAndSize(
			sideRectsGraphics[2],
			{ x, y: y + height, width, height: visibleBoxThickness },
			{ x, y: y + height, width, height: hitBoxThickness },
		)
		this.updateSideRectCoordsAndSize(
			sideRectsGraphics[3],
			{ x: x - visibleBoxThickness, y, width: visibleBoxThickness, height },
			{ x: x - hitBoxThickness, y, width: hitBoxThickness, height },
		)

		this.updateCornerRectCoordsAndSize(cornerRectsGraphics[0], x, y)
		this.updateCornerRectCoordsAndSize(cornerRectsGraphics[1], x + width - 1, y)
		this.updateCornerRectCoordsAndSize(cornerRectsGraphics[2], x + width - 1, y + height - 1)
		this.updateCornerRectCoordsAndSize(cornerRectsGraphics[3], x, y + height - 1)
	},

	/**
	 * Обновляет размеры и координаты боковых сторон трансформирующего прямоугольника.
	 * @param graphics — графика стороны
	 * @param visibleBox — размеры видимой части стороны
	 * @param hitArea — размеры области удара мыши стороны
	 */
	updateSideRectCoordsAndSize(graphics: Graphics, visibleBox: BoxCoords, hitArea: BoxCoords) {
		graphics.clear()

		const isHorizontal = visibleBox.width > visibleBox.height

		const visibleBoxScaledWidth = isHorizontal ? visibleBox.width : visibleBox.width * this.getScaleMultiplier()
		const visibleBoxScaledHeight = isHorizontal ? visibleBox.height * this.getScaleMultiplier() : visibleBox.height

		graphics
			.rect(visibleBox.x, visibleBox.y, visibleBoxScaledWidth, visibleBoxScaledHeight)
			.fill({ color: boardColors.selected })

		const hitAreaScaledWidth = isHorizontal ? hitArea.width : hitArea.width * this.getScaleMultiplier()
		const hitAreaScaledHeight = isHorizontal ? hitArea.height * this.getScaleMultiplier() : hitArea.height

		graphics.hitArea = new Rectangle(hitArea.x, hitArea.y, hitAreaScaledWidth, hitAreaScaledHeight)
	},

	/**
	 * Обновляет размеры и координаты угловых квадратов трансформирующего прямоугольника.
	 * @param graphics — графика квадрата
	 * @param x — координата x
	 * @param y — координата y
	 */
	updateCornerRectCoordsAndSize(graphics: Graphics, x: number, y: number) {
		graphics.clear()

		const scaledX = x - 3 * this.getScaleMultiplier()
		const scaledY = y - 3 * this.getScaleMultiplier()
		const scaledWidth = 7 * this.getScaleMultiplier()
		const scaledStrokeWidth = this.getScaleMultiplier()

		graphics
			.rect(scaledX, scaledY, scaledWidth, scaledWidth)
			.fill({ color: '#fff' })
			.stroke({ width: scaledStrokeWidth, color: boardColors.selected })
	},

	/** Стирает трансформирующий прямоугольник */
	eraseTransformRect() {
		for (let i = 0; i < sideRectsGraphics.length; i++) {
			sideRectsGraphics[i].clear()
			cornerRectsGraphics[i].clear()
		}
	},

	/**
	 * Обработчик нажатия мыши по интерактивной части трансформирующего прямоугольника
	 * @param e — объект события
	 * @param rectName — название интерактивной части
	 */
	onInteractiveElemMouseDown(e: FederatedPointerEvent, rectName: InteractiveElemNames) {
		startMouseX = e.global.x
		startMouseY = e.global.y

		const selectedElem = arrUtils.getItemByPropNameAndValue(
			getStore.canvas.elements,
			'interactionStatus',
			InteractionStatus.Selected,
		)
		if (!selectedElem || selectedElem.type !== 'figureElement') return

		shapeInitialCoords.x = selectedElem.x
		shapeInitialCoords.y = selectedElem.y
		shapeInitialCoords.width = selectedElem.width
		shapeInitialCoords.height = selectedElem.height

		selectedInteractiveRectName = rectName
	},

	/**
	 * Обработчик движения мыши для перемещения интерактивного элемента.
	 * В соответствии с движением изменяется размер выделенного на холсте элемента.
	 * @param e e — объект события
	 */
	onInteractiveElemMove(e: FederatedPointerEvent) {
		if (!selectedInteractiveRectName) return

		const selectedElem = arrUtils.getItemByPropNameAndValue(
			getStore.canvas.elements,
			'interactionStatus',
			InteractionStatus.Selected,
		)
		if (!selectedElem || selectedElem.type !== 'figureElement') return

		const diffX = (e.global.x - startMouseX) * this.getScaleMultiplier()
		const diffY = (e.global.y - startMouseY) * this.getScaleMultiplier()

		const setNewPositionMapper: Record<InteractiveElemNames, () => void> = {
			[InteractiveElemNames.Right]: () => {
				const newWidth = shapeInitialCoords.width + diffX
				getStore.updateCanvasElement(selectedElem.id, { width: newWidth })
			},
			[InteractiveElemNames.Left]: () => {
				const newWidth = shapeInitialCoords.width - diffX
				const newX = shapeInitialCoords.x + diffX

				getStore.updateCanvasElement(selectedElem.id, { x: newX, width: newWidth })
			},
			[InteractiveElemNames.Bottom]: () => {
				const newHeight = shapeInitialCoords.height + diffY

				getStore.updateCanvasElement(selectedElem.id, { height: newHeight })
			},
			[InteractiveElemNames.Top]: () => {
				const newHeight = shapeInitialCoords.height - diffY
				const newY = shapeInitialCoords.y + diffY

				getStore.updateCanvasElement(selectedElem.id, { y: newY, height: newHeight })
			},
			[InteractiveElemNames.LeftTop]: () => {
				const newX = shapeInitialCoords.x + diffX
				const newWidth = shapeInitialCoords.width - diffX

				const newY = shapeInitialCoords.y + diffY
				const newHeight = shapeInitialCoords.height - diffY

				getStore.updateCanvasElement(selectedElem.id, { x: newX, y: newY, width: newWidth, height: newHeight })
			},
			[InteractiveElemNames.RightTop]: () => {
				const newWidth = shapeInitialCoords.width + diffX

				const newY = shapeInitialCoords.y + diffY
				const newHeight = shapeInitialCoords.height - diffY

				getStore.updateCanvasElement(selectedElem.id, { y: newY, width: newWidth, height: newHeight })
			},
			[InteractiveElemNames.RightBottom]: () => {
				const newWidth = shapeInitialCoords.width + diffX
				const newHeight = shapeInitialCoords.height + diffY

				getStore.updateCanvasElement(selectedElem.id, { width: newWidth, height: newHeight })
			},
			[InteractiveElemNames.LeftBottom]: () => {
				const newX = shapeInitialCoords.x + diffX
				const newWidth = shapeInitialCoords.width - diffX

				const newHeight = shapeInitialCoords.height + diffY

				getStore.updateCanvasElement(selectedElem.id, { x: newX, width: newWidth, height: newHeight })
			},
		}

		setNewPositionMapper[selectedInteractiveRectName]()
		renderCanvas.render()
	},

	/** Обработчик отпускания мыши */
	onInteractiveElemMouseOn() {
		selectedInteractiveRectName = null
	},

	/**
	 * Так как все части трансформирующего прямоугольника должны иметь такую же толщину линий
	 * при любом масштабе холста, то их следует умножить на множитель масштаба.
	 */
	getScaleMultiplier() {
		return 1 / (getStore.canvas.scale / 100)
	},
}
