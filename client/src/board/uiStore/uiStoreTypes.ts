import { ToolsName } from '../types/commonTypes.ts'

export type UIStore = {
	tool: ToolsName
	canvas: {
		scale: number
	}
	setCanvasScale: (scale: number) => void
}
