import { create } from 'zustand'

type BoardStore = {
	canvas: {
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
		canvas: {
			scale: 1,
			offsetX: 0,
			offsetY: 0,
		}
		// increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
	}
})
