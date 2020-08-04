const path = require('path');
const electron = require('electron');
const fs = require('fs');

let loadedLanguage;
let app = electron.app ? electron.app : electron.remote.app;
let currentLanguage;

function init() {
	console.log(process);

	const directory = './assets/langs/';

	if (
		fs.existsSync(path.join(__dirname, directory, app.getLocale() + '.json'))
	) {
		loadedLanguage = JSON.parse(
			fs.readFileSync(
				path.join(__dirname, directory, app.getLocale() + '.json'),
				'utf8',
			),
		);

		currentLanguage = app.getLocale();
	} else {
		loadedLanguage = JSON.parse(
			fs.readFileSync(path.join(__dirname, directory, 'en.json'), 'utf8'),
		);

		currentLanguage = 'en';
	}
}

app.on('ready', () => init);

function translate(word, ...format) {
	if (!loadedLanguage) {
		init();
	}

	let translation = loadedLanguage[word];

	if (translation === undefined) {
		translation = word;
	}

	if (translation && format) {
		for (let i = 0; i < format.length + 1; i++) {
			translation = translation.replace('$' + i, format[i]);
		}
	}

	return translation;
}

function updateLanguage(lang) {
	loadedLanguage = JSON.parse(
		fs.readFileSync(
			path.join(__dirname, './assets/langs/', lang + '.json'),
			'utf8',
		),
	);

	console.log(process);

	if (!currentLanguage) {
		currentLanguage = lang;
	}

	if (currentLanguage !== lang) {
		currentLanguage = lang;
		console.log({
			values: [...process.argv.slice(1), '--skizzle-language=' + lang],
		});
		const { getCurrentWindow } = electron.remote;

		let window = getCurrentWindow();

		if (window) {
			window.reload();
		}

		//TODO: restart application for apply lang settings to electron with args parametters
		//app.relaunch({ args: [...process.argv.slice(1), '--skizzle-language='+lang] });
		//setTimeout(() => { app.quit() }, 3000 )
	}
}

module.exports = {
	updateLanguage,
	translate,
};
