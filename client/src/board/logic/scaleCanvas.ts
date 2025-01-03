import { getStore, updateStore } from '../store/store.ts'
import { renderCanvas } from './renderCanvas.ts'

export enum ZoomDirection {
	// Приблизить
	In = 1,
	// Отдалить
	Out = 2
}

const zoomValues = [5, 10, 15, 20, 33, 50, 75, 100, 125, 150, 200, 250, 300, 400]
const minZoomValue = zoomValues[0]
const maxZoomValue = zoomValues[zoomValues.length - 1]

let isCmdPressed = false

export const scaleCanvas = {
	/** Устанавливает обработчики отвечающие за масштабирование холста */
	setEventListeners() {
		// Масштабировать если нажали + или -
		window.addEventListener('keydown', (event) => {
			if (event.key === '=') {
				this.zoomCanvasOneStep(ZoomDirection.In) // Zoom out (scale up by 25%)
			} else if (event.key === '-') {
				this.zoomCanvasOneStep(ZoomDirection.Out) // Zoom in (scale down by 25%)
			}
		})

		// Проверить нажали ли Cmd
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

		// Масштабировать если нажали Cmd и крутят колесо мыши
		getStore.app.canvas.addEventListener(
			'wheel',
			(event) => {
				this.zoomCanvasByMouse(event)
			},
			{ passive: true }
		)
	},

	/**
	 * Обработчик масштабирования через прокрутку мыши с зажатым Cmd
	 * @param e — событие прокрутки мыши
	 */
	zoomCanvasByMouse(e: WheelEvent) {
		if (!isCmdPressed) return

		const newScale = getStore.canvas.scale + e.deltaY
		this.zoom(newScale, e.clientX, e.clientY)
	},

	/**
	 * Масштабирование на предыдущий или следующий шаг
	 * @param direction — направление масштабирования
	 */
	zoomCanvasOneStep(direction: ZoomDirection) {
		const newScale = this.getZoomValueNextStep(direction)

		const { clientWidth, clientHeight } = getStore.app.canvas
		this.zoom(newScale, clientWidth / 2, clientHeight / 2)
	},

	/**
	 * Масштабирование холста
	 * @param newScale — новое значение масштаба холста в процентах (100 — масштаб 1:1)
	 * @param canvasPivotLeftPx — координата X точки трансформации в пикселах
	 * @param canvasPivotTopPx — координата Y точки трансформации в пикселах
	 */
	zoom(newScale: number, canvasPivotLeftPx: number, canvasPivotTopPx: number) {
		if (newScale < minZoomValue || newScale > maxZoomValue) {
			updateStore.canvas.scale = newScale < minZoomValue ? minZoomValue : maxZoomValue
			renderCanvas.render()
			return
		}

		const currentScale = getStore.canvas.scale
		const scaleDiff = (currentScale - newScale) / 100 // .25

		const leftOffsetPx = canvasPivotLeftPx * scaleDiff
		const topOffsetPx = canvasPivotTopPx * scaleDiff

		updateStore.canvas.offset.x = getStore.canvas.offset.x + leftOffsetPx
		updateStore.canvas.offset.y = getStore.canvas.offset.y + topOffsetPx
		updateStore.canvas.scale = newScale

		renderCanvas.render()
	},

	/**
	 * Возвращает следующее значения масштаба, на которое должен отмасштабироваться холст в зависимости от направления.
	 * @param direction — направление масштабирования
	 */
	getZoomValueNextStep(direction: ZoomDirection) {
		const currentScale = getStore.canvas.scale

		return direction === ZoomDirection.In
			? (zoomValues.find((value) => value > currentScale) ?? maxZoomValue)
			: ([...zoomValues].reverse().find((value) => value < currentScale) ?? minZoomValue)
	}
}
