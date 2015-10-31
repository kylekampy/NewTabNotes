var simplemde;
var datastore;
var NEW_TAB_NOTES_KEY = "newTabNotesContent";

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
		});
	};

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
	"# Welcome to New Tab Notes! " +
	"## Keep a synced set of notes with ease" +
	"- Automatically saves when you are done typin" +
	"- Syncs seamlessl" +
	"- Periodically reloads if content gets stale and you haven't typed in a whi" +
	"- Full markdown support " +
	"If you are unfamiliar with Markdown, check out a quick quide [here](https://guides.github.com/features/mastering-markdown/).";
