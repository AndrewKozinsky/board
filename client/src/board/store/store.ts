import {Application, Renderer} from 'pixi.js'
import { create } from 'zustand'

type BoardStore = {
	app: Application<Renderer>
	canvas: {
		devicePixelRatio: number
		// Уровень масштабирования холста. 1 = 100%
		scale: number
		// Смещение холста по X
		offsetX: number
		// Смещение холста по Y
		offsetY: number
	}

}

export const useBoardStore = create<BoardStore>((set) => {
	return {
		app: null as any,
		canvas: {
			devicePixelRatio: window.devicePixelRatio || 1,
			scale: 1,
			offsetX: 0,
			offsetY: 0,
		}
		// increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
	}
})

export const store = new Proxy(useBoardStore.getState(), {
	get(target, key: keyof BoardStore) {
		return useBoardStore.getState()[key]
	},
	/*set(target: BoardStore, key: keyof BoardStore, newValue: any, receiver: any): boolean {
		return true
	}*/
	/*set<K>(target: BoardStore, key: K, newValue: any): boolean {
		return true
	}*/
})

// store.canvas.devicePixelRatio(3)
