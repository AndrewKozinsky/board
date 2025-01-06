import { Container, Text } from 'pixi.js'
import { throttle } from './miscUtils.ts'
import { getStore } from '../board/store/store.ts'

// Вспомогательные функции Pixi.js
export const pixiUtils = {
	/**
	 * Поиск всех текстовых элементов
	 * @param container — контейнер, где нужно искать тестовые элементы
	 * @param result — массив с найденными текстовыми элементами
	 */
	findAllTextObjects(container: Container, result = []) {
		container.children.forEach((child) => {
			if (child instanceof Text) {
				// @ts-ignore
				result.push(child)
			}
			// If the child is a container, search its children
			if (child instanceof Container) {
				this.findAllTextObjects(child, result)
			}
		})

		return result
	},

	/**
	 * Функция перерисовывает все имеющиеся шрифты на холсте если увеличили масштаб
	 * @param scale — новый масштаб.
	 */
	rerenderFonts(scale: number) {
		if (scale <= 100) return

		const texts: any = this.findAllTextObjects(getStore.app.stage)
		const { devicePixelRatio } = getStore.canvas

		for (let i = 0; i < texts.length; i++) {
			texts[i].resolution = (scale / 100) * devicePixelRatio
		}
	},
}

// Затормозить перерисовку шрифтов чтобы это не происходило слишком часто
pixiUtils.rerenderFonts = throttle(pixiUtils.rerenderFonts, 500)
