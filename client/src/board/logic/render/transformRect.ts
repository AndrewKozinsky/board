import { FederatedPointerEvent, Graphics, Rectangle } from 'pixi.js'
import { arrUtils } from '../../../utils/arrayUtils.ts'
import { boardColors } from '../canvas/boardConfig.ts'
import { canvasUtils } from '../canvas/canvasUtils.ts'
import { canvasStore } from '../../canvasStore/canvasStoreProxy.ts'
import { Cursor, InteractionStatus } from '../../canvasStore/canvasStoreTypes.ts'
import { FigureElement } from '../elems/FigureElement.ts'
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

// Название интерактивного прямоугольника, по которому щелкнули.
let selectedInteractiveRectName: null | InteractiveElemNames = null

type BoxCoords = {
	x: number
	y: number
	width: number
	height: number
}

// Набор методов для создания и управления трансформирующего прямоугольника
export const transformRect = {
	// Глобальные координаты точки по которой щелкнули мышью
	// для начала перетаскивания управляющих прямоугольников для изменения размера фигуры.
	startMouseX: 0,
	startMouseY: 0,

	/**
	 * Функция, запускаемая при каждой перерисовке сцены.
	 * Тут определяется нужно ли создавать графику для отрисовки трансформирующего прямоугольника
	 * или сразу приступить к изменению размера и координат для правильного местоположения и вида.
	 */
	init() {
		// Данные выделенной фигуры
		const selectedFigure = arrUtils.getItemByPropNameAndValue(
			canvasStore.elements,
			'interactionStatus',
			InteractionStatus.Selected,
		)

		// Стереть трансформирующий прямоугольник если ничего не выделено
		if (!selectedFigure) {
			this.eraseTransformRect()
			return
		}

		if (!(selectedFigure instanceof FigureElement)) {
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
				? Cursor.EwResize
				: Cursor.NsResize

		graphics.on('pointerdown', (e) => this.onInteractiveElemMouseDown(e, sideRectName))
		graphics.on('globalpointermove', (e) => this.onInteractiveElemMove(e))
		graphics.on('pointerup', this.onInteractiveElemMouseUp)

		sideRectsGraphics.push(graphics)

		canvasStore.$contentContainer.addChild(graphics)
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
				? Cursor.NwseResize
				: Cursor.NeswResize

		graphics.on('pointerdown', (e) => this.onInteractiveElemMouseDown(e, cornerRectName))
		graphics.on('globalpointermove', (e) => this.onInteractiveElemMove(e))
		graphics.on('pointerup', this.onInteractiveElemMouseUp)

		cornerRectsGraphics.push(graphics)

		canvasStore.$contentContainer.addChild(graphics)
	},

	/**
	 * Обновляет размеры и координаты всех частей трансформирующего прямоугольника в зависимости от объекта выделенного на холсте.
	 * @param selectedElem — данные выделенного элемента
	 */
	updateAllCoordsAndSize(selectedElem: FigureElement) {
		// =====
		const { x, y, width, height } = selectedElem

		const scaleFactor = canvasUtils.getScaleMultiplier()
		const visibleBoxThickness = scaleFactor
		const hitBoxThickness = 5 * scaleFactor

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

		this.updateCornerRectCoordsAndSize(cornerRectsGraphics[0], x, y, true, true)
		this.updateCornerRectCoordsAndSize(cornerRectsGraphics[1], x + width, y, false, true)
		this.updateCornerRectCoordsAndSize(cornerRectsGraphics[2], x + width, y + height, false, false)
		this.updateCornerRectCoordsAndSize(cornerRectsGraphics[3], x, y + height, true, false)
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

		const visibleBoxScaledWidth = isHorizontal ? visibleBox.width : visibleBox.width
		const visibleBoxScaledHeight = isHorizontal ? visibleBox.height : visibleBox.height

		graphics
			.rect(visibleBox.x, visibleBox.y, visibleBoxScaledWidth, visibleBoxScaledHeight)
			.fill({ color: boardColors.selected })

		const hitAreaScaledWidth = isHorizontal ? hitArea.width : hitArea.width
		const hitAreaScaledHeight = isHorizontal ? hitArea.height : hitArea.height

		graphics.hitArea = new Rectangle(hitArea.x, hitArea.y, hitAreaScaledWidth, hitAreaScaledHeight)
	},

	/**
	 * Обновляет размеры и координаты угловых квадратов трансформирующего прямоугольника.
	 * @param graphics — графика квадрата
	 * @param x — координата x
	 * @param y — координата y
	 * @param leftSide — если квадрат с правой стороны, то в функции будет сделано небольшое смещение значения для симметричного положения квадрата
	 * @param topSide — если квадрат с верхней стороны, то в функции будет сделано небольшое смещение значения для симметричного положения квадрата
	 */
	updateCornerRectCoordsAndSize(graphics: Graphics, x: number, y: number, leftSide: boolean, topSide: boolean) {
		graphics.clear()

		const scaleFactor = canvasUtils.getScaleMultiplier()

		const scaledX = (leftSide ? x - 1 : x) - 4 * scaleFactor
		const scaledY = (topSide ? y - 1 : y) - 4 * scaleFactor
		const scaledWidth = 9 * scaleFactor
		const scaledStrokeWidth = scaleFactor
		const rounding = 1.5 * scaleFactor

		graphics
			.roundRect(scaledX, scaledY, scaledWidth, scaledWidth, rounding)
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
		this.startMouseX = e.global.x
		this.startMouseY = e.global.y

		const selectedElem = arrUtils.getItemByPropNameAndValue(
			canvasStore.elements,
			'interactionStatus',
			InteractionStatus.Selected,
		)
		if (!selectedElem || !(selectedElem instanceof FigureElement)) return

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
			canvasStore.elements,
			'interactionStatus',
			InteractionStatus.Selected,
		)
		if (!selectedElem || !(selectedElem instanceof FigureElement)) return

		const diffX = (e.global.x - this.startMouseX) * canvasUtils.getScaleMultiplier()
		const diffY = (e.global.y - this.startMouseY) * canvasUtils.getScaleMultiplier()

		const setNewPositionMapper: Record<InteractiveElemNames, () => void> = {
			[InteractiveElemNames.Right]: () => {
				selectedElem.width = shapeInitialCoords.width + diffX
			},
			[InteractiveElemNames.Left]: () => {
				selectedElem.x = shapeInitialCoords.x + diffX
				selectedElem.width = shapeInitialCoords.width - diffX
			},
			[InteractiveElemNames.Bottom]: () => {
				selectedElem.height = shapeInitialCoords.height + diffY
			},
			[InteractiveElemNames.Top]: () => {
				selectedElem.height = shapeInitialCoords.height - diffY
				selectedElem.y = shapeInitialCoords.y + diffY
			},
			[InteractiveElemNames.LeftTop]: () => {
				selectedElem.x = shapeInitialCoords.x + diffX
				selectedElem.y = shapeInitialCoords.y + diffY
				selectedElem.width = shapeInitialCoords.width - diffX
				selectedElem.height = shapeInitialCoords.height - diffY
			},
			[InteractiveElemNames.RightTop]: () => {
				selectedElem.y = shapeInitialCoords.y + diffY
				selectedElem.width = shapeInitialCoords.width + diffX
				selectedElem.height = shapeInitialCoords.height - diffY
			},
			[InteractiveElemNames.RightBottom]: () => {
				selectedElem.width = shapeInitialCoords.width + diffX
				selectedElem.height = shapeInitialCoords.height + diffY
			},
			[InteractiveElemNames.LeftBottom]: () => {
				selectedElem.x = shapeInitialCoords.x + diffX
				selectedElem.width = shapeInitialCoords.width - diffX
				selectedElem.height = shapeInitialCoords.height + diffY
			},
		}

		setNewPositionMapper[selectedInteractiveRectName]()
		renderCanvas.render()
	},

	/** Обработчик отпускания мыши */
	onInteractiveElemMouseUp() {
		selectedInteractiveRectName = null
	},
}
