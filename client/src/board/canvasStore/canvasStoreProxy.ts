import { getUIStore, useUIStore } from '../uiStore/uiStore.ts'
import { canvasStoreObj } from './canvasStore.ts'
import { CanvasStoreType } from './canvasStoreTypes.ts'

export const canvasStore = new Proxy(canvasStoreObj, {
	set(target: CanvasStoreType, property: keyof CanvasStoreType, newValue: CanvasStoreType[typeof property]) {
		if (property === 'scale') {
			getUIStore.setCanvasScale(newValue as number)
		}

		if (property === 'tool') {
			useUIStore.setState({ tool: newValue as any })
		}

		// @ts-ignore
		target[property] = newValue

		return true
	},
})
