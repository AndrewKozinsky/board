import { getStore, updateStore } from '../store/store.ts'
import { renderCanvas } from './renderCanvas.ts'

export const moveCanvas = {
	setEventListeners() {
		this.setMoveByMouseWheel()
		this.setMoveByMouseAndSpaceKey()
	},

	// Холст перемещается если прокручивают мышью
	setMoveByMouseWheel() {
		getStore.app.canvas.addEventListener('wheel', (event) => {
			const { deltaX, deltaY } = event
			this.moveCanvas(deltaX, deltaY)
		}, { passive: true })
	},

	// Холст перемещается если нажали на пробел и зажали мышь
	setMoveByMouseAndSpaceKey() {
		let isSpacePressed = false
		let mouseStartX = 0
		let mouseStartY = 0

		document.addEventListener('keydown', (event) => {
			if (event.code === 'Space' && !event.repeat) {
				isSpacePressed = true
				this.setDragCursor()
			}
		})

		document.addEventListener('keyup', (event) => {
			if (event.code === 'Space') {
				isSpacePressed = false
				this.clearCursorView()
			}
		})

		document.addEventListener('mousedown', (event) => {
			updateStore.mouse.leftButton = true
			mouseStartX = event.clientX
			mouseStartY = event.clientY

			if (isSpacePressed) {
				this.setDraggingCursor()
			}
		})

		document.addEventListener('mouseup', () => {
			updateStore.mouse.leftButton = false

			if (isSpacePressed) {
				this.setDragCursor()
			} else {
				this.clearCursorView()
			}
		})

		document.addEventListener('mousemove', (event) => {
			if (getStore.mouse.leftButton && isSpacePressed) {
				const offsetX = mouseStartX - event.clientX
				const offsetY = mouseStartY - event.clientY

				mouseStartX = event.clientX
				mouseStartY = event.clientY

				this.moveCanvas(offsetX, offsetY)

				this.setDraggingCursor()
			}
		})
	},

	moveCanvas(relativeX: number, relativeY: number) {
		updateStore.canvas.offset.x = getStore.canvas.offset.x -= relativeX
		updateStore.canvas.offset.y = getStore.canvas.offset.y -= relativeY

		renderCanvas.render()
	},

	setDragCursor() {
		updateStore.statuses.readyToMoveCanvas = true
		updateStore.statuses.moveCanvasByDragging = false
	},

	setDraggingCursor() {
		updateStore.statuses.readyToMoveCanvas = false
		updateStore.statuses.moveCanvasByDragging = true
	},

	clearCursorView() {
		updateStore.statuses.readyToMoveCanvas = false
		updateStore.statuses.moveCanvasByDragging = false
	}
}
