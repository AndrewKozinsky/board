import { Cursor, getStore, updateStore } from '../store/store.ts'
import { renderCanvas } from './renderCanvas.ts'

let isMousePressed = false
let isCmdPressed = false
let isSpacePressed = false
let mouseStartX = 0
let mouseStartY = 0

// Методы работы с передвижением холста
export const moveCanvas = {
	/**
	 * Установка обработчиков заставляющих холст двигаться
	 */
	setEventListeners() {
		this.setMoveByMouseWheel()
		this.setMoveByMouseAndSpaceKey()
	},

	/** Холст перемещается если прокручивают мышью */
	setMoveByMouseWheel() {
		getStore.app.canvas.addEventListener(
			'wheel',
			(event) => {
				if (isCmdPressed) return

				const { deltaX, deltaY } = event
				this.moveCanvas(deltaX, deltaY)
			},
			{ passive: true }
		)
	},

	/** Холст перемещается если нажали на пробел и зажали мышь */
	setMoveByMouseAndSpaceKey() {
		document.addEventListener('keydown', (event) => {
			if (event.code === 'Space' && !event.repeat) {
				isSpacePressed = true
				this.setDragCursor()
			}
			if (event.code === 'MetaLeft' && !event.repeat) {
				isCmdPressed = true
			}
		})

		document.addEventListener('keyup', (event) => {
			if (event.code === 'Space') {
				isSpacePressed = false
				this.clearCursorView()
			}
			if (event.code === 'MetaLeft') {
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
		updateStore.canvas.offset.x = getStore.canvas.offset.x -= relativeX
		updateStore.canvas.offset.y = getStore.canvas.offset.y -= relativeY

		renderCanvas.render()
	},

	/** Ставит на холсте курсор в виде ладони */
	setDragCursor() {
		updateStore.cursor = Cursor.Palm
		renderCanvas.render()
	},

	/** Ставит на холсте курсор перетаскивания */
	setDraggingCursor() {
		updateStore.cursor = Cursor.Dragging
		renderCanvas.render()
	},

	/** Ставит на холсте стандартный курсор */
	clearCursorView() {
		updateStore.cursor = Cursor.Default
		renderCanvas.render()
	}
}
