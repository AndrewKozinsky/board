/**
 * Получает массив где есть объекты со свойством id и находит самый высокий идентификатор.
 * @param elementsArray — массив объектов со свойством id
 */
export function getHighestElementId(elementsArray: { id: number }[]) {
	let highestId = 0

	for (let elem of elementsArray) {
		if (elem.id > highestId) {
			highestId = elem.id
		}
	}

	return highestId
}

export function getElementIdx<T extends {}>(elementsArray: T[], propName: keyof T, propValue: any) {
	return elementsArray.findIndex((element) => element[propName] === propValue)
}
