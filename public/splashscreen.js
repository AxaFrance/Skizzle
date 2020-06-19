function update() {
	var ipcRenderer = require('electron').ipcRenderer;
	const label = document.getElementsByClassName('skz-splashscreen__label')[0];
	const download = document.getElementsByClassName('skz-splashscreen__info')[0];
	const div = document.getElementsByClassName('skz-splashscreen__progress')[0];

	let width = updateWidth(0);

	ipcRenderer.on('message', (event, args) => {
		const { text, data } = args;

		label.innerHTML = text;

		if (data) {
			const percent = Math.floor(data.percent);

			updateWidth(percent);
		}
	});
}

function updateWidth(value) {
	let width = value < 0 ? 0 : value > 100 ? 100 : value;

	const bar = document.getElementsByClassName(
		'skz-splashscreen__progress--bar',
	)[0];

	bar.style.width = `${width}%`;

	return width;
}

update();
