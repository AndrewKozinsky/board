import { isKeysPressed, keyboardUtils } from '../../../utils/keyboardUtils.ts'
import { boardConfig } from '../boardConfig.ts'
import { renderCanvas } from '../render/renderCanvas.ts'
import { canvasStore } from '../store/canvasStore.ts'

export enum ZoomDirection {
	// Приблизить
	In = 1,
	// Отдалить
	Out = 2,
}

const { zoomValues } = boardConfig
const minZoomValue = zoomValues[0]
const maxZoomValue = zoomValues[zoomValues.length - 1]

let isCmdPressed = false

// TODO Такие методы как pointerdown уже возвращают информации о нажатых модифицирующих клавишах,
// поэтому дополнительные обработчики нажатия клавиш можно не делать.
// Разузной это подробнее и если это так, то код можно упростить.
export const scaleCanvas = {
	/** Устанавливает обработчики отвечающие за масштабирование холста */
	setEventListeners() {
		// Масштабировать если нажали + или -
		window.addEventListener('keydown', (event) => {
			if (isKeysPressed(event, boardConfig.commands.zoomCanvasIn.hotKeys)) {
				this.zoomCanvasOneStep(ZoomDirection.In) // Zoom out (scale up by 25%)
			} else if (isKeysPressed(event, boardConfig.commands.zoomCanvasOut.hotKeys)) {
				this.zoomCanvasOneStep(ZoomDirection.Out) // Zoom in (scale down by 25%)
			}
		})

		// Проверить нажали ли Cmd
		document.addEventListener('keydown', (event) => {
			if (keyboardUtils.isCtrlPressed(event)) {
				isCmdPressed = true
			}
		})
		document.addEventListener('keyup', (event) => {
			if (keyboardUtils.isCtrlPressed(event)) {
				isCmdPressed = false
			}
		})

		// Если потеряли фокус, то скорее всего переключились на другое приложение,
		// поэтому поставить isCmdPressed в false
		window.addEventListener('blur', () => {
			isCmdPressed = false
		})

		// Масштабировать если нажали Cmd и крутят колесо мыши
		canvasStore.app.canvas.addEventListener(
			'wheel',
			(event) => {
				if (!isCmdPressed) return
				this.zoomCanvasByMouse(event)
			},
			{ passive: true },
		)
	},

	/**
	 * Обработчик масштабирования через прокрутку мыши с зажатым Cmd
	 * @param e — событие прокрутки мыши
	 */
	zoomCanvasByMouse(e: WheelEvent) {
		const newScale = canvasStore.scale + e.deltaY
		this.zoom(newScale, e.clientX, e.clientY)
	},

	/**
	 * Масштабирование на предыдущий или следующий шаг
	 * @param direction — направление масштабирования
	 */
	zoomCanvasOneStep(direction: ZoomDirection) {
		const newScale = this.getZoomValueNextStep(direction)

		const { clientWidth, clientHeight } = canvasStore.app.canvas
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
			canvasStore.scale = newScale < minZoomValue ? minZoomValue : maxZoomValue
			renderCanvas.render()
			return
		}

		const roundedNewScale = Math.round(newScale)

		const currentScale = canvasStore.scale
		const scaleDiff = (currentScale - roundedNewScale) / 100 // .25

		const leftOffsetPx = canvasPivotLeftPx * scaleDiff
		const topOffsetPx = canvasPivotTopPx * scaleDiff

		canvasStore.offset.x = canvasStore.offset.x + leftOffsetPx
		canvasStore.offset.y = canvasStore.offset.y + topOffsetPx
		canvasStore.scale = roundedNewScale

		renderCanvas.render()
	},

	/**
	 * Возвращает следующее значения масштаба, на которое должен отмасштабироваться холст в зависимости от направления.
	 * @param direction — направление масштабирования
	 */
	getZoomValueNextStep(direction: ZoomDirection) {
		const currentScale = canvasStore.scale

		return direction === ZoomDirection.In
			? (zoomValues.find((value) => value > currentScale) ?? maxZoomValue)
			: ([...zoomValues].reverse().find((value) => value < currentScale) ?? minZoomValue)
	},
}
