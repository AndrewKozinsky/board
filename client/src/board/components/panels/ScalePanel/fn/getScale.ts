import {useBoardStore} from '../../../store/store.ts'

export function useGetScale() {
	const scale = useBoardStore(s => s.canvas.scale)

	return scale * 100
}
