import { Tools } from '../types/commonTypes.ts'

export type UIStore = {
	tool: Tools
	canvas: {
		scale: number
	}
	setCanvasScale: (scale: number) => void
}
