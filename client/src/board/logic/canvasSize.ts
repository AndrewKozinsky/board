import { getStore } from '../store/store.ts'

// Методы для работы с размером холста
export const canvasSize = {
	/** Получение размера холста */
	getSize() {
		const windowWidth = document.documentElement.clientWidth
		const windowHeight = document.documentElement.clientHeight

		return {
			width: windowWidth,
			height: windowHeight
		}
	},

	/** Установка слушателя изменения размера окна браузера запускающий функцию установки правильных размеров */
	setCorrectCanvasSizeAfterWindowResize() {
		addEventListener('resize', this.setCorrectCanvasSize.bind(this))
	},

	/** Функция устанавливающая правильные размеры холста */
	setCorrectCanvasSize() {
		setTimeout(() => {
			const canvasSize = this.getSize()

			getStore.app.renderer.resize(canvasSize.width, canvasSize.height)
		}, 0)
	}
}
