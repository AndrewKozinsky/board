import { Application, Container, Renderer } from 'pixi.js'
import { getStore, updateStore, useBoardStore } from '../store/store.ts'
import { canvasUtils } from './canvasUtils.ts'
import { canvasBg } from './canvasBg.ts'
import { moveCanvas } from './moveCanvas.ts'
import { renderCanvas } from './render/renderCanvas.ts'
import { scaleCanvas } from './scaleCanvas.ts'

export const main = {
	async init($canvasContainer: HTMLDivElement) {
		const app = await this.createApp($canvasContainer)

		this.createRootContainers(app)
		canvasBg.create()

		scaleCanvas.setEventListeners()
		moveCanvas.setEventListeners()

		renderCanvas.render()
	},

	async createApp($canvasContainer: HTMLDivElement) {
		const app = new Application()

		globalThis.__PIXI_APP__ = app

		const { width, height } = canvasUtils.getCanvasSize()

		await app.init({
			width,
			height,
			resolution: getStore.canvas.devicePixelRatio, // Automatically adjust for Retina
			autoDensity: true, // Ensures proper scaling on Retina displays
			antialias: true,
		})

		useBoardStore.setState({ app })

		// Append the PixiJS canvas to the container
		$canvasContainer.appendChild(app.canvas)

		addEventListener('resize', () => {
			const canvasSize = canvasUtils.getCanvasSize()
			app.renderer.resize(canvasSize.width, canvasSize.height)
		})

		return app
	},

	createRootContainers(app: Application<Renderer>) {
		const $bgContainer = new Container()
		const $mainContainer = new Container()

		app.stage.addChild($bgContainer)
		app.stage.addChild($mainContainer)

		updateStore.$bgContainer = $bgContainer
		updateStore.$mainContainer = $mainContainer
	},
}
