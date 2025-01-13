import { isKeysPressed } from '../../../utils/keyboardUtils.ts'
import { boardConfig } from './boardConfig.ts'
import { renderCanvas } from '../render/renderCanvas.ts'
import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { canvasUtils } from './canvasUtils.ts'
import { mainContainer } from './mainContainer.ts'

export enum ZoomDirection {
	// Приблизить
	In = 1,
	// Отдалить
	Out = 2,
}

const { zoomValues } = boardConfig
const minZoomValue = zoomValues[0]
const maxZoomValue = zoomValues[zoomValues.length - 1]

export const scaleCanvas = {
	/** Устанавливает обработчики отвечающие за масштабирование холста */
	init() {
		// Масштабировать если нажали + или -
		window.addEventListener('keydown', (event) => {
			if (isKeysPressed(event, boardConfig.commands.zoomCanvasIn.hotKeys)) {
				this.zoomCanvasOneStep(ZoomDirection.In) // Zoom out (scale up by 25%)
			} else if (isKeysPressed(event, boardConfig.commands.zoomCanvasOut.hotKeys)) {
				this.zoomCanvasOneStep(ZoomDirection.Out) // Zoom in (scale down by 25%)
			}
		})

		// Масштабировать если нажали Cmd и крутят колесо мыши
		canvasStore.app.canvas.addEventListener(
			'wheel',
			(event) => {
				if (!canvasStore.pressedKeys.ctrl) return
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

		const { width, height } = canvasUtils.getCanvasSize()

		this.zoom(newScale, e.clientX / width, e.clientY / height)
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
	 * @param canvasPivotLeftPc — координата X точки трансформации в процентах
	 * @param canvasPivotTopPc — координата Y точки трансформации в процентах
	 */
	zoom(newScale: number, canvasPivotLeftPc: number, canvasPivotTopPc: number) {
		canvasStore.scalePivotX = canvasPivotLeftPc
		canvasStore.scalePivotY = canvasPivotTopPc

		// Поставить самое большое или самое маленькое значение если вышли из этого диапазона
		if (newScale < minZoomValue || newScale > maxZoomValue) {
			canvasStore.scale = newScale < minZoomValue ? minZoomValue : maxZoomValue
			renderCanvas.render()
			return
		}

		canvasStore.scale = Math.round(newScale)

		mainContainer.redrawAll()

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
