import { getStore } from '../store/store.ts'

export const canvasSize = {
	getSize() {
		const windowWidth = document.documentElement.clientWidth
		const windowHeight = document.documentElement.clientHeight

		return {
			width: windowWidth,
			height: windowHeight
		}
	},

	setCorrectCanvasSizeAfterWindowResize() {
		addEventListener('resize', this.setCorrectCanvasSize.bind(this))
	},

	setCorrectCanvasSize() {
		setTimeout(() => {
			const canvasSize = this.getSize()

			getStore.app.renderer.resize(canvasSize.width, canvasSize.height)
		}, 100)
	}
}
