import { Container, Text } from 'pixi.js'
import { throttle } from '../../utils/misc.ts'
import { getStore } from '../store/store.ts'

// Вспомогательные функции Pixi.js
export const pixiHelper = {
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
	}
}

// Затормозить перерисовку шрифтов чтобы это не просходило слишком часто
pixiHelper.rerenderFonts = throttle(pixiHelper.rerenderFonts, 500)

