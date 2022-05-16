let audioContext;
let audio;
let gainNode;

function mousePressed() {
  if (!audioContext) {
    audioContext = new AudioContext();

    audio = document.createElement("audio");

    audio.src = "audio/piano.mp3";

    audio.crossOrigin = "Anonymous";

    audio.loop = true;

    audio.play();

    const source = audioContext.createMediaElementSource(audio);

    gainNode = audioContext.createGain();

    source.connect(gainNode);

    gainNode.connect(audioContext.destination);
  } else {
    audio.pause();
    audioContext.close();
    audioContext = audio = null;
  }
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
  if (audioContext) {
    const volume = abs(mouseX - width / 2) / (width / 2);
    gainNode.gain.setTargetAtTime(volume, audioContext.currentTime, 0.01);
    rectMode(CENTER);
    rect(width / 2, height / 2, dim * volume, dim * 0.05);
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
