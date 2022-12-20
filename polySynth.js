
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function checkAmpAtk() { return document.getElementById('ampAtk').value }
function checkAmpDcy() { return document.getElementById('ampDcy').value }
function checkAmpSus() { return document.getElementById('ampSus').value }
function checkAmpRel() { return document.getElementById('ampRel').value }
function checkFltAtk() { return document.getElementById('fltAtk').value }
function checkFltDcy() { return document.getElementById('fltDcy').value }
function checkFltSus() { return document.getElementById('fltSus').value }
function checkFltRel() { return document.getElementById('fltRel').value }
function checkFltEnvDepth() { return 3; }
function checkFltCutoff() { return 0; }
function checkFltKeyTrack() { return 127; }


const getElementByNote = (note) =>
  note && document.querySelector(`[note="${note}"]`);

const keys = {
  A: { element: getElementByNote("C"), note: "C", octaveOffset: 0 },
  W: { element: getElementByNote("C#"), note: "C#", octaveOffset: 0 },
  S: { element: getElementByNote("D"), note: "D", octaveOffset: 0 },
  E: { element: getElementByNote("D#"), note: "D#", octaveOffset: 0 },
  D: { element: getElementByNote("E"), note: "E", octaveOffset: 0 },
  F: { element: getElementByNote("F"), note: "F", octaveOffset: 0 },
  T: { element: getElementByNote("F#"), note: "F#", octaveOffset: 0 },
  G: { element: getElementByNote("G"), note: "G", octaveOffset: 0 },
  Y: { element: getElementByNote("G#"), note: "G#", octaveOffset: 0 },
  H: { element: getElementByNote("A"), note: "A", octaveOffset: 1 },
  U: { element: getElementByNote("A#"), note: "A#", octaveOffset: 1 },
  J: { element: getElementByNote("B"), note: "B", octaveOffset: 1 },
  K: { element: getElementByNote("C2"), note: "C", octaveOffset: 1 },
  O: { element: getElementByNote("C#2"), note: "C#", octaveOffset: 1 },
  L: { element: getElementByNote("D2"), note: "D", octaveOffset: 1 },
  P: { element: getElementByNote("D#2"), note: "D#", octaveOffset: 1 },
  semicolon: { element: getElementByNote("E2"), note: "E", octaveOffset: 1 }
};

const getHz = (note = "A", octave = 4) => {
  const A4 = 440;
  let N = 0;
  switch (note) {
    default:
    case "A":
      N = 0;
      break;
    case "A#":
    case "Bb":
      N = 1;
      break;
    case "B":
      N = 2;
      break;
    case "C":
      N = 3;
      break;
    case "C#":
    case "Db":
      N = 4;
      break;
    case "D":
      N = 5;
      break;
    case "D#":
    case "Eb":
      N = 6;
      break;
    case "E":
      N = 7;
      break;
    case "F":
      N = 8;
      break;
    case "F#":
    case "Gb":
      N = 9;
      break;
    case "G":
      N = 10;
      break;
    case "G#":
    case "Ab":
      N = 11;
      break;
  }
  N += 12 * (octave - 4);
  return A4 * Math.pow(2, N / 12);
};

class Voice {
    
  timeMin = 0;
  timeMax = 10;

    constructor(audioContext, key) {
        this.audioContext = audioContext;
        this.zeroGain = 0.00001;
        this.maxGain = 0.1;
        this.sustainedGain = 0.05;
        this.key = key;
        this.osc = audioContext.createOscillator();
        this.filter = audioContext.createBiquadFilter();
        this.vca = audioContext.createGain();   
        this.vca.gain.value = this.zeroGain;

        //TODO: reconnect filter
        this.vca.connect(audioContext.destination);
        this.osc.connect(this.filter);
        this.filter.connect(this.vca);
        this.osc.type = 'sawtooth';
        this.filter.type = 'lowpass';

        if (Number.isFinite(this.#freq())) {
            this.osc.frequency.value = this.#freq();
          }

        this.setGainADS();
        this.setFilterADS();
        this.osc.start();

    }

    #timeScale = (precent) => {
      return (this.timeMax-this.timeMin)*(precent/127) + this.timeMin;
    }

    #gainScale = (precent) => {
      return (this.maxGain-this.zeroGain)*(precent/127) + this.zeroGain;
    }

    #freq = () => getHz(keys[this.key].note, (keys[this.key].octaveOffset || 0) + 3);

    setGainADS = () => {
      let attackEnd = this.audioContext.currentTime + this.#timeScale(checkAmpAtk());
      this.vca.gain.linearRampToValueAtTime(
        this.maxGain,
        attackEnd
      );
      this.vca.gain.exponentialRampToValueAtTime(
        this.#gainScale(checkAmpSus()),
        attackEnd + this.#timeScale(checkAmpDcy())
      );
    }
    setRelease = () => {
      this.vca.gain.cancelAndHoldAtTime(this.audioContext.currentTime);
      this.vca.gain.exponentialRampToValueAtTime(
        this.zeroGain,
        this.audioContext.currentTime + this.#timeScale(checkAmpRel())
      ); 

      /*setTimeout(() => {
        this.osc.stop();
      }, time*1000);*/
    }
    setFilterADS = () => {
      let attackEnd = this.audioContext.currentTime + this.#timeScale(checkFltAtk());
      this.filter.frequency.exponentialRampToValueAtTime(
        this.#freq()*(checkFltKeyTrack()/127) + this.#freq()*checkFltEnvDepth(),
        attackEnd
      );
      this.filter.frequency.exponentialRampToValueAtTime(
        this.#freq()*(checkFltKeyTrack()/127) + this.#freq()*checkFltEnvDepth() * (checkFltSus()/127),
        attackEnd + this.#timeScale(checkFltDcy())
      );
    }   
    setFilterRelease = () => {
      this.filter.frequency.cancelAndHoldAtTime(this.audioContext.currentTime); 
      this.filter.frequency.exponentialRampToValueAtTime(
        checkFltKeyTrack()/127,
        this.audioContext.currentTime + this.#timeScale(checkFltRel())
      );
    }
  
}

const pressedNotes = new Map();
let clickedKey = "";

const playKey = (key) => {
  if (!keys[key]) {
    return;
  }
  let test = keys["H"];
  const voice = new Voice(audioContext, key);



  //voice.setFilterAttack(checkFltAtk());
  //voice.setFilterDecay(checkAmpDcy());

  keys[key].element.classList.add("pressed");
  pressedNotes.set(key, voice);
};

const stopKey = (key) => {

  if (!keys[key]) {
    return;
  }

  keys[key].element.classList.remove("pressed");
  const voice = pressedNotes.get(key);
  voice.setRelease();
  voice.setFilterRelease();
  //voice.setFilterRelease(releaseTime);

  pressedNotes.delete(key);
};

document.addEventListener("keydown", (e) => {
  const eventKey = e.key.toUpperCase();
  const key = eventKey === ";" ? "semicolon" : eventKey;
  
  if (!key || pressedNotes.get(key)) {
    return;
  }
  playKey(key);
});

document.addEventListener("keyup", (e) => {
  const eventKey = e.key.toUpperCase();
  const key = eventKey === ";" ? "semicolon" : eventKey;
  
  if (!key) {
    return;
  }
  stopKey(key);
});

for (const [key, { element }] of Object.entries(keys)) {
  element.addEventListener("mousedown", () => {
    playKey(key);
    clickedKey = key;
  });
}

document.addEventListener("mouseup", () => {
  stopKey(clickedKey);
});