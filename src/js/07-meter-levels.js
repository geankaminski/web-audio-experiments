let audioContext;
let audio;
let signals;

const frequencyBands = [
  { frequency: 55, color: "#D5B3E5" },
  { frequency: 110, color: "#7F3CAC" },
  { frequency: 220, color: "#22A722" },
  { frequency: 440, color: "#F1892A" },
  { frequency: 570, color: "#E84420" },
  { frequency: 960, color: "#F4CD00" },
  { frequency: 2000, color: "#3E58E2" },
  { frequency: 4000, color: "#F391C7" },
];

function mousePressed() {
  if (!audioContext) {
    audioContext = new AudioContext();

    audio = document.createElement("audio");

    audio.src = "audio/piano.mp3";

    audio.crossOrigin = "Anonymous";

    audio.loop = true;

    audio.play();

    const source = audioContext.createMediaElementSource(audio);

    source.connect(audioContext.destination);

    signals = frequencyBands.map(({ frequency, color }) => {
      const analyser = audioContext.createAnalyser();
      analyser.smoothingTimeConstant = 1;

      const data = new Float32Array(analyser.fftSize);

      const filter = audioContext.createBiquadFilter();
      filter.frequency.value = frequency;
      filter.Q.value = 1;
      filter.type = "bandpass";

      source.connect(filter);
      filter.connect(analyser);

      return {
        analyser,
        color,
        data,
        filter,
      };
    });
  } else {
    if (audio.paused) audio.play();
    else audio.pause();
  }
}

function rootMeanSquaredSignal(data) {
  let rms = 0;
  for (let i = 0; i < data.length; i++) {
    rms += data[i] * data[i];
  }
  return Math.sqrt(rms / data.length);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background("black");

  const dim = min(width, height);
  if (audioContext) {
    signals.forEach(({ analyser, data, color }, i) => {
      analyser.getFloatTimeDomainData(data);

      const signal = rootMeanSquaredSignal(data);
      const scale = 10;
      const size = dim * scale * signal;

      fill(color);
      noStroke();
      rectMode(CENTER);
      const margin = 0.2 * dim;
      const x =
        signals.length <= 1
          ? width / 2
          : map(i, 0, signals.length - 1, margin, width - margin);
      const sliceWidth = ((width - margin * 2) / (signals.length - 1)) * 0.75;
      rect(x, height / 2, sliceWidth, size);
    });
  } else {
    fill("white");
    noStroke();
    polygon(width / 2, height / 2, dim * 0.1, 3);
  }
}

function polygon(x, y, radius, sides = 3, angle = 0) {
  beginShape();
  for (let i = 0; i < sides; i++) {
    const a = angle + TWO_PI * (i / sides);
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
