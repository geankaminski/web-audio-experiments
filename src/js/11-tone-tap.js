const volume = -2;

let synth;

let mouse;

function setup() {
  createCanvas(windowWidth, windowHeight);

  background(0);

  Tone.Master.volume.value = volume;

  synth = new Tone.Synth({
    oscillator: {
      type: "sine",
    },
  });

  synth.connect(Tone.Master);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  background(0);
}

function draw() {
  const dim = Math.min(width, height);

  const opacity = 0.085;
  background(0, 0, 0, opacity * 255);

  if (mouse) {
    noFill();
    stroke(255);
    strokeWeight(dim * 0.01);
    circle(mouse[0], mouse[1], dim * 0.2);

    mouse = null;
  }

  noStroke();
  fill(255);
  polygon(width / 2, height / 2, dim * 0.1, 3);
}

function mousePressed() {
  mouse = [mouseX, mouseY];

  const notes = ["C", "Db", "F", "Gb", "Bb"];
  const octaves = [2, 3, 4];
  const octave = random(octaves);
  const note = random(notes);
  synth.triggerAttackRelease(note + octave, "8n");
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
