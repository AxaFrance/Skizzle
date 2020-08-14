export const addItem = (key: string, value: any): void => {
	if (typeof value === 'string') {
		localStorage.setItem(key, value);
	} else {
		localStorage.setItem(key, JSON.stringify(value));
	}
};

export const removeItem = (key: string): void => localStorage.removeItem(key);

export const removeItems = (keys: string[]): void =>
	keys.forEach(key => removeItem(key));

export const removeValueFromKey = (key: string, value: any) => {
	let exist = getItem(key);

	if (Array.isArray(exist) && exist.length <= 1) {
		removeItem(key);
	}

	if (exist && Array.isArray(exist)) {
		addItem(key, [...exist.filter(x => x !== value)]);
	}
};

export const updateItem = (key: string, value: any): void => {
	let exist = getItem(key);

	if (exist && Array.isArray(exist)) {
		if (!existValue(exist, value)) {
			exist = [...exist, value];
			addItem(key, exist);
		}
	} else {
		addItem(key, [value]);
	}
};

export const updateSubItem = (
	key: string,
	subKey: string,
	value: any,
): void => {
	let exist = getItem(key);

	if (exist && Array.isArray(exist)) {
		const finded = exist.find(x => x[subKey]);

		if (finded) {
			exist.forEach(x => {
				if (x[subKey]) {
					x[subKey] = value;
				}
			});
		} else {
			exist.push({ [subKey]: value });
		}

		addItem(key, exist);
	} else {
		addItem(key, [{ [subKey]: value }]);
	}
};

export const getItem = (key: string): any => {
	let object = localStorage.getItem(key) || '';

	let value = object;

	try {
		return JSON.parse(value);
	} catch {}

	return value;
};

export const existValue = (items: any[], value: any) =>
	!!items && items.some(x => x === value);
