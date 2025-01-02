import { getStore, updateStore } from '../store/store.ts'
import { pixiHelper } from './pixiHelper.ts'
import { renderCanvas } from './renderCanvas.ts'

enum ZoomDirection {
	In = 1,
	Out = 2
}

const zoomValues = [5, 10, 15, 20, 33, 50, 75, 100, 125, 150, 200, 250, 300, 400]
const minZoomValue = zoomValues[0]
const maxZoomValue = zoomValues[zoomValues.length - 1]

export const scaleCanvas = {
	setEventListeners() {
		let isCmdPressed = false

		window.addEventListener('keydown', (event) => {
			if (event.key === '=') {
				this.zoomCanvasOneStep(ZoomDirection.In) // Zoom out (scale up by 25%)
			} else if (event.key === '-') {
				this.zoomCanvasOneStep(ZoomDirection.Out) // Zoom in (scale down by 25%)
			}
		})

		document.addEventListener('keydown', (event) => {
			if (event.code === 'MetaLeft') {
				isCmdPressed = true
			}
		})
		document.addEventListener('keyup', (event) => {
			if (event.code === 'MetaLeft') {
				isCmdPressed = false
			}
		})

		getStore.app.canvas.addEventListener(
			'wheel',
			(event) => {
				if (!isCmdPressed) return

				const { deltaY, clientX, clientY } = event
				this.zoomCanvasByMouse(deltaY, clientX, clientY)
			},
			{ passive: true }
		)
	},

	zoomCanvasByMouse(deltaY: number, mouseX: number, mouseY: number) {
		const currentScale = getStore.canvas.scale
		const newScale = currentScale + deltaY

		if (newScale < minZoomValue) {
			updateStore.canvas.scale = minZoomValue
			return
		} else if (newScale > maxZoomValue) {
			updateStore.canvas.scale = maxZoomValue
			return
		}

		updateStore.canvas.scale = newScale

		// Настрою отступ чтобы масштабирование происходило с учётом положения мыши

		// На сколько процентов должен быть отступ слева
		const mouseXPercentsOffset = mouseX / getStore.app.canvas.clientWidth // 0.1
		const mouseYPercentsOffset = mouseY / getStore.app.canvas.clientHeight // 0.1

		const percentDiff = Math.abs(currentScale - newScale)
		const pixelsWidthDiffX = Math.round((getStore.app.canvas.clientWidth * percentDiff) / 100)
		const pixelsWidthDiffY = Math.round((getStore.app.canvas.clientHeight * percentDiff) / 100)

		// Где находится мышь в процентах
		const offsetX = pixelsWidthDiffX * mouseXPercentsOffset
		const offsetY = pixelsWidthDiffY * mouseYPercentsOffset

		if (currentScale > newScale) {
			updateStore.canvas.offset.x = getStore.canvas.offset.x + offsetX
			updateStore.canvas.offset.y = getStore.canvas.offset.y + offsetY
		} else {
			updateStore.canvas.offset.x = getStore.canvas.offset.x - offsetX
			updateStore.canvas.offset.y = getStore.canvas.offset.y - offsetY
		}

		this.common(currentScale, newScale)
	},

	zoomCanvasOneStep(scaleDirection: ZoomDirection) {
		const currentScale = getStore.canvas.scale
		const newScale = this.getZoomValueNextStep(scaleDirection)
		updateStore.canvas.scale = newScale

		const percentDiff = Math.abs((currentScale - newScale) / 2)
		const pixelsWidthDiff = Math.round((getStore.app.canvas.clientWidth * percentDiff) / 100)
		const pixelsHeightDiff = Math.round((getStore.app.canvas.clientHeight * percentDiff) / 100)

		if (scaleDirection === ZoomDirection.Out) {
			updateStore.canvas.offset.x = getStore.canvas.offset.x + pixelsWidthDiff
			updateStore.canvas.offset.y = getStore.canvas.offset.y + pixelsHeightDiff
		} else {
			updateStore.canvas.offset.x = getStore.canvas.offset.x - pixelsWidthDiff
			updateStore.canvas.offset.y = getStore.canvas.offset.y - pixelsHeightDiff
		}

		this.common(currentScale, newScale)
	},

	common(currentScale: number, newScale: number) {
		pixiHelper.rerenderFonts(newScale)
		renderCanvas.render()
	},

	getZoomValueNextStep(direction: ZoomDirection) {
		const currentScale = getStore.canvas.scale

		return direction === ZoomDirection.In
			? (zoomValues.find((value) => value > currentScale) ?? Math.max(...zoomValues))
			: ([...zoomValues].reverse().find((value) => value < currentScale) ?? Math.min(...zoomValues))
	}

	/*getZoomValueNextStep(direction: ZoomDirection) {
		const currentScale = getStore.canvas.scale
		const index = zoomValues.findIndex((x) => x === currentScale)

		if (index === 0 && direction === ZoomDirection.Out) return currentScale
		if (zoomValues.length - 1 === index && direction === ZoomDirection.In) return currentScale

		return direction === ZoomDirection.In ? zoomValues[index + 1] : zoomValues[index - 1]
	}*/
}
