import { keyboardUtils } from '../../../utils/keyboardUtils.ts'
import { canvasStore } from '../../canvasStore/canvasStore.ts'

// Отлавливает нажатие клавиш и пишет в Хранилище чтобы другие функции могли знать про нажатые клавиши
export const pressingKeys = {
	/** Устанавливает обработчик отлавливающий нажатые клавиши */
	init() {
		document.addEventListener('keydown', (event) => {
			if (keyboardUtils.isCtrlPressed(event)) {
				canvasStore.pressedKeys.ctrl = true
			}

			if (keyboardUtils.isAltPressed(event)) {
				canvasStore.pressedKeys.alt = true
			}

			if (keyboardUtils.isShiftPressed(event)) {
				canvasStore.pressedKeys.shift = true
			}
		})

		document.addEventListener('keyup', (event) => {
			if (keyboardUtils.isCtrlPressed(event)) {
				canvasStore.pressedKeys.ctrl = false
			}

			if (keyboardUtils.isAltPressed(event)) {
				canvasStore.pressedKeys.alt = false
			}

			if (keyboardUtils.isShiftPressed(event)) {
				canvasStore.pressedKeys.shift = false
			}
		})

		// Если потеряли фокус, то скорее всего переключились на другое приложение,
		// поэтому поставить ctrl в false
		window.addEventListener('blur', () => {
			canvasStore.pressedKeys.ctrl = false
		})
	},
}
