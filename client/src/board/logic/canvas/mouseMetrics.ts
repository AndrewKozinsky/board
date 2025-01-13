import { FederatedPointerEvent } from 'pixi.js'
import { canvasStore } from '../../canvasStore/canvasStore.ts'

// Отлавливает координаты мыши и пишет в Хранилище чтобы другие функции могли это использовать
export const mouseMetrics = {
	/** Устанавливает обработчик отлавливающие координаты мыши */
	init() {
		canvasStore.app.stage.on('pointerdown', (e) => {
			this.setStartCoords(e)
		})

		canvasStore.app.stage.on('pointermove', (e) => {
			this.setMovingCoords(e)
		})

		canvasStore.app.stage.on('pointerup', (e) => {
			this.setEndCoords()
		})
	},

	/**
	 * Обработчик нажатия левой кнопки мыши
	 * @param e — объект события
	 */
	setStartCoords(e: FederatedPointerEvent) {
		const { mouseMetrics } = canvasStore

		mouseMetrics.startX = e.global.x
		mouseMetrics.startY = e.global.y
	},

	/**
	 * Обработчик движения мыши
	 * @param e e — объект события
	 */
	setMovingCoords(e: FederatedPointerEvent) {
		const { mouseMetrics } = canvasStore

		mouseMetrics.currentX = e.global.x
		mouseMetrics.currentY = e.global.y

		if (mouseMetrics.startX && mouseMetrics.startY) {
			mouseMetrics.width = mouseMetrics.startX - mouseMetrics.currentX
			mouseMetrics.height = mouseMetrics.startY - mouseMetrics.currentY
		}
	},

	/** Обработчик отжатия левой кнопки мыши */
	setEndCoords() {
		const { mouseMetrics } = canvasStore

		mouseMetrics.startX = null
		mouseMetrics.startY = null
		mouseMetrics.width = null
		mouseMetrics.height = null
	},
}
