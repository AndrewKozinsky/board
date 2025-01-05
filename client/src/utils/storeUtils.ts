type UseStore = { getState: () => any; setState: (...args: any[]) => any }

export function createUpdateStoreProxy<T extends Record<string, any>>(
	store: T,
	useStore: UseStore,
	path: string[] = []
) {
	return new Proxy(store, {
		get(obj, prop: string) {
			const newPath: string[] = [...path, prop]

			let value = useStore.getState()
			for (const keyName of newPath) {
				value = value[keyName]
			}

			// If the value is an object, wrap it in a proxy to track deeper access
			if (value && typeof value === 'object') {
				return createUpdateStoreProxy(value, useStore, newPath)
			}

			return value
		},
		set(obj, prop, value) {
			const newPath = [...path, prop]
			const rootKey = newPath[0]

			const storeClone = { ...useStore.getState(), }
			let link = storeClone

			for (let i = 0; i < newPath.length; i++) {
				const keyName = newPath[i]

				// Если это последний элемент
				if (i + 1 === newPath.length) {
					link[keyName] = value
					break
				}

				link[keyName] = { ...link[keyName], }
				link = link[keyName]
			}

			useStore.setState({ [rootKey]: storeClone[rootKey], })

			return true
		},
	})
}

export function createGetStoreProxy<T>(useStore: UseStore): T {
	return new Proxy(useStore.getState(), {
		get(target, key: string) {
			return useStore.getState()[key]
		},
	})
}
