export function wait<T extends () => void>(ms: number, callback: T) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(callback()), ms)
	})
}
