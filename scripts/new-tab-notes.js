var simplemde;
var datastore;
var NEW_TAB_NOTES_KEY = "newTabNotesContent";
var NEW_TAB_NOTES_SIZE_KEY = "newTabNotesSize";

$(function() {
	simplemde = new SimpleMDE({
		autoDownloadFontAwesome: false,
		indentWithTabs: false,
		lineWrapping: true,
		spellChecker: false,
		initialValue: "Loading...",
		parsingConfig: {
			allowAtxHeaderWithoutSpace: true
		},
		status: false
	});

	var saveFunc = function(key, content, callback) {
		var obj = {};
		obj[key] = content;

		chrome.storage.sync.set(obj, callback);
	};

	var loadFunc = function(key, callback) {
		chrome.storage.sync.get(key, function(result) {
			var content = result[key];

			if (!content || content === "") {
				content = welcomeText;
			}

			callback(content);
		});
	};

	var throttler = new Throttler(500, saveFunc);

	var throttledSaveFunc = function(key, content, callback) {
		return throttler.execute(key, content, callback);
	};

	var datastore = new Datastore(throttledSaveFunc, loadFunc);

	var reloadContents = function() {
		datastore.load(NEW_TAB_NOTES_KEY).done(function(content) {
			simplemde.value(content);

			datastore.load(NEW_TAB_NOTES_SIZE_KEY).done(function(size) {
				document.querySelector('body').setAttribute('class', size);
			});
		});
	};

	var initTextSizingOptions = function() {
		var separate = document.createElement('i');
		separate.setAttribute('class', 'separator');
		separate.textContent = '|';

		var smallerTextElement = document.createElement('a');
		smallerTextElement.textContent = "A";
		smallerTextElement.title = 'Make text smaller';
		smallerTextElement.setAttribute('style', 'font-size: 8px; line-height: 30px;');
		smallerTextElement.addEventListener('click', () => {
			document.querySelector('body').setAttribute('class', 'smaller');
			datastore.save(NEW_TAB_NOTES_SIZE_KEY, 'smaller');
		});

		var normalTextElement = document.createElement('a');
		normalTextElement.textContent = "A";
		normalTextElement.title = 'Make text normal';
		normalTextElement.setAttribute('style', 'font-size: 12px; line-height: 30px;');
		normalTextElement.addEventListener('click', () => {
			document.querySelector('body').setAttribute('class', 'normal');
			datastore.save(NEW_TAB_NOTES_SIZE_KEY, 'normal');
		});

		var biggerTextElement = document.createElement('a');
		biggerTextElement.textContent = "A";
		biggerTextElement.title = 'Make text bigger';
		biggerTextElement.setAttribute('style', 'font-size: 16px; line-height: 30px;');
		biggerTextElement.addEventListener('click', () => {
			document.querySelector('body').setAttribute('class', 'bigger');
			datastore.save(NEW_TAB_NOTES_SIZE_KEY, 'bigger');
		});

		document.querySelector('.editor-toolbar').appendChild(separate);
		document.querySelector('.editor-toolbar').appendChild(smallerTextElement);
		document.querySelector('.editor-toolbar').appendChild(normalTextElement);
		document.querySelector('.editor-toolbar').appendChild(biggerTextElement);
	}

	initTextSizingOptions();
	reloadContents();

	simplemde.codemirror.on("change", function(){
	    datastore.save(NEW_TAB_NOTES_KEY, simplemde.value());
	});

	var runningInterval;

	simplemde.codemirror.on("focus", function() {
		if (runningInterval) {
			window.clearInterval(runningInterval);
		}
	});

	simplemde.codemirror.on("blur", function() {
		if (runningInterval) {
			window.clearInterval(runningInterval);
		}

		runningInterval = window.setInterval(function() {
			reloadContents();
		}, 2500);
	});
});

var welcomeText = "" +
	"# Welcome to New Tab Notes! \n" +
	"## Keep a synced set of notes with ease \n\n" +
	"- Automatically saves when you are done typing\n" +
	"- Syncs seamlessly\n" +
	"- Periodically reloads if content gets stale and you haven't typed in a while\n" +
	"- Full markdown support\n\n" +
	"If you are unfamiliar with Markdown, check out a quick quide [here](https://guides.github.com/features/mastering-markdown/).\n\n";
