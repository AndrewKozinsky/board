import { Graphics, Text } from 'pixi.js'
import { Cursor, getStore, updateStore } from '../store/store.ts'

export const renderCanvas = {
	render() {
		requestAnimationFrame(() => this.buildScene())
	},
	buildScene() {
		const { app } = getStore

		const { scale } = getStore.canvas
		const { offset } = getStore.canvas
		const { cursor } = getStore

		app.stage.position.x = offset.x
		app.stage.position.y = offset.y
		app.stage.scale = scale / 100

		app.canvas.style.cursor = cursor

		this.drawSampleObjects()
	},

	drawSampleObjects() {
		// Удалить всех детей потому что далее будут добавлены по-новой.
		// Нужно придумать какой-нибудь способ чтобы не пришлось удалять уже существующие фигуры.
		getStore.app.stage.removeChildren()

		const circle = new Graphics().circle(250, 250, 200).fill(0xff0000)

		// Add the circle to the stage
		getStore.app.stage.addChild(circle)

		// Position the circle in the middle of the canvas
		circle.x = getStore.app.canvas.width / (getStore.canvas.devicePixelRatio * 2) - circle.width / 2
		circle.y = getStore.app.canvas.height / (getStore.canvas.devicePixelRatio * 2) - circle.height / 2

		const text = new Text({ text: 'some text', style: { fontSize: 70 } })

		getStore.app.stage.addChild(text)
	}
}
