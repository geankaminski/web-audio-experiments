let audioContext;
let audioBuffer;

function mousePressed() {
  playSound();
}

async function loadSound() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (!audioBuffer) {
    const resp = await fetch("audio/chime.mp3");
    const buf = await resp.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(buf);
  }
}

async function playSound() {
  await loadSound();

  await audioContext.resume();

  const source = audioContext.createBufferSource();

  source.connect(audioContext.destination);
  source.buffer = audioBuffer;
  source.start(0);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background("black");

  fill("white");
  noStroke();

  const dim = min(width, height);
  if (mouseIsPressed) {
    circle(width / 2, height / 2, dim * 0.1);
  } else {
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
