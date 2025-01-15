import { ToolsName } from '../types/commonTypes.ts'
import { getUIStore, useUIStore } from '../uiStore/uiStore'
import { CanvasStoreType, Cursor } from './canvasStoreTypes.ts'

const canvasStoreObj: CanvasStoreType = {
	app: null as any,
	devicePixelRatio: window.devicePixelRatio || 1,
	$bgContainer: null as any,
	$mainContainer: null as any,
	$contentContainer: null as any,

	tool: {
		name: ToolsName.Select,
	},

	scale: 100,
	scalePivotX: 0.5,
	scalePivotY: 0.5,

	offset: {
		x: 0,
		y: 0,
	},

	cursor: Cursor.Default,
	specialCursor: null,

	pressedKeys: {
		ctrl: false,
		alt: false,
		shift: false,
	},

	mouseMetrics: {
		startX: null,
		startY: null,
		currentX: 0,
		currentY: 0,
		width: null,
		height: null,
	},

	elements: [],
}

export const canvasStore = new Proxy(canvasStoreObj, {
	set(target: CanvasStoreType, property: keyof CanvasStoreType, newValue: CanvasStoreType[typeof property]) {
		if (property === 'scale') {
			getUIStore.setCanvasScale(newValue as number)
		}

		if (property === 'tool') {
			useUIStore.setState({ tool: newValue as any })
		}

		if (property === 'elements') {
			console.log(444)
		}

		// @ts-ignore
		target[property] = newValue
		return true
	},
})
