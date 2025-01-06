import { Assets, Graphics, Sprite, Text, Texture } from 'pixi.js'
import { getElementIdx, getHighestElementId } from '../../../utils/arrayUtils.ts'
import { getStore, updateStore } from '../../store/store.ts'
import { pixiUtils } from '../../../utils/pixiUtils.ts'
import { drawShape } from './drawShape.ts'

export const renderCanvas = {
	/** Отрисовка сцены */
	render() {
		requestAnimationFrame(() => this.buildScene())
	},

	/** Сборка сцены */
	buildScene() {
		const { app } = getStore

		const { scale } = getStore.canvas
		const { offset } = getStore.canvas
		const { cursor } = getStore

		app.stage.position.x = offset.x
		app.stage.position.y = offset.y
		app.stage.scale = scale / 100

		app.canvas.style.cursor = cursor

		this.drawShapes()

		pixiUtils.rerenderFonts(scale)
	},

	drawShapes() {
		const elements = getStore.canvas.elements

		for (let i = 0; i < elements.length; i++) {
			const element = elements[i]

			if (element.type === 'shapeElement') {
				// drawShape.drawShapes()
				/*if (element.link) {
					const rectElement = element.link

					rectElement.x = element.x
					rectElement.y = element.y
					rectElement.fill(element.backgroundColor)
				} else {
					const rectElement = new Graphics()
						.rect(element.x, element.y, element.width, element.height)
						.fill(element.backgroundColor)

					getStore.app.stage.addChild(rectElement)

					// Поставить ссылку на созданный элемент в Хранилище
					const elementIdx = getElementIdx(elements, 'id', element.id)
					if (getStore.canvas.elements[elementIdx].type === 'shapeElement') {
						updateStore.canvas.elements[elementIdx] = {
							...getStore.canvas.elements[elementIdx],
							link: rectElement,
						}
					}
				}*/
			}
		}
	},
}
