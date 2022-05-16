let audioContext;
let audio;
let signalData;
let analyserNode;

function mousePressed() {
  if (!audioContext) {
    audioContext = new AudioContext();

    audio = document.createElement("audio");

    audio.src = "audio/piano.mp3";

    audio.crossOrigin = "Anonymous";

    audio.loop = true;

    audio.play();

    const source = audioContext.createMediaElementSource(audio);

    analyserNode = audioContext.createAnalyser();
    analyserNode.smoothingTimeConstant = 1;

    signalData = new Float32Array(analyserNode.fftSize);

    source.connect(audioContext.destination);

    source.connect(analyserNode);
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
    analyserNode.getFloatTimeDomainData(signalData);

    const signal = rootMeanSquaredSignal(signalData);
    const scale = 10;
    const size = dim * scale * signal;

    stroke("white");
    noFill();
    strokeWeight(dim * 0.0075);
    circle(width / 2, height / 2, size);
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
