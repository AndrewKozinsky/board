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
 * @param e — событие нажатия клавил
 * @param keys — массив клавиш, которые должны быть нажаты
 */
export function isKeysPressed(e: KeyboardEvent, keys: KeyboardKeys[]) {
	if (e.ctrlKey !== (!isMacOS && e.ctrlKey)) {
		return false
	}
	if (e.metaKey !== (isMacOS && keys.includes(KeyboardKeys.Ctrl))) {
		return false
	}
	if (e.altKey !== keyboardUtils.isAltPressed(e)) {
		return false
	}
	if (e.shiftKey !== keyboardUtils.isShiftPressed(e)) {
		return false
	}

	const symbolKey = keys.find((key) => {
		return key !== KeyboardKeys.Ctrl && key !== KeyboardKeys.Alt && key !== KeyboardKeys.Shift
	})

	if (symbolKey !== e.code) {
		return false
	}

	return true
}

export enum KeyboardKeys {
	Plus = 'Equal',
	Minus = 'Minus',
	Space = 'space',
	Esc = 'Escape',
	Enter = 'Enter',
	S = 'KeyS',
	F = 'KeyF',

	// Alt on Windows OR Option on MacOS
	Alt = 'altKey',
	// Ctrl on Windows OR Command on MacOS
	Ctrl = 'ctrlKey',
	// Shift on the both platforms
	Shift = 'shiftKey',
}
