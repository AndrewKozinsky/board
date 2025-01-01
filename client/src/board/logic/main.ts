import { Application, Graphics, Text } from 'pixi.js'
import { store, useBoardStore } from '../store/store.ts'
import { canvasMove } from './canvasMove.ts'
import { canvasScale } from './canvasScale.ts'
import { canvasSize } from './canvasSize.ts'
import { renderCanvas } from './renderCanvas.ts'











export const main = {
	async init($canvasContainer: HTMLDivElement) {
		const app = new Application()

		// @ts-ignore
		globalThis.__PIXI_APP__ = app

		const { width, height } = canvasSize.getCanvasSize()

		/*await app.init({
			width,
			height,
			backgroundColor: '#F0F0F0FF',
			resolution: store.canvas.devicePixelRatio, // Automatically adjust for Retina
			autoDensity: true, // Ensures proper scaling on Retina displays
			antialias: true,
		})*/

		// useBoardStore.setState({app})

		// Append the PixiJS canvas to the container
		// $canvasContainer.appendChild(app.canvas)

		// canvasSize.setCorrectCanvasSizeAfterWindowResize()

		// canvasScale.setEventListeners()
		// canvasMove.setEventListeners()

		// renderCanvas.drawScene()
	},
}


