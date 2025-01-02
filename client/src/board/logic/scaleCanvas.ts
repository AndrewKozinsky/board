import { getStore, updateStore } from '../store/store.ts'
import { renderCanvas } from './renderCanvas.ts'

export enum ZoomDirection {
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

		// Настрою отступ чтобы масштабирование происходило с учётом положения мыши

		// На сколько процентов должен быть отступ слева
		// 50 / 500 = 0.1 (мышь на 10% экрана слева по горизонтали)
		const mouseXPercents = mouseX / getStore.app.canvas.clientWidth
		const mouseYPercents = mouseY / getStore.app.canvas.clientHeight

		this.zoom(newScale, mouseXPercents, mouseYPercents)
	},

	zoomCanvasOneStep(scaleDirection: ZoomDirection) {
		const newScale = this.getZoomValueNextStep(scaleDirection)

		this.zoom(newScale, 0.5, 0.5)
	},

	zoom(newScale: number, pivotXPercents: number, pivotYInPercents: number) {
		if (newScale < minZoomValue) {
			updateStore.canvas.scale = minZoomValue
			return
		} else if (newScale > maxZoomValue) {
			updateStore.canvas.scale = maxZoomValue
			return
		}

		const currentScale = getStore.canvas.scale
		updateStore.canvas.scale = newScale

		// На сколько процентов отличается старый масштаб и новый
		const scaleDiffPercentsTotal = currentScale - newScale // 0.1 или 10%

		// На сколько процентов нужно сделать отступ слева и сверху
		const leftOffsetPercents = Math.abs(scaleDiffPercentsTotal * pivotXPercents) // 0.2 или 20%
		const topOffsetPercents = Math.abs(scaleDiffPercentsTotal * pivotYInPercents) // 0.2 или 20%

		const { clientWidth: canvasWidth, clientHeight: canvasHeight } = getStore.app.canvas

		const leftOffsetPixels = Math.round((canvasWidth * leftOffsetPercents) / 100)
		const topOffsetPixels = Math.round((canvasHeight * topOffsetPercents) / 100)

		if (currentScale > newScale) {
			updateStore.canvas.offset.x = getStore.canvas.offset.x + leftOffsetPixels
			updateStore.canvas.offset.y = getStore.canvas.offset.y + topOffsetPixels
		} else {
			updateStore.canvas.offset.x = getStore.canvas.offset.x - leftOffsetPixels
			updateStore.canvas.offset.y = getStore.canvas.offset.y - topOffsetPixels
		}

		renderCanvas.render()
	},

	getZoomValueNextStep(direction: ZoomDirection) {
		const currentScale = getStore.canvas.scale

		return direction === ZoomDirection.In
			? (zoomValues.find((value) => value > currentScale) ?? Math.max(...zoomValues))
			: ([...zoomValues].reverse().find((value) => value < currentScale) ?? Math.min(...zoomValues))
	}
}
