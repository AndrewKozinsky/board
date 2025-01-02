import { Graphics, Text } from 'pixi.js'
import { getStore } from '../store/store.ts'

export const renderCanvas = {
	render() {
		const { app } = getStore

		const { scale } = getStore.canvas
		const { offset } = getStore.canvas
		const { statuses } = getStore

		app.stage.position.x = offset.x
		app.stage.position.y = offset.y
		app.stage.scale = scale

		if (statuses.readyToMoveCanvas) {
			getStore.app.canvas.style.cursor = 'grab'
		} else if (statuses.moveCanvasByDragging) {
			getStore.app.canvas.style.cursor = 'grabbing'
		} else {
			getStore.app.canvas.style.cursor = 'default'
		}

		this.drawSampleObjects()
	},

	drawSampleObjects() {
		const circle = new Graphics()
			.circle(250, 250, 200)
			.fill(0xFF0000)

		// Add the circle to the stage
		getStore.app.stage.addChild(circle)

		// Position the circle in the middle of the canvas
		circle.x = (getStore.app.canvas.width / (getStore.canvas.devicePixelRatio * 2)) - (circle.width / 2)
		circle.y = (getStore.app.canvas.height / (getStore.canvas.devicePixelRatio * 2)) - (circle.height / 2)

		const text = new Text({ text: 'some text', style: { fontSize: 70 } })

		getStore.app.stage.addChild(text)
	}
}
