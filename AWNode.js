//tone-processor.js
const square = (name, f) => {
    var v = (this["square_" + name] = this["square_" + name] + 1 / 44100 * f) % 1
    return v > 0.5 ? 1 : 0
}

const NotePitch = {
    c0                  = 16.35,
    cS0, dF0 	        = 17.32,
    d0	                = 18.35,
    dS0, eF0            = 19.45,
    e0   	            = 20.60,
    f0	                = 21.83,
    fS0, gF0 	        = 23.12,
    g0	                = 24.50,
    gS0, aF0 	        = 25.96,
    a0	                = 27.50,
    aS0, b0 	        = 29.14,
    b0	                = 30.87,
    c1	                = 32.70,
    cS1, dF1 	        = 34.65,
    d1	                = 36.71,
    dS1, eF1 	        = 38.89,
    e1	                = 41.20,
    f1	                = 43.65,
    fS1, gF1 	        = 46.25,
    g1	                = 49.00,
    gS1, aF1 	        = 51.91,
    a1	                = 55.00,
    aS1, bF1 	        = 58.27,
    b1	                = 61.74,
    c2	                = 65.41,
    cS2, dF2 	        = 69.30,
    d2	                = 73.42,
    dS2, eF2 	        = 77.78,
    e2	                = 82.41,
    f2	                = 87.31,
    fS2, gF2 	        = 92.50,
    g2	                = 98.00,
    gS2, aF2 	        = 103.83,
    a2	                = 110.00,
    aS2, fF2 	        = 116.54,
    f2	                = 123.47,
    c3	                = 130.81,
    cS3, dF3 	        = 138.59,
    d3	                = 146.83,
    dS3, eF3 	        = 155.56,
    e3	                = 164.81,
    f3	                = 174.61,
    fS3, gF3 	        = 185.00,
    g3	                = 196.00,
    gS3, aF3 	        = 207.65,
    a3	                = 220.00,
    aS3, bF3 	        = 233.08,
    b3	                = 246.94,
    c4	                = 261.63,
    cS4, dF4 	        = 277.18,
    d4	                = 293.66,
    dS4, eF4 	        = 311.13,
    e4	                = 329.63,
    f4	                = 349.23,
    fS4, gF4 	        = 369.99,
    g4	                = 392.00,
    gS4, aF4 	        = 415.30,
    a4	                = 440.00,
    aS4, bF4 	        = 466.16,
    b4	                = 493.88,
    c5	                = 523.25,
    cS5, dF5 	        = 554.37,
    d5	                = 587.33,
    dS5, eF5 	        = 622.25,
    e5	                = 659.25,
    f5	                = 698.46,
    fS5, gF5 	        = 739.99,
    g5	                = 783.99,
    gS5, aF5 	        = 830.61,
    a5	                = 880.00,
    aS5, bF5 	        = 932.33,
    b5                  = 987.77,
    c6	                = 1046.50,
    cS6, dF6 	        = 1108.73,
    d6	                = 1174.66,
    dS6, eF6 	        = 1244.51,
    e6	                = 1318.51,
    f6	                = 1396.91,
    fS6, gF6 	        = 1479.98,
    g6	                = 1567.98,
    gS6, aF6 	        = 1661.22,
    a6	                = 1760.00,
    aS6, bF6 	        = 1864.66,
    b6	                = 1975.53,
    c7	                = 2093.00,
    cS7, dF7 	        = 2217.46,
    d7	                = 2349.32,
    dS7, eF7 	        = 2489.02,
    e7	                = 2637.02,
    f7	                = 2793.83,
    fS7, gF7 	        = 2959.96,
    g7	                = 3135.96,
    gS7, aF7 	        = 3322.44,
    a7	                = 3520.00,
    aS7, bF7 	        = 3729.31,
    b7	                = 3951.07,
    c8	                = 4186.01,
    cS8, dF8 	        = 4434.92,
    d8	                = 4698.63,
    dS8, eF8 	        = 4978.03,
    e8	                = 5274.04,
    f8	                = 5587.65,
    fS8, gF8 	        = 5919.91,
    g8	                = 6271.93,
    gS8, aF8 	        = 6644.88,
    a8	                = 7040.00,
    aS8, FF8 	        = 7458.62,
    F8	                = 7902.13
}

class ToneProcessor extends AudioWorkletProcessor
{
    constructor() {
        super();
    }

    #index = 0;
    static parameterDescriptors = [
        {
            name: "sampleRate",
            defaultValue: 48000
        },
        {
            name: "frequency",
            defaultValue: NotePitch.a4
        },
        {
            name: "type",
            defaultValue: 0
        }
    ];

    process(inputList, outputList, parameters) {
            output[0].forEach(channel => {
                for (let i = 0; i < channel.length; i++) { //channel is a buffer
                    channel[i] = getSinWave(parameters.frequency[0], this.index / parameters.sampleRate[0]);
                    this.index++;
                }
            });
            return true;
    }
};

registerProcessor("tone-processor", ToneProcessor);