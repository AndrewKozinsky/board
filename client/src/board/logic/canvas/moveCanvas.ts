import { KeyboardKeys, keyboardUtils } from '../../../utils/keyboardUtils.ts'
import { MouseKeys } from '../../../utils/mouseUtils.ts'
import { canvasStore } from '../../canvasStore/canvasStore.ts'
import { Cursor } from '../../canvasStore/canvasStoreTypes.ts'
import { renderCanvas } from '../render/renderCanvas.ts'
import { boardConfig } from './boardConfig.ts'
import { canvasUtils } from './canvasUtils.ts'

// Методы работы с передвижением холста
export const moveCanvas = {
	isMousePressed: false,
	isSpacePressed: false,
	mouseStartX: 0,
	mouseStartY: 0,

	/** Установка обработчиков заставляющих холст двигаться */
	init() {
		// Просто проверка, что клавиши в конфигурации не изменились
		if (boardConfig.commands.moveCanvas1.mouseKey === MouseKeys.Wheel) {
			this.setMoveByMouseWheel()
		} else {
			throw new Error('Кнопка перемещение холста изменилась')
		}

		const moveCommand2 = boardConfig.commands.moveCanvas2

		// Просто проверка, что клавиши в конфигурации не изменились
		if (moveCommand2.mouseKey === MouseKeys.PressLeft && moveCommand2.hotKeys[0] === KeyboardKeys.Space) {
			this.setMoveByMouseAndSpaceKey()
		} else {
			throw new Error('Клавиша перемещение холста изменилась')
		}
	},

	/** Холст перемещается если прокручивают мышью */
	setMoveByMouseWheel() {
		canvasStore.app.stage.on(
			'wheel',
			(event) => {
				if (canvasStore.pressedKeys.ctrl) return

				const { deltaX, deltaY } = event
				this.moveCanvas(deltaX, deltaY)
			},
			{ passive: true },
		)
	},

	/** Холст перемещается если нажали на пробел и зажали мышь */
	setMoveByMouseAndSpaceKey() {
		document.addEventListener('keydown', (event) => {
			if (keyboardUtils.isSpacePressed(event) && !event.repeat) {
				this.isSpacePressed = true
				canvasUtils.setSpecialCursor(Cursor.Palm)
			}
		})

		document.addEventListener('keyup', (event) => {
			if (keyboardUtils.isSpacePressed(event)) {
				this.isSpacePressed = false

				canvasUtils.setSpecialCursor(null)
			}
		})

		document.addEventListener('mousedown', (event) => {
			this.isMousePressed = true
			this.mouseStartX = event.clientX
			this.mouseStartY = event.clientY

			if (this.isSpacePressed) {
				canvasUtils.setSpecialCursor(Cursor.Dragging)
			}
		})

		document.addEventListener('mouseup', () => {
			this.isMousePressed = false

			if (this.isSpacePressed) {
				canvasUtils.setSpecialCursor(null)
			}
		})

		document.addEventListener('pointermove', (event) => {
			if (this.isMousePressed && this.isSpacePressed) {
				const offsetX = this.mouseStartX - event.clientX
				const offsetY = this.mouseStartY - event.clientY

				this.mouseStartX = event.clientX
				this.mouseStartY = event.clientY

				this.moveCanvas(offsetX, offsetY)

				canvasUtils.setSpecialCursor(Cursor.Dragging)
			}
		})
	},

	/**
	 * Перемещение холста на указанное относительное расстояние в пикселах.
	 * @param relativeX — относительное расстояние по горизонтали.
	 * @param relativeY — относительное расстояние по вертикале.
	 */
	moveCanvas(relativeX: number, relativeY: number) {
		canvasStore.offset.x -= relativeX * canvasUtils.getScaleMultiplier()
		canvasStore.offset.y -= relativeY * canvasUtils.getScaleMultiplier()

		renderCanvas.render()
	},
}
