const volume = -15;

let synth;

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
}

function draw() {
  const dim = Math.min(width, height);

  background(0);

  const u = max(0, min(1, mouseX / width));

  const frequency = lerp(75, 2500, u);
  synth.setNote(frequency);

  if (mouseIsPressed) {
    const time = millis() / 1000;

    const verts = 1000;
    noFill();
    stroke(255);
    strokeWeight(dim * 0.005);
    beginShape();
    for (let i = 0; i < verts; i++) {
      const t = verts <= 1 ? 0.5 : i / (verts - 1);
      const x = t * width;
      let y = height / 2;

      const frequencyMod = lerp(1, 1000, pow(u, 5));
      const amplitude = sin(time + t * frequencyMod);

      y += (amplitude * height) / 2;

      vertex(x, y);
    }
    endShape();
  }

  noStroke();
  fill(255);
  polygon(width / 2, height / 2, dim * 0.1, 3);
}

function mousePressed() {
  synth.triggerAttack();
}

function mouseReleased() {
  synth.triggerRelease();
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
