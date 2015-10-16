var simplemde;
var datastore;
var NEW_TAB_NOTES_KEY = "newTabNotesContent";

$(function() {
	simplemde = new SimpleMDE({
		autoDownloadFontAwesome: false,
		indentWithTabs: false,
		lineWrapping: false,
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

	var datastore = new ThrottledDataStore(saveFunc, loadFunc, 500, 10000);

	var loadOp = function() {
		datastore.load(NEW_TAB_NOTES_KEY).done(function(content) {
			simplemde.value(content)
		});
	};
	loadOp(NEW_TAB_NOTES_KEY);

	window.setInterval(function() {
		loadOp(NEW_TAB_NOTES_KEY);
	}, 5000);

	simplemde.codemirror.on("change", function(){
	    datastore.save(simplemde.value());
	});
});

// var lastSaveTimestamp = 0;
// var runningTimeout;

// function save(textToSave, callback) {
// 	lastSaveTimestamp = Date.now();

// 	if (runningTimeout) {
// 		window.clearTimeout(runningTimeout);
// 	}

// 	runningTimeout = window.setTimeout(function() {
// 		var timeElapsed = Date.now() - lastSaveTimestamp;

// 		if (timeElapsed >= 500) {
// 			chrome.storage.sync.set({
// 				newTabNotesContent: textToSave
// 			}, callback);
// 		}
// 	}, 500);
// }

// function load(callback) {
// 	var timeElapsedSinceSave = Date.now() - lastSaveTimestamp;

// 	if (timeElapsedSinceSave > 15000) {
// 		chrome.storage.sync.get("newTabNotesContent", function(result) {
// 			var content = result.newTabNotesContent;

// 			if (!content || content === "") {
// 				content = welcomeText;
// 			}

// 			callback(content);
// 		});
// 	}
// }

var welcomeText = " \
# Welcome to New Tab Notes! \n\n\
## Keep a synced set of notes with ease! \n\
- Automatically saves when you are done typing \n\
- Syncs seamlessly \n\
- Periodically reloads if content gets stale and you haven't typed in a while\n\
- Full markdown support \n\n\
If you are unfamiliar with Markdown, check out a quick quide [here](https://guides.github.com/features/mastering-markdown/).\n\n\
"

