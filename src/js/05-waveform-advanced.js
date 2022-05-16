let audioContext;
let analyserNode;
let analyserData;
let gainNode;
let audio;
let isFloat = false;
let interval;

function mousePressed() {
  if (!audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();

    // If the user inserts/removes bluetooth headphones or pushes
    // the play/pause media keys, we can use the following to ignore the action
    // navigator.mediaSession.setActionHandler("pause", () => {});

    audio = document.createElement("audio");

    audio.addEventListener(
      "canplay",
      () => {
        audioContext.resume();
        audio.play();
      },
      { once: true }
    );

    audio.loop = true;

    audio.crossOrigin = "Anonymous";
    audio.src = "audio/piano.mp3";

    const source = audioContext.createMediaElementSource(audio);
    source.connect(audioContext.destination);

    analyserNode = audioContext.createAnalyser();

    const detail = 4;
    analyserNode.fftSize = 2048 * detail;

    isFloat = Boolean(analyserNode.getFloatTimeDomainData);
    analyserData = new Float32Array(analyserNode.fftSize);
    if (isFloat) {
      analyserTarget = new Float32Array(analyserData.length);
    } else {
      analyserTarget = new Uint8Array(analyserData.length);
      analyserTarget.fill(0xff / 2);
    }

    source.connect(analyserNode);

    const fps = 12;
    interval = setInterval(() => {
      if (isFloat) {
        analyserNode.getFloatTimeDomainData(analyserTarget);
      } else {
        analyserNode.getByteTimeDomainData(analyserTarget);
      }
    }, (1 / fps) * 1000);
  } else {
    audio.pause();
    audioContext.close();
    clearInterval(interval);
    audioContext = analyserNode = null;
  }
}

function damp(a, b, lambda, dt) {
  return lerp(a, b, 1 - Math.exp(-lambda * dt));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0, 0, 0);

  fill("white");
  noStroke();
  if (analyserNode) {
    for (let i = 0; i < analyserData.length; i++) {
      analyserData[i] = damp(
        analyserData[i],
        isFloat ? analyserTarget[i] : (analyserTarget[i] / 256) * 2 - 1,
        0.01,
        deltaTime
      );
    }

    noFill();
    stroke("white");

    beginShape();
    const margin = 0.1;

    for (let i = 0; i < analyserData.length; i++) {
      const x = map(
        i,
        0,
        analyserData.length,
        width * margin,
        width * (1 - margin)
      );

      const signal = analyserData[i];

      const amplitude = height * 4;

      const y = map(
        signal,
        -1,
        1,
        height / 2 - amplitude / 2,
        height / 2 + amplitude / 2
      );

      vertex(x, y);
    }

    endShape();
  } else {
    const dim = min(width, height);
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
