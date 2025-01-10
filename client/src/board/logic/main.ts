import { Application, Container, Renderer } from 'pixi.js'
import { wait } from '../../utils/promise.ts'
import { canvasStore } from '../canvasStore/canvasStore.ts'
import { ShapeElementFigure } from '../types/commonTypes.ts'
import { canvasUtils } from './utils/canvasUtils.ts'
import { canvasBg } from './utils/canvasBg.ts'
import { deleteElements } from './elemInteraction/deleteElements.ts'
import { hoverElements } from './elemInteraction/hoverElements.ts'
import { moveCanvas } from './canvasInteraction/moveCanvas.ts'
import { moveElements } from './elemInteraction/moveElements.ts'
import { FigureElement } from './elements/FigureElement.ts'
import { renderCanvas } from './render/renderCanvas.ts'
import { scaleCanvas } from './canvasInteraction/scaleCanvas.ts'
import { selectElements } from './elemInteraction/selectElements.ts'
import { tools } from './tools/tools.ts'

export const main = {
	async init($canvasContainer: HTMLDivElement) {
		const app = await this.createApp($canvasContainer)

		this.createRootContainers(app)
		canvasBg.create()

		scaleCanvas.init()
		moveCanvas.init()

		hoverElements.init()
		selectElements.init()
		moveElements.init()
		deleteElements.init()

		tools.init()

		await wait(10, () => {
			canvasStore.elements.push(
				new FigureElement({
					shape: ShapeElementFigure.Rectangle,
					x: 150,
					y: 70,
					width: 100,
					height: 200,
					backgroundColor: 'ccc',
				}),
			)

			canvasStore.elements.push(
				new FigureElement({
					shape: ShapeElementFigure.Star,
					x: 350,
					y: 270,
					width: 200,
					height: 200,
					backgroundColor: 'ccc',
				}),
			)
		})

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
