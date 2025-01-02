import { pixiHelper } from './pixiHelper.ts'

type ScaleDirection = 'zoomIn' | 'zoomOut'

export const scaleCanvas = {
	setEventListeners() {
		/*window.addEventListener('keydown', (event) => {
			if (event.key === '=') {
				this.zoomCanvas('zoomIn') // Zoom out (scale up by 25%)
			} else if (event.key === '-') {
				this.zoomCanvas('zoomOut') // Zoom in (scale down by 25%)
			}
		})*/
	}

	/*zoomCanvas(scaleDirection: ScaleDirection) {
		const currentScale = store.app.stage.scale.x
		let newScale = this.getNextZoomValue(scaleDirection)
		store.app.stage.scale.set(newScale, newScale)

		let percentDiff = Math.abs((currentScale - newScale) / 2)
		percentDiff = Math.round(percentDiff * 100) / 100
		let pixelsWidthDiff = Math.round(store.app.canvas.clientWidth * percentDiff)
		let pixelsHeightDiff = Math.round(store.app.canvas.clientHeight * percentDiff)

		if (scaleDirection === 'zoomOut') {
			store.app.stage.position.x += pixelsWidthDiff
			store.app.stage.position.y += pixelsHeightDiff
		} else {
			store.app.stage.position.x -= pixelsWidthDiff
			store.app.stage.position.y -= pixelsHeightDiff
		}

		this.adjustFontsSize(newScale)
	},*/

	/*getNextZoomValue(direction: ScaleDirection) {
		const zoomValues = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8]

		const currentScale = store.app.stage.scale.x
		const index = zoomValues.findIndex(x => x === currentScale)

		if (index === 0 && direction === 'zoomOut') return currentScale
		if (zoomValues.length - 1 === index && direction === 'zoomIn') return currentScale

		return direction === 'zoomIn'
			? zoomValues[index + 1]
			: zoomValues[index - 1]
	},*/

	/*adjustFontsSize(scale: number) {
		if (scale <= 1) return

		const texts = pixiHelper.findAllTextObjects(store.app.stage)

		for (let i = 0; i < texts.length; i++) {
			texts[i].resolution = scale * store.canvas.devicePixelRatio
		}
	}*/
}
