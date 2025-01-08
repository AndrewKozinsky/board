// Методы для работы с холстом
export const canvasUtils = {
	/** Получение размера холста */
	getCanvasSize() {
		const windowWidth = document.documentElement.clientWidth
		const windowHeight = document.documentElement.clientHeight

		return {
			width: windowWidth,
			height: windowHeight,
		}
	},
}
