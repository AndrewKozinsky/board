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

		// На сколько процентов должен быть отступ слева
		// 50 / 500 = 0.1 (мышь на 10% экрана слева по горизонтали)
		const mouseXPercents = e.clientX / getStore.app.canvas.clientWidth
		const mouseYPercents = e.clientY / getStore.app.canvas.clientHeight

		this.zoom(newScale, mouseXPercents, mouseYPercents)
	},

	/**
	 * Масштабирование на предыдущий или следующий шаг
	 * @param direction — направление масштабирования
	 */
	zoomCanvasOneStep(direction: ZoomDirection) {
		const newScale = this.getZoomValueNextStep(direction)

		this.zoom(newScale, 0.5, 0.5)
	},

	/**
	 * Масштабирование холста
	 * @param newScale — новое значение масштаба холста в процентах (100 — масштаб 1:1)
	 * @param pivotXPercents — доля от ширины холста, где должна находиться точка трансформации (0.5 — середина холста по X)
	 * @param pivotYPercents — доля от высоты холста, где должна находиться точка трансформации (0.5 — середина холста по Y)
	 */
	/*zoom(newScale: number, pivotXPercents: number, pivotYPercents: number) {
		if (newScale < minZoomValue || newScale > maxZoomValue) {
			updateStore.canvas.scale = newScale < minZoomValue ? minZoomValue : maxZoomValue

			renderCanvas.render()
			return
		}

		const currentScale = getStore.canvas.scale
		updateStore.canvas.scale = newScale

		const { clientWidth: canvasDefWidth, clientHeight: canvasDefHeight } = getStore.app.canvas

		const scaleDiff = (currentScale - newScale) / 100
		const offsetX = canvasDefWidth * scaleDiff * pivotXPercents
		const offsetY = canvasDefHeight * scaleDiff * pivotYPercents

		updateStore.canvas.offset.x = getStore.canvas.offset.x + offsetX
		updateStore.canvas.offset.y = getStore.canvas.offset.y + offsetY

		renderCanvas.render()
	},*/

	zoom(newScale: number, canvasPivotXPercents: number, canvasPivotYPercents: number) {
		const currentScale = getStore.canvas.scale

		// Разница между текущей и новой шириной сцены
		const sceneDiffPxWidth = ((newScale - currentScale) / 100) * getStore.app.canvas.clientWidth // 250 px
		const sceneDiffPxHeight = ((newScale - currentScale) / 100) * getStore.app.canvas.clientHeight // 200 px

		// На сколько процентов отстаёт сцена
		const sceneOffsetLeftPc = (getStore.canvas.offset.x / getStore.app.canvas.clientWidth) * 100 // 10%
		const sceneOffsetTopPc = (getStore.canvas.offset.y / getStore.app.canvas.clientHeight) * 100 // 2%

		// Процент на котором находится точка трансформации
		const scenePivotLeftPc = canvasPivotXPercents * 100 - sceneOffsetLeftPc // 52
		const scenePivotTopPc = canvasPivotYPercents * 100 - sceneOffsetTopPc

		const leftOffset = sceneDiffPxWidth * (scenePivotLeftPc / 100)
		const topOffset = sceneDiffPxHeight * (scenePivotTopPc / 100)
		// debugger

		updateStore.canvas.offset.x = -leftOffset
		updateStore.canvas.offset.y = -topOffset
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
