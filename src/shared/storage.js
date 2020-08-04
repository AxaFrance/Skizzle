export const addItem = (key, value) => {
	if (typeof value === 'string') {
		localStorage.setItem(key, value);
	} else {
		localStorage.setItem(key, JSON.stringify(value));
	}
};

export const removeItem = key => localStorage.removeItem(key);

export const removeItems = keys => keys.map(key => removeItem(key));

export const removeValueFromKey = (key, value) => {
	let exist = getItem(key);

	if (Array.isArray(exist) && exist.length <= 1) {
		removeItem(key);
	}

	if (exist && Array.isArray(exist)) {
		addItem(key, [...exist.filter(x => x !== value)]);
	}
};

export const updateItem = (key, value) => {
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

export const updateSubItem = (key, subKey, value) => {
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

export const getItem = key => {
	let object = localStorage.getItem(key);

	let value = object;
	try {
		value = JSON.parse(object);
	} catch {}

	return value;
};

export const existValue = (items, value) =>
	!!items && items.some(x => x === value);
