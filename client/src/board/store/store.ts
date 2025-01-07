import { create } from 'zustand'
import { arrUtils } from '../../utils/arrayUtils.ts'
import { createGetStoreProxy, createUpdateStoreProxy } from '../../utils/storeUtils.ts'
import { BoardStore, CanvasElement, Cursor, InteractionStatus, ShapeElementFigure, ToolsName } from './storeTypes.ts'

export const useBoardStore = create<BoardStore>((set) => {
	return {
		app: null as any,
		tool: ToolsName.Select,
		canvas: {
			devicePixelRatio: window.devicePixelRatio || 1,
			scale: 100,
			offset: {
				x: 0,
				y: 0,
			},
			elements: [
				{
					id: 1,
					type: 'figureElement',
					shape: ShapeElementFigure.Rectangle,
					graphics: null,
					x: 150,
					y: 70,
					width: 100,
					height: 200,
					backgroundColor: 'ccc',
				},
				{
					id: 2,
					type: 'figureElement',
					shape: ShapeElementFigure.Star,
					graphics: null,
					x: 350,
					y: 270,
					width: 200,
					height: 200,
					backgroundColor: 'ccc',
					interactionStatus: InteractionStatus.Selected,
				},
			],
		},
		cursor: Cursor.Default,
		updateCanvasElement: (elementId: number, elementNewData: Partial<CanvasElement>) => {
			set((state) => {
				const elementIdx = arrUtils.getItemIdxByPropNameAndValue(state.canvas.elements, 'id', elementId)
				if (elementIdx < 0) {
					throw new Error(`Canvas element ${elementIdx} not found`)
				}

				const canvasClone = { ...state.canvas }
				canvasClone.elements = [...canvasClone.elements]

				// @ts-expect-error
				canvasClone.elements[elementIdx] = { ...canvasClone.elements[elementIdx], ...elementNewData }

				return { canvas: canvasClone }
			})
		},
	}
})

export const updateStore = createUpdateStoreProxy(useBoardStore.getState(), useBoardStore)
export const getStore = createGetStoreProxy<BoardStore>(useBoardStore)
