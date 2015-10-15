$(function() {
	var simplemde = new SimpleMDE({
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

	load(simplemde);
	window.setInterval(function() {
		load(simplemde);
	}, 5000);

	simplemde.codemirror.on("change", function(){
	    save(simplemde.value());
	});
});

var lastSaveTimestamp = 0;
var runningTimeout;

function save(textToSave, callback) {
	lastSaveTimestamp = Date.now();

	if (runningTimeout) {
		window.clearTimeout(runningTimeout);
	}

	runningTimeout = window.setTimeout(function() {
		var timeElapsed = Date.now() - lastSaveTimestamp;

		if (timeElapsed >= 500) {
			chrome.storage.sync.set({
				newTabNotesContent: textToSave
			}, callback);
		}
	}, 500);
}

function load(simplemde) {
	var timeElapsedSinceSave = Date.now() - lastSaveTimestamp;

	if (timeElapsedSinceSave > 15000) {
		chrome.storage.sync.get("newTabNotesContent", function(result) {
			var content = result.newTabNotesContent;

			if (!content || content === "") {
				content = welcomeText;
			}

			simplemde.value(content);
		});
	}
}

var welcomeText = " \
# Welcome to New Tab Notes! \n\n\
## Keep a synced set of notes with ease! \n\
- Automatically saves when you are done typing \n\
- Syncs seamlessly \n\
- Periodically reloads if content gets stale and you haven't typed in a while\n\
- Full markdown support \n\n\
If you are unfamiliar with Markdown, check out a quick quide [here](https://guides.github.com/features/mastering-markdown/).\n\n\
"

