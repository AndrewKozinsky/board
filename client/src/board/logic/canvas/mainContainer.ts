import { Application, Container, Graphics, Renderer } from 'pixi.js'
import { boardColors } from './boardConfig.ts'
import { canvasStore } from '../../canvasStore/canvasStoreProxy.ts'
import { canvasUtils } from './canvasUtils.ts'
import { renderCanvas } from '../render/renderCanvas.ts'

export let containerBg: Graphics = null as any
// export let containerMask: Graphics = null as any

// Главный контейнер куда помещается содержимое сцены
export const mainContainer = {
	init() {
		this.createContainer()
		// this.createContainerMask()
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

	/*createContainerMask() {
		containerMask = new Graphics()
		containerMask.label = 'mainContainerMask'

		canvasStore.$mainContainer.mask = containerMask
	},*/

	createContainerBg() {
		containerBg = new Graphics()
		containerBg.label = 'mainContainerBg'
		containerBg.interactive = false
		containerBg.interactiveChildren = false

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
		const pivotX = canvasSize.width / 2
		const pivotY = canvasSize.height / 2

		canvasStore.$mainContainer.x = pivotX
		canvasStore.$mainContainer.y = pivotY
		canvasStore.$mainContainer.pivot.x = pivotX
		canvasStore.$mainContainer.pivot.y = pivotY

		containerBg.clear()
		containerBg.rect(0, 0, canvasSize.width, canvasSize.height).fill(boardColors.canvasBackground) // 0xffffff
		containerBg.x = pivotX
		containerBg.y = pivotY
		containerBg.pivot.x = pivotX
		containerBg.pivot.y = pivotY

		// containerMask.clear()
		// containerMask.rect(0, 0, canvasSize.width, canvasSize.height).fill(boardColors.canvasBackground) // 0xffffff
		// containerMask.x = pivotX
		// containerMask.y = pivotY
		// containerMask.pivot.x = pivotX
		// containerMask.pivot.y = pivotY
	},

	redrawAll() {
		const canvasSize = canvasUtils.getCanvasSize()
		const scale = canvasUtils.getScaleMultiplier()

		const pivotX = canvasSize.width * canvasStore.scalePivotX
		const pivotY = canvasSize.height * canvasStore.scalePivotY

		const container = canvasStore.$mainContainer
		container.x = pivotX
		container.y = pivotY
		container.pivot.x = pivotX
		container.pivot.y = pivotY

		containerBg.clear()
		containerBg.rect(0, 0, canvasSize.width, canvasSize.height).fill(boardColors.canvasBackground) // 0xffffff
		containerBg.scale.x = scale
		containerBg.scale.y = scale

		// containerMask.clear()
		// containerMask.rect(0, 0, canvasSize.width, canvasSize.height).fill(boardColors.canvasBackground) // 0xffffff
		// containerMask.scale.x = scale
		// containerMask.scale.y = scale
	},
}
