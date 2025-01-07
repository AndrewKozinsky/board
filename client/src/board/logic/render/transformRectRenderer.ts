import { FederatedPointerEvent, Graphics } from 'pixi.js'
import { arrUtils } from '../../../utils/arrayUtils.ts'
import { getStore } from '../../store/store.ts'
import { InteractionStatus, ShapeElement } from '../../store/storeTypes.ts'
import { boardColors } from '../boardConfig.ts'
import { renderCanvas } from './renderCanvas.ts'

enum InteractiveElemName {
	LeftTopCorner = 'leftTopCorner',
	RightTopCorner = 'rightTopCorner',
	RightBottomCorner = 'rightBottom',
	LeftBottomCorner = 'leftBottom',
	TopSide = 'topSide',
	RightSide = 'rightSide',
	BottomSide = 'bottomSide',
	LeftSide = 'leftSide',
}

let sideRectsGraphics: Graphics[] = []
let cornerRectsGraphics: Graphics[] = []

// При щелчке по управляющим элементам сюда будут помещаться данные выделенной фигуры
// для правильного расчёта после трансформации.
const shapeInitialData = { x: 0, y: 0, width: 0, height: 0 }
let startGlobalX = 0
let startGlobalY = 0

let mouseWasPressed = false

export const transformRectRenderer = {
	init() {
		const selectedElem = arrUtils.getItemByPropNameAndValue(
			getStore.canvas.elements,
			'interactionStatus',
			InteractionStatus.Selected,
		)

		if (!selectedElem) {
			this.eraseTransformRect()
			return
		}

		if (selectedElem.type !== 'figureElement') {
			return
		}

		if (!sideRectsGraphics.length) {
			this.createGraphics()
		}

		this.updateAllCoordsAndSize(selectedElem)
	},

	createGraphics() {
		const sideRectNames = [
			InteractiveElemName.TopSide,
			InteractiveElemName.RightSide,
			InteractiveElemName.BottomSide,
			InteractiveElemName.LeftSide,
		]

		for (let i = 0; i < 4; i++) {
			this.createSideRectGraphics(sideRectNames[i])
		}

		const cornerRectNames = [
			InteractiveElemName.LeftTopCorner,
			InteractiveElemName.RightTopCorner,
			InteractiveElemName.RightBottomCorner,
			InteractiveElemName.LeftBottomCorner,
		]

		for (let i = 0; i < 4; i++) {
			this.createCornerRectGraphics(cornerRectNames[i])
		}
	},

	createSideRectGraphics(cornerRectName: InteractiveElemName) {
		const graphics = new Graphics()

		// Включение интерактивности чтобы заработали обработчики событий на фигуре
		graphics.eventMode = 'static'

		graphics.cursor =
			cornerRectName === InteractiveElemName.LeftSide || cornerRectName === InteractiveElemName.RightSide
				? 'ew-resize'
				: 'ns-resize'

		graphics.on('pointerdown', this.onInteractiveElemMouseDown)

		graphics.on(
			'globalpointermove',
			(e) => {
				if (!mouseWasPressed) return

				if (cornerRectName === InteractiveElemName.RightSide) {
					const diffX = e.global.x - startGlobalX

					const newWidth = shapeInitialData.width + diffX

					const selectedElem = arrUtils.getItemByPropNameAndValue(
						getStore.canvas.elements,
						'interactionStatus',
						InteractionStatus.Selected,
					)
					if (!selectedElem || selectedElem.type !== 'figureElement') return

					getStore.updateCanvasElement(selectedElem.id, { width: newWidth })
					renderCanvas.render()
				}
			},
			graphics,
		)

		graphics.on(
			'pointerup',
			() => {
				mouseWasPressed = false
			},
			graphics,
		)

		sideRectsGraphics.push(graphics)

		getStore.app.stage.addChild(graphics)
	},

	createCornerRectGraphics(cornerRectName: InteractiveElemName) {
		const graphics = new Graphics()

		// Включение интерактивности чтобы заработали обработчики событий на фигуре
		graphics.eventMode = 'static'

		graphics.cursor =
			cornerRectName === InteractiveElemName.LeftTopCorner ||
			cornerRectName === InteractiveElemName.RightBottomCorner
				? 'nwse-resize'
				: 'nesw-resize'

		// const mouseHandler = this.getCornerRectMouseHandler(cornerRectName)
		// TODO
		// cornerRectGraphics.on('pointermove', mouseHandler)
		// Нужно просто запомнить стартовую ширину, затем к ней прибавлять дистанцию перетаскивания и в Хранилище менять имеющуюся ширину.

		cornerRectsGraphics.push(graphics)

		getStore.app.stage.addChild(graphics)
	},

	updateAllCoordsAndSize(selectedElem: ShapeElement) {
		const { x, y, width, height } = selectedElem

		const sideThickness = 10
		this.updateSideRectCoordsAndSize(sideRectsGraphics[0], x, y - sideThickness, width, sideThickness)
		this.updateSideRectCoordsAndSize(sideRectsGraphics[1], x + width, y, sideThickness, height)
		this.updateSideRectCoordsAndSize(sideRectsGraphics[2], x, y + height, width, sideThickness)
		this.updateSideRectCoordsAndSize(sideRectsGraphics[3], x - sideThickness, y, sideThickness, height)

		this.updateCornerRectCoordsAndSize(cornerRectsGraphics[0], x, y)
		this.updateCornerRectCoordsAndSize(cornerRectsGraphics[1], x + width - 1, y)
		this.updateCornerRectCoordsAndSize(cornerRectsGraphics[2], x + width - 1, y + height - 1)
		this.updateCornerRectCoordsAndSize(cornerRectsGraphics[3], x, y + height - 1)
	},

	updateSideRectCoordsAndSize(graphics: Graphics, x: number, y: number, width: number, height: number) {
		graphics.clear()

		graphics.rect(x, y, width, height).fill({ color: boardColors.selected })
	},

	updateCornerRectCoordsAndSize(graphics: Graphics, x: number, y: number) {
		graphics.clear()

		graphics
			.rect(x - 3, y - 3, 7, 7)
			.fill({ color: '#fff' })
			.stroke({ width: 1, color: boardColors.selected })
	},

	eraseTransformRect() {
		for (let i = 0; i < sideRectsGraphics.length; i++) {
			sideRectsGraphics[i].clear()
			cornerRectsGraphics[i].clear()
		}
	},

	onInteractiveElemMouseDown(e: FederatedPointerEvent) {
		startGlobalX = e.global.x
		startGlobalY = e.global.y

		const selectedElem = arrUtils.getItemByPropNameAndValue(
			getStore.canvas.elements,
			'interactionStatus',
			InteractionStatus.Selected,
		)
		if (!selectedElem || selectedElem.type !== 'figureElement') return

		shapeInitialData.x = selectedElem.x
		shapeInitialData.y = selectedElem.y
		shapeInitialData.width = selectedElem.width
		shapeInitialData.height = selectedElem.height

		mouseWasPressed = true
	},

	/*getCornerRectMouseHandler(cornerName: InteractiveElemName) {
		return (e: FederatedPointerEvent) => {
			console.log(e)
		}
	},*/
}
