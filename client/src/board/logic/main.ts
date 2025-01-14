import { Application, Container, Renderer } from 'pixi.js'
import { wait } from '../../utils/promise.ts'
import { canvasStore } from '../canvasStore/canvasStore.ts'
import { ShapeElementFigure } from '../types/commonTypes.ts'
import { fullScreen } from './canvas/fullScreen.ts'
import { mainContainer } from './canvas/mainContainer.ts'
import { mouseMetrics } from './canvas/mouseMetrics.ts'
import { pressingKeys } from './canvas/pressingKeys.ts'
import { drawFigures } from './elems/drawFigure.ts'
import { canvasUtils } from './canvas/canvasUtils.ts'
import { canvasBackground } from './canvas/canvasBackground.ts'
import { deleteElements } from './elemInteraction/deleteElements.ts'
import { hoverElements } from './elemInteraction/hoverElements.ts'
import { moveCanvas } from './canvas/moveCanvas.ts'
import { moveElements } from './elemInteraction/moveElements.ts'
import { FigureElement } from './elems/FigureElement.ts'
import { renderCanvas } from './render/renderCanvas.ts'
import { scaleCanvas } from './canvas/scaleCanvas.ts'
import { selectElements } from './elemInteraction/selectElements.ts'
import { tools } from './tools/tools.ts'

export const main = {
	async init($canvasContainer: HTMLDivElement) {
		await this.createApp($canvasContainer)

		canvasBackground.init()
		mainContainer.init()

		pressingKeys.init()
		mouseMetrics.init()
		fullScreen.init()

		scaleCanvas.init()
		moveCanvas.init()

		hoverElements.init()
		selectElements.init()
		moveElements.init()
		deleteElements.init()

		tools.init()

		drawFigures.init()

		await wait(10, () => {
			canvasStore.elements.push(
				new FigureElement({
					shape: ShapeElementFigure.Rectangle,
					x: 250,
					y: 170,
					width: 100,
					height: 200,
					backgroundColor: 'ccc',
				}),
			)

			canvasStore.elements.push(
				new FigureElement({
					shape: ShapeElementFigure.Star,
					x: 450,
					y: 370,
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
}
