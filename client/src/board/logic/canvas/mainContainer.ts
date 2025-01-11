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
		this.setPivots()
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

	setPivots() {
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
		containerMask.x = pivotX
		containerMask.y = pivotY
		containerMask.pivot.x = pivotX
		containerMask.pivot.y = pivotY

		containerBg.clear()
		containerBg.rect(0, 0, canvasSize.width, canvasSize.height)
		containerBg.x = pivotX
		containerBg.y = pivotY
		containerBg.pivot.x = pivotX
		containerBg.pivot.y = pivotY
	},

	setSize(graphics: Graphics) {
		const canvasSize = canvasUtils.getCanvasSize()

		const x = 0
		const y = 0
		const width = canvasSize.width
		const height = canvasSize.height
		const scale = canvasUtils.getScaleMultiplier()

		graphics.clear()
		graphics.rect(x, y, width, height)
		graphics.scale.x = scale
		graphics.scale.y = scale
	},

	redrawAll() {
		this.setSize(containerMask)
		this.setSize(containerBg)

		containerMask.fill(0xffffff)
	},
}
