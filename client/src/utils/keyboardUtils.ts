import { detectOS, OSNames } from './os.ts'

const isMacOS = detectOS() === OSNames.mac

export const keyboardUtils = {
	isCtrlPressed(event: { code: string; ctrlKey: boolean }) {
		if (isMacOS) return event.code === 'MetaLeft'
		return event.ctrlKey
	},
	isAltPressed(event: { altKey: boolean }) {
		return event.altKey
	},
	isShiftPressed(event: { shiftKey: boolean }) {
		return event.shiftKey
	},
	isSpacePressed(event: KeyboardEvent) {
		return event.code === 'Space'
	},
	isDeletePressed(event: KeyboardEvent) {
		return event.code === 'Backspace'
	},
}

/**
 * Получает объект события нажатия клавиш и проверяет точное соответствие между желаемыми клавишами и нажатыми.
 * Возвращает ложь если есть несоответствии.
 * @param keyDownEvent — событие нажатия клавил
 * @param keys — массив клавиш, которые должны быть нажаты
 */
export function isKeysPressed(keyDownEvent: KeyboardEvent, keys: KeyboardKeys[]) {
	if (keyDownEvent.ctrlKey !== (!isMacOS && keyDownEvent.ctrlKey)) {
		return false
	}
	if (keyDownEvent.metaKey !== (isMacOS && keys.includes(KeyboardKeys.Ctrl))) {
		return false
	}
	if (keyDownEvent.altKey !== keyboardUtils.isAltPressed(keyDownEvent)) {
		return false
	}
	if (keyDownEvent.shiftKey !== keyboardUtils.isShiftPressed(keyDownEvent)) {
		return false
	}

	const symbolKey = keys.find((key) => {
		return key !== KeyboardKeys.Ctrl && key !== KeyboardKeys.Alt && key !== KeyboardKeys.Shift
	})

	if (symbolKey !== keyDownEvent.code) {
		return false
	}

	return true
}

export enum KeyboardKeys {
	Plus = '=',
	Minus = '-',
	Space = 'space',
	Esc = 'Escape',
	S = 'KeyS',

	// Alt on Windows OR Option on MacOS
	Alt = 'altKey',
	// Ctrl on Windows OR Command on MacOS
	Ctrl = 'ctrlKey',
	// Shift on the both platforms
	Shift = 'shiftKey',
}
