import { useBoardStore } from '../../../../store/store.ts'

export function useGetScale() {
	return useBoardStore((s) => s.canvas.scale)
}
