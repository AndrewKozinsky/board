import { Application, Renderer } from 'pixi.js'
import { create } from 'zustand'
import { createGetStoreProxy, createUpdateStoreProxy } from '../../utils/createStoreProxy.ts'

type BoardStore = {
	app: Application<Renderer>
	mouse: {
		// Нажата ли левая кнопка мыши
		leftButton: boolean
		// Нажата ли правая кнопка мыши
		rightButton: boolean
	}
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
	statuses: {
		// Показ курсора типа grab
		readyToMoveCanvas: boolean
		// Показ курсора типа grabbing
		moveCanvasByDragging: boolean
	}
}

export const useBoardStore = create<BoardStore>((set) => {
	return {
		app: null as any,
		mouse: {
			leftButton: false,
			// Нажата ли правая кнопка мыши
			rightButton: false
		},
		canvas: {
			devicePixelRatio: window.devicePixelRatio || 1,
			scale: 1,
			offset: {
				x: 0,
				y: 0
			}
		},
		statuses: {
			readyToMoveCanvas: false,
			moveCanvasByDragging: false
		}
		// increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
	}
})

export const updateStore = createUpdateStoreProxy(useBoardStore.getState(), useBoardStore)
export const getStore = createGetStoreProxy<BoardStore>(useBoardStore)
