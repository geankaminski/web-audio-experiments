let ready = false;

let synth;

const type = "square";

const volume = -15;

let filter, effect;

const filterMin = 100;
const filterMax = 5000;

let fxU = 0.5;
let fxV = 0.5;

const notes = ["C5", "A3", "D4", "G4", "A4", "F4"];

async function setup() {
  createCanvas(windowWidth, windowHeight);

  background(0);

  Tone.Master.volume.value = volume;

  const reverb = new Tone.Reverb({
    decay: 5,
    wet: 0.5,
    preDelay: 0.2,
  });

  await reverb.generate();

  effect = new Tone.FeedbackDelay(0.4, 0.85);

  filter = new Tone.Filter();
  filter.type = "lowpass";

  synth = new Tone.Synth({
    oscillator: {
      type: `fat${type}`,
      count: 3,
      spread: 30,
    },
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0.5,
      release: 0.1,
      attackCurve: "exponential",
    },
  });

  synth.connect(effect);
  effect.connect(reverb);
  reverb.connect(filter);
  filter.connect(Tone.Master);

  ready = true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  background(0);
}

function draw() {
  if (!ready) return;

  filter.frequency.value = lerp(filterMin, filterMax, fxU);
  effect.wet.value = fxV;

  const dim = Math.min(width, height);

  background(0, 0, 0, 20);

  if (mouseIsPressed) {
    noFill();
    strokeWeight(dim * 0.0175);
    stroke(255);
    drawEffectKnob(dim * 0.4, fxU);
    drawEffectKnob(dim * 0.6, fxV);
  }

  noStroke();
  fill(255);
  polygon(width / 2, height / 2, dim * 0.1, 3);
}

function drawEffectKnob(radius, t) {
  if (t <= 0) return;
  arc(width / 2, height / 2, radius, radius, 0, PI * 2 * t);
}

function updateEffects() {
  fxU = max(0, min(1, mouseX / width));
  fxV = max(0, min(1, mouseY / height));
}

function mousePressed() {
  updateEffects();
  if (synth) synth.triggerAttack(random(notes));
}

function mouseDragged() {
  updateEffects();
}

function mouseReleased() {
  if (synth) synth.triggerRelease();
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
