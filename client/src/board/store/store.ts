import { create } from 'zustand'
import { createGetStoreProxy, createUpdateStoreProxy } from '../../utils/storeUtils.ts'
import { BoardStore, Cursor, ShapeElementFigure } from './storeTypes.ts'

export const useBoardStore = create<BoardStore>((set) => {
	return {
		app: null as any,
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
					x: 50,
					y: 70,
					width: 100,
					height: 200,
					backgroundColor: 'ccc',
				},
				{
					id: 2,
					type: 'figureElement',
					shape: ShapeElementFigure.Diamond,
					graphics: null,
					x: 250,
					y: 270,
					width: 300,
					height: 200,
					backgroundColor: 'ccc',
				},
			],
		},
		cursor: Cursor.Default,
		// increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
	}
})

export const updateStore = createUpdateStoreProxy(useBoardStore.getState(), useBoardStore)
export const getStore = createGetStoreProxy<BoardStore>(useBoardStore)
