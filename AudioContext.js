// JavaScript source code
this.context = new AudioContext();
await this.context.audioWorklet.addModule("./js/services/tone-processor.js");
this.toneNode = new AudioWorkletNode(this.context, "tone-processor");