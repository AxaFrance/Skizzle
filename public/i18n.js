const path = require('path');
const electron = require('electron');
const fs = require('fs');

let loadedLanguage;
let app = electron.app ? electron.app : electron.remote.app;

function init() {
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
	} else {
		loadedLanguage = JSON.parse(
			fs.readFileSync(path.join(__dirname, directory, 'en.json'), 'utf8'),
		);
	}
}

app.on('ready', init);

function translate(word, ...format) {
	if (!loadedLanguage) {
		init();
	}

	let translation = loadedLanguage[word];
	if (translation === undefined) {
		translation = word;
	}

	if (format) {
		for (let i = 0; i < format.length + 1; i++) {
			translation = translation.replace('$' + i, format[i]);
		}
	}

	return translation;
}

module.exports.translate = translate;
