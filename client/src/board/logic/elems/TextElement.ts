import { arrUtils } from '../../../utils/arrayUtils.ts'
import { canvasStore } from '../../canvasStore/canvasStoreProxy.ts'
import { InteractionStatus } from '../../canvasStore/canvasStoreTypes.ts'

type TextElementInput = {
	id?: number
	x: number
	y: number
}

export class TextElement {
	id: number
	x: number
	y: number
	// Навели ли на элемент (должна появиться синяя обводка)
	interactionStatus = InteractionStatus.Default
	delete = false

	constructor(inputData: TextElementInput) {
		this.id = inputData.id ?? arrUtils.getHighestItemId(canvasStore.elements) + 1

		this.x = inputData.x
		this.y = inputData.y
	}
}
