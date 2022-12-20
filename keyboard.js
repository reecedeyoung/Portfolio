// JavaScript source code
let noteEventString = "";
let keyboardBound = false;
const noteMonitor = document.getElementById('noteMonitor');
const keyBindToggle = document.getElementById('keyBindToggle');

this.context = new AudioContext();
await this.context.audioWorklet.addModule(".tone-processor.js");

function keydownHandler(event) {
    const keyName = event.key;

    if (event.repeat) {

    } 
    else {
        let test = `${keyName}`;
        noteEventString = noteEventString.concat(test);

        //alert(`Key pressed ${keyName}`);
    }
    updateNoteMonitor();
}

function keyupHandler(event) {
    const keyName = event.key;

    if (keyName === 'Control') {
        // do not alert when only Control key is pressed.
        return;
    }

    if (event.ctrlKey) {
        // Even though event.key is not 'Control' (e.g., 'a' is pressed),
        // event.ctrlKey may be true if Ctrl key is pressed at the same time.
        //alert(`Combination of ctrlKey + ${keyName}`);
    } else {
        noteEventString = noteEventString.replace(`${keyName}`, '');
        //alert(`Key pressed ${keyName}`);
    }
    updateNoteMonitor();

}

function bindKeyboardControls() {
    if(keyboardBound) {
        keyboardBound = false;
        document.removeEventListener('keydown', keydownHandler, false);
        document.removeEventListener('keyup', keyupHandler, false);
        keyBindToggle.innerHTML = 'Bind Keyboard';
    } 
    else {
        keyboardBound = true;
        document.addEventListener('keydown', keydownHandler, false);
        document.addEventListener('keyup', keyupHandler, false);
        keyBindToggle.innerHTML = 'Release Keyboard';
    }

    return;
}

function updateNoteMonitor() {
    noteMonitor.innerHTML = 'Event Monitor: '.concat(noteEventString);
}