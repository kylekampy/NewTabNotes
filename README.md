# New Tab Notes

Keep a synced set of notes with ease! 
- Automatically saves when you are done typing 
- Syncs seamlessly 
- Periodically reloads if content gets stale and you haven't typed in a while
- Full markdown support 

If you are unfamiliar with Markdown, check out a quick quide here: https://guides.github.com/features/mastering-markdown/

Uses SimpleMDE as the editor: http://nextstepwebs.github.io/simplemde-markdown-editor/
Icon provided as part of Open Iconic: http://www.useiconic.com/open

## Running locally
```
git clone https://github.com/kkamperschroer/NewTabNotes.git
cd NewTabNotes
```

To load an unpacked Chrome extension, go to [chrome://extensions](chrome://extensions) and check the "Developer mode" checkbox. Then click "Load unpacked extension..." and point to your local dir.

## Building for release
```
npm install
grunt
```
Note: May be necessary to do `npm install -g grunt-cli`

## Contributions
Yes please! Please open a pull request or an issue!
