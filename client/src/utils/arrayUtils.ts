export const arrUtils = {
	/**
	 * Получает массив, где есть объекты со свойством id и находит самый высокий идентификатор.
	 * @param elementsArray — массив объектов со свойством id
	 */
	getHighestItemId(elementsArray: { id: number }[]) {
		let highestId = 0

		for (let elem of elementsArray) {
			if (elem.id > highestId) {
				highestId = elem.id
			}
		}

		return highestId
	},

	/**
	 * Возвращает индекс элемента массива ищя по названию и значению свойства
	 * @param array — массив элементов
	 * @param propValue — значение свойства
	 * @param propName — значение свойства
	 */
	getItemIdxByPropNameAndValue<T extends {}, K extends keyof T>(array: T[], propName: K, propValue: T[K]) {
		return array.findIndex((element) => element[propName] === propValue)
	},

	/**
	 * Ищет элемент по названию и значению свойства
	 * @param array — массив элементов
	 * @param propValue — значение свойства
	 * @param propName — значение свойства
	 */
	getItemByPropNameAndValue<T extends {}, K extends keyof T>(array: T[], propName: K, propValue: T[K]) {
		return array.find((element) => element[propName] === propValue)
	},
}
