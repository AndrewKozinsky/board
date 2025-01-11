import { Application, Container, Graphics, Renderer } from 'pixi.js'
import { boardColors } from './boardConfig.ts'
import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { canvasUtils } from './canvasUtils.ts'
import { renderCanvas } from '../render/renderCanvas.ts'

export let containerMask: Graphics = null as any
export let containerBg: Graphics = null as any

// Главный контейнер куда помещается содержимое сцены
export const mainContainer = {
	init() {
		this.createContainer()
		this.createContainerMask()
		this.createContainerBg()
		this.createContentContainer()
		this.ff()
	},

	/** Создание главного контейнера */
	createContainer() {
		const $mainContainer = new Container()
		$mainContainer.label = 'mainContainer'

		canvasStore.$mainContainer = $mainContainer
		canvasStore.app.stage.addChild($mainContainer)
	},

	createContainerMask() {
		containerMask = new Graphics()
		containerMask.label = 'mainContainerMask'

		canvasStore.$mainContainer.mask = containerMask
		canvasStore.$mainContainer.addChild(containerMask)
	},

	createContainerBg() {
		containerBg = new Graphics()
		containerBg.label = 'mainContainerBg'

		canvasStore.$mainContainer.addChild(containerBg)
	},

	createContentContainer() {
		const $contentContainer = new Container()
		$contentContainer.label = 'contentContainer'

		canvasStore.$contentContainer = $contentContainer
		canvasStore.$mainContainer.addChild($contentContainer)
	},

	/*getSizes() {
		const canvasSize = canvasUtils.getCanvasSize()

		const x = 0
		const y = 0
		const width = canvasSize.width
		const height = canvasSize.height

		const arr: [number, number, number, number] = [x, y, width, height]

		return arr
	},*/

	ff() {
		const canvasSize = canvasUtils.getCanvasSize()
		const container = canvasStore.$mainContainer

		const pivotX = canvasSize.width / 2
		const pivotY = canvasSize.height / 2

		container.x = pivotX
		container.y = pivotY
		container.pivot.x = pivotX
		container.pivot.y = pivotY

		containerMask.clear()
		containerMask.rect(0, 0, canvasSize.width, canvasSize.height).fill(0xffffff)

		containerBg.clear()
		containerBg.rect(0, 0, canvasSize.width, canvasSize.height).fill(0xffffff)
	},

	redrawAll() {
		const canvasSize = canvasUtils.getCanvasSize()

		// containerMask.clear()
		// containerMask.rect(...sizes).fill(0xffffff)
		// containerBg.clear()
		// containerBg.rect(...sizes).fill(0xffffff)
		// const pivotX = sizes[2] / 2
		// const pivotY = sizes[3] / 2
		/*containerMask.x = pivotX
		containerMask.y = pivotY
		containerMask.pivot.x = pivotX
		containerMask.pivot.y = pivotY

		containerBg.x = pivotX
		containerBg.y = pivotY
		containerBg.pivot.x = pivotX
		containerBg.pivot.y = pivotY*/
	},
}
