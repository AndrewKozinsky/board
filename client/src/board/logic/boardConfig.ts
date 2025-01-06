import { KeyboardKeys } from '../../utils/keyboardUtils.ts'
import { MouseKeys } from '../../utils/mouseUtils.ts'

export const boardColors = {
	canvasBackground: '#F0F0F0FF',
	selected: '#0B99FF',
}

// Объект конфигурации доски
export const boardConfig = {
	canvasBackgroundColor: boardColors.canvasBackground,
	zoomValues: [5, 10, 15, 20, 33, 50, 75, 100, 125, 150, 200, 250, 300, 400],
	commands: {
		moveCanvas1: {
			prompt: 'Сдвиг холста (вариант 1)',
			mouseKey: MouseKeys.Wheel,
		},
		moveCanvas2: {
			prompt: 'Сдвиг холста (вариант 2)',
			hotKeys: [KeyboardKeys.Space],
			mouseKey: MouseKeys.PressLeft,
		},
		zoomCanvasIn: {
			prompt: 'Увеличение масштаба',
			hotKeys: [KeyboardKeys.Plus],
		},
		zoomCanvasOut: {
			prompt: 'Уменьшение масштаба',
			hotKeys: [KeyboardKeys.Minus],
		},
	},
}
