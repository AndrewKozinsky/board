import { Application, Container, Renderer } from 'pixi.js'
import { canvasStore } from '../canvasStore/canvasStore.ts'
import { canvasUtils } from './canvasUtils.ts'
import { canvasBg } from './canvasBg.ts'
import { deleteElements } from './elemInteraction/deleteElements.ts'
import { hoverElements } from './elemInteraction/hoverElements.ts'
import { moveCanvas } from './canvasInteraction/moveCanvas.ts'
import { moveElements } from './elemInteraction/moveElements.ts'
import { renderCanvas } from './render/renderCanvas.ts'
import { scaleCanvas } from './canvasInteraction/scaleCanvas.ts'
import { selectElements } from './elemInteraction/selectElements.ts'

export const main = {
	async init($canvasContainer: HTMLDivElement) {
		const app = await this.createApp($canvasContainer)

		this.createRootContainers(app)
		canvasBg.create()

		scaleCanvas.setEventListeners()
		moveCanvas.setEventListeners()

		hoverElements.init()
		selectElements.init()
		moveElements.init()
		deleteElements.init()

		renderCanvas.render()
	},

	async createApp($canvasContainer: HTMLDivElement) {
		const app = new Application()

		globalThis.__PIXI_APP__ = app

		const { width, height } = canvasUtils.getCanvasSize()

		await app.init({
			width,
			height,
			resolution: canvasStore.devicePixelRatio, // Automatically adjust for Retina
			autoDensity: true, // Ensures proper scaling on Retina displays
			antialias: true,
		})

		app.stage.eventMode = 'static'

		canvasStore.app = app

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
		$bgContainer.label = 'bgContainer'

		const $mainContainer = new Container()
		$mainContainer.label = 'mainContainer'

		app.stage.addChild($bgContainer)
		app.stage.addChild($mainContainer)

		canvasStore.$bgContainer = $bgContainer
		canvasStore.$mainContainer = $mainContainer
	},
}
