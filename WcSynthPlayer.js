class WcSynthPlayer extends HTMLElement {
    static observedAttributes = [];
    #isReady;
    constructor() {
        super();
        this.bind(this);
    }
    bind(element) {
        element.attachEvents = element.attachEvents.bind(element);
        element.cacheDom = element.cacheDom.bind(element);
        element.render = element.render.bind(element);
        element.setupAudio = element.setupAudio.bind(element);
        element.play = element.play.bind(element);
        element.stop = element.stop.bind(element);
    }
    render() {
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
                <button id="play">Play</button>
            `;
    }
    async setupAudio() {
        this.context = new AudioContext();
        await this.context.audioWorklet.addModule("./js/worklet/tone-processor.js");

        this.toneNode = new AudioWorkletNode(this.context, "tone-processor");
        this.toneNode.parameters.get("sampleRate").value = this.context.sampleRate;
    }
    async connectedCallback() {
        this.render();
        this.cacheDom();
        this.attachEvents();
    }
    cacheDom() {
        this.dom = {
            play: this.shadowRoot.querySelector("#play")
        };
    }
    attachEvents() {
        this.dom.play.addEventListener("click", async () => {
            if (!this.#isReady) {
                await this.setupAudio();
                this.#isReady = true;
            }

            this.isPlaying
                ? this.stop()
                : this.play();
            this.isPlaying = !this.isPlaying;
        });
    }
    onKeydown(e) {
        switch (e.code) {
            default:
                console.log(e.which);
        }
    }
    async play() {
        this.toneNode.connect(this.context.destination);
    }
    async stop() {
        this.dom.play.textContent = "Play";
        this.toneNode.disconnect(this.context.destination);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
    }
}

customElements.define("synth-player", WcSynthPlayer);
