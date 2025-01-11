import { Application, Container, Graphics, Renderer } from 'pixi.js'
import { boardColors } from './boardConfig.ts'
import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { canvasUtils } from './canvasUtils.ts'
import { renderCanvas } from '../render/renderCanvas.ts'

// Главный контейнер куда помещается содержимое сцены
export const mainContainer = {
	init() {
		this.createContainer()
	},
	/** Создание главного контейнера */
	createContainer() {
		const $mainContainer = new Container()
		$mainContainer.label = 'mainContainer'

		canvasStore.$mainContainer = $mainContainer
		canvasStore.app.stage.addChild($mainContainer)
	},
}
