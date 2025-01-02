import { Application, Renderer } from 'pixi.js'
import { create } from 'zustand'
import { createGetStoreProxy, createUpdateStoreProxy } from '../../utils/createStoreProxy.ts'

export enum Cursor {
	Default = 'default',
	Palm = 'grab',
	Dragging = 'grabbing'
}

type BoardStore = {
	app: Application<Renderer>
	canvas: {
		devicePixelRatio: number
		// Уровень масштабирования холста. 1 = 100%
		scale: number
		// Смещение холста
		offset: {
			x: number
			y: number
		}
	}
	cursor: Cursor
}

export const useBoardStore = create<BoardStore>((set) => {
	return {
		app: null as any,
		canvas: {
			devicePixelRatio: window.devicePixelRatio || 1,
			scale: 100,
			offset: {
				x: 0,
				y: 0
			}
		},
		cursor: Cursor.Default
		// increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
	}
})

export const updateStore = createUpdateStoreProxy(useBoardStore.getState(), useBoardStore)
export const getStore = createGetStoreProxy<BoardStore>(useBoardStore)
