let synth;

let playing = false;

let sequence;

let currentColumn = 0;

const notes = ["A3", "C4", "D4", "E3", "G4"];

const numRows = notes.length;

const numCols = 16;
const noteInterval = `${numCols}n`;

Tone.Transport.bpm.value = 120;

const data = [];
for (let y = 0; y < numRows; y++) {
  const row = [];
  for (let x = 0; x < numCols; x++) {
    row.push(0);
  }
  data.push(row);
}

async function setup() {
  const dim = min(windowWidth, windowHeight);
  createCanvas(innerWidth, innerHeight);

  background(0);

  const reverb = new Tone.Reverb({
    decay: 4,
    wet: 0.2,
    preDelay: 0.25,
  });

  await reverb.generate();

  const effect = new Tone.FeedbackDelay(`${Math.floor(numCols / 2)}n`, 1 / 3);
  effect.wet.value = 0.2;

  synth = new Tone.PolySynth(numRows, Tone.DuoSynth);

  synth.set({
    voice0: {
      oscillator: {
        type: "triangle4",
      },
      volume: -30,
      envelope: {
        attack: 0.005,
        release: 0.05,
        sustain: 1,
      },
    },
    voice1: {
      volume: -10,
      envelope: {
        attack: 0.005,
        release: 0.05,
        sustain: 1,
      },
    },
  });
  synth.volume.value = -10;

  synth.connect(effect);
  synth.connect(Tone.Master);
  effect.connect(reverb);
  reverb.connect(Tone.Master);

  Tone.Transport.scheduleRepeat(() => {
    randomizeSequencer();
  }, "2m");
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}

function draw() {
  if (!synth) return;

  const dim = min(width, height);

  background(0);

  if (playing) {
    const margin = dim * 0.2;
    const innerSize = dim - margin * 2;
    const cellSize = innerSize / numCols;
    push();
    translate(innerWidth / 2 - dim / 2, innerHeight / 2 - dim / 2);
    for (let y = 0; y < data.length; y++) {
      const row = data[y];
      for (let x = 0; x < row.length; x++) {
        const u = x / (numCols - 1);
        const v = y / (numRows - 1);
        let px = lerp(margin, dim - margin, u);
        let py = lerp(margin, dim - margin, v);

        noStroke();
        noFill();

        if (row[x] === 1) fill(255);
        else stroke(255);

        circle(px, py, cellSize / 2);

        if (x === currentColumn) {
          rectMode(CENTER);
          rect(px, py, cellSize, cellSize);
        }
      }
    }
    pop();
  } else {
    noStroke();
    fill(255);
    polygon(width / 2, height / 2, dim * 0.1, 3);
  }
}

function randomizeSequencer() {
  const chance = random(0.5, 1.5);
  for (let y = 0; y < data.length; y++) {
    const row = data[y];
    for (let x = 0; x < row.length; x++) {
      row[x] = randomGaussian() > chance ? 1 : 0;
    }
    for (let x = 0; x < row.length - 1; x++) {
      if (row[x] === 1 && row[x + 1] === 1) {
        row[x + 1] = 0;
        x++;
      }
    }
  }
}

function mousePressed() {
  if (!synth) {
    return;
  }

  if (playing) {
    playing = false;
    sequence.stop();
    Tone.Transport.stop();
  } else {
    const noteIndices = newArray(numCols);
    sequence = new Tone.Sequence(onSequenceStep, noteIndices, noteInterval);

    playing = true;
    sequence.start();
    Tone.Transport.start();
  }
}

function onSequenceStep(time, column) {
  let notesToPlay = [];

  data.forEach((row, rowIndex) => {
    const isOn = row[column] == 1;
    if (isOn) {
      const note = notes[rowIndex];
      notesToPlay.push(note);
    }
  });

  const velocity = random(0.5, 1);
  synth.triggerAttackRelease(notesToPlay, noteInterval, time, velocity);
  Tone.Draw.schedule(function () {
    currentColumn = column;
  }, time);
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

function newArray(n) {
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push(i);
  }
  return array;
}
