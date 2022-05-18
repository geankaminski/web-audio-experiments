const volume = -16;

const MP3 = "audio/piano.mp3";

let player;

let autoFilter;

async function setup() {
  createCanvas(windowWidth, windowHeight);

  Tone.Master.volume.value = volume;

  player = new Tone.Player();
  player.loop = true;
  player.autostart = false;
  player.loopStart = 1.0;

  await player.load(MP3);

  autoFilter = new Tone.AutoFilter("8n");
  autoFilter.start();

  player.connect(autoFilter);
  autoFilter.connect(Tone.Master);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  if (!player || !player.loaded) {
    return;
  }
  const dim = Math.min(width, height);

  background(0);

  autoFilter.wet.value = mouseY / height;
  autoFilter.frequency.value = map(mouseX, 0, width, 0.5, 1.5);

  if (player.state === "started") {
    noStroke();
    fill(255);
    polygon(width / 2, height / 2, dim * 0.1, 4, PI / 4);

    stroke("tomato");
    noFill();
    strokeWeight(dim * 0.0175);
    circle(mouseX, mouseY, dim * 0.2);
  } else {
    noStroke();
    fill(255);
    polygon(width / 2, height / 2, dim * 0.1, 3);
  }
}

function mousePressed() {
  if (player && player.loaded) {
    if (player.state === "started") {
      player.stop();
    } else {
      player.start();
    }
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
