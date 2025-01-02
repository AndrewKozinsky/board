import { Container, Text } from 'pixi.js'
import { getStore } from '../store/store.ts'

export const pixiHelper = {
	findAllTextObjects(container: Container, result = []) {
		container.children.forEach((child) => {
			if (child instanceof Text) {
				// @ts-ignore
				result.push(child)
			}
			// If the child is a container, search its children
			if (child instanceof Container) {
				this.findAllTextObjects(child, result)
			}
		})

		return result
	},
	rerenderFonts(scale: number) {
		if (scale <= 100) return

		const texts: any = this.findAllTextObjects(getStore.app.stage)
		const { devicePixelRatio } = getStore.canvas

		for (let i = 0; i < texts.length; i++) {
			texts[i].resolution = (scale / 100) * devicePixelRatio
		}
	}
}
