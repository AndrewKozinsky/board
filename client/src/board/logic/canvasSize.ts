import {store} from '../store/store.ts'

export const canvasSize = {
	getCanvasSize() {
		const windowWidth = document.documentElement.clientWidth
		const windowHeight = document.documentElement.clientHeight

		return {
			width: windowWidth,
			height: windowHeight,
		}
	},

	/*setCorrectCanvasSizeAfterWindowResize() {
		addEventListener("resize", this.setCorrectCanvasSize.bind(this))
	},*/

	/*setCorrectCanvasSize() {
		setTimeout(() => {
			const canvasSize = this.getCanvasSize()

			store.app.renderer.resize(canvasSize.width, canvasSize.height);
		}, 100)
	}*/
}
