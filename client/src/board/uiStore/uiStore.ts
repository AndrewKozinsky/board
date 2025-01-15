import { produce } from 'immer'
import { create } from 'zustand'
import { createGetStoreProxy } from '../../utils/storeUtils.ts'
import { UIStore } from './uiStoreTypes.ts'
import { ToolsName } from '../types/commonTypes.ts'

export const useUIStore = create<UIStore>((set) => {
	return {
		tool: {
			name: ToolsName.Select,
		},
		canvas: {
			scale: 100,
		},
		setCanvasScale: (scale: number) => {
			set((state) => {
				return produce(state, (draft) => {
					draft.canvas.scale = scale
				})
			})
		},
		selectedElem: null,
	}
})

export const getUIStore = createGetStoreProxy<UIStore>(useUIStore)
