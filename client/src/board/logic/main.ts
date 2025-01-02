import { Application, Assets, Graphics, Text } from 'pixi.js'
import { getStore, updateStore, useBoardStore } from '../store/store.ts'
import { moveCanvas } from './moveCanvas.ts'
import { scaleCanvas } from './scaleCanvas.ts'
import { canvasSize } from './canvasSize.ts'
import { renderCanvas } from './renderCanvas.ts'
import '../../utils/createStoreProxy.ts'

export const main = {
	async init($canvasContainer: HTMLDivElement) {
		const app = new Application()

		// @ts-expect-error
		globalThis.__PIXI_APP__ = app

		const { width, height } = canvasSize.getSize()

		await app.init({
			width,
			height,
			backgroundColor: '#F0F0F0FF',
			resolution: getStore.canvas.devicePixelRatio, // Automatically adjust for Retina
			autoDensity: true, // Ensures proper scaling on Retina displays
			antialias: true
		})

		updateStore.app = app

		// Append the PixiJS canvas to the container
		$canvasContainer.appendChild(app.canvas)

		canvasSize.setCorrectCanvasSizeAfterWindowResize()

		scaleCanvas.setEventListeners()
		moveCanvas.setEventListeners()

		renderCanvas.render()
	}
}

