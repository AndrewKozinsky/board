import { KeyboardKeys, keyboardUtils } from '../../../utils/keyboardUtils.ts'
import { MouseKeys } from '../../../utils/mouseUtils.ts'
import { boardConfig } from '../misc/boardConfig.ts'
import { renderCanvas } from '../render/renderCanvas.ts'
import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { Cursor } from '../../canvasStore/canvasStoreTypes.ts'

let isMousePressed = false
let isCmdPressed = false
let isSpacePressed = false
let mouseStartX = 0
let mouseStartY = 0

// TODO Такие методы как pointerdown уже возвращают информации о нажатых модифицирующих клавишах,
// поэтому дополнительные обработчики нажатия клавиш можно не делать.
// Разузной это подробнее и если это так, то код можно упростить.

// Методы работы с передвижением холста
export const moveCanvas = {
	/** Установка обработчиков заставляющих холст двигаться */
	setEventListeners() {
		if (boardConfig.commands.moveCanvas1.mouseKey === MouseKeys.Wheel) {
			this.setMoveByMouseWheel()
		} else {
			throw new Error('Не установлено перемещение холста')
		}

		const moveCommand2 = boardConfig.commands.moveCanvas2
		if (moveCommand2.mouseKey === MouseKeys.PressLeft && moveCommand2.hotKeys[0] === KeyboardKeys.Space) {
			this.setMoveByMouseAndSpaceKey()
		} else {
			throw new Error('Не установлено перемещение холста')
		}
	},

	/** Холст перемещается если прокручивают мышью */
	setMoveByMouseWheel() {
		canvasStore.app.canvas.addEventListener(
			'wheel',
			(event) => {
				if (isCmdPressed) return

				const { deltaX, deltaY } = event
				this.moveCanvas(deltaX, deltaY)
			},
			{ passive: true },
		)
	},

	/** Холст перемещается если нажали на пробел и зажали мышь */
	setMoveByMouseAndSpaceKey() {
		document.addEventListener('keydown', (event) => {
			if (keyboardUtils.isSpacePressed(event) && !event.repeat) {
				isSpacePressed = true
				this.setDragCursor()
			}
			if (keyboardUtils.isCtrlPressed(event) && !event.repeat) {
				isCmdPressed = true
			}
		})

		document.addEventListener('keyup', (event) => {
			if (keyboardUtils.isSpacePressed(event)) {
				isSpacePressed = false
				this.clearCursorView()
			}
			if (keyboardUtils.isCtrlPressed(event)) {
				isCmdPressed = false
			}
		})

		// Если потеряли фокус, то скорее всего переключились на другое приложение,
		// поэтому поставить isCmdPressed в false
		window.addEventListener('blur', () => {
			isCmdPressed = false
		})

		document.addEventListener('mousedown', (event) => {
			isMousePressed = true
			mouseStartX = event.clientX
			mouseStartY = event.clientY

			if (isSpacePressed) {
				this.setDraggingCursor()
			}
		})

		document.addEventListener('mouseup', () => {
			isMousePressed = false

			if (isSpacePressed) {
				this.setDragCursor()
			} else {
				this.clearCursorView()
			}
		})

		document.addEventListener('mousemove', (event) => {
			if (isMousePressed && isSpacePressed) {
				const offsetX = mouseStartX - event.clientX
				const offsetY = mouseStartY - event.clientY

				mouseStartX = event.clientX
				mouseStartY = event.clientY

				this.moveCanvas(offsetX, offsetY)

				this.setDraggingCursor()
			}
		})
	},

	/**
	 * Перемещение холста на указанное относительное расстояние в пикселах.
	 * @param relativeX — относительное расстояние по горизонтали.
	 * @param relativeY — относительное расстояние по вертикале.
	 */
	moveCanvas(relativeX: number, relativeY: number) {
		canvasStore.offset.x = canvasStore.offset.x -= relativeX
		canvasStore.offset.y = canvasStore.offset.y -= relativeY

		renderCanvas.render()
	},

	/** Ставит на холсте курсор в виде ладони */
	setDragCursor() {
		canvasStore.cursor = Cursor.Palm
		renderCanvas.render()
	},

	/** Ставит на холсте курсор перетаскивания */
	setDraggingCursor() {
		canvasStore.cursor = Cursor.Dragging
		renderCanvas.render()
	},

	/** Ставит на холсте стандартный курсор */
	clearCursorView() {
		canvasStore.cursor = Cursor.Default
		renderCanvas.render()
	},
}
