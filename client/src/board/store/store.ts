import { produce } from 'immer'
import { create } from 'zustand'
import { arrUtils } from '../../utils/arrayUtils.ts'
import { createGetStoreProxy, createUpdateStoreProxy } from '../../utils/storeUtils.ts'
import { BoardStore, CanvasElement, Cursor, InteractionStatus, ShapeElementFigure, ToolsName } from './storeTypes.ts'

export const useBoardStore = create<BoardStore>((set) => {
	return {
		app: null as any,
		$bgContainer: null as any,
		$mainContainer: null as any,
		tool: ToolsName.Select,
		canvas: {
			devicePixelRatio: window.devicePixelRatio || 1,
			scale: 100,
			offset: {
				x: 120,
				y: 90,
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
					moving: {
						shapeInitialX: 0,
						shapeInitialY: 0,
						startMouseX: 0,
						startMouseY: 0,
					},
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
					moving: {
						shapeInitialX: 0,
						shapeInitialY: 0,
						startMouseX: 0,
						startMouseY: 0,
					},
				},
			],
		},
		cursor: Cursor.Default,
		updateCanvasElement: (elementId: number, elementNewData: Partial<CanvasElement>) => {
			set((state) => {
				return produce(state, (draft) => {
					const elementIdx = arrUtils.getItemIdxByPropNameAndValue(draft.canvas.elements, 'id', elementId)
					if (elementIdx < 0) return draft

					Object.assign(draft.canvas.elements[elementIdx], elementNewData)
				})
			})
		},
	}
})

export const updateStore = createUpdateStoreProxy(useBoardStore.getState(), useBoardStore)
export const getStore = createGetStoreProxy<BoardStore>(useBoardStore)
