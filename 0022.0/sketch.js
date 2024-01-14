let particles1 = [];
let particles2 = [];
const num = 10000;
const scaleFactor = 0.01;
const speed = 1.2;
const weightMax = 10;

let fps;

function setup() {
  frameRate(30)
  createCanvas(540, 540);
  stroke(255);
  for (let i = 0; i < num; i++) {
    let ran = floor(random(2));
    let particle = {
      x: random(width),
      y: random(height),
      strokeWeight: random(0.1, ran === 1 ? weightMax : weightMax / 4),
      strokeWeightScale: 0,
      color: ran === 1 ? [0,100] : [255],
    };
    particles1.push(particle);
  }
  background(100);
  // blendMode(SCREEN)

  fps = document.getElementById("framerate");
}

function draw() {
  fps.innerHTML = frameRate();
  // clear()
  background(222, 10);
  for (let i = 0; i < num; i++) {
    let p = particles1[i];
    noStroke();
    fill(...p.color);
    if (p.strokeWeightScale < 1) {
      p.strokeWeightScale = lerp(p.strokeWeightScale, 1, 0.01);
    }
    circle(p.x, p.y, p.strokeWeight * p.strokeWeightScale);

    let n = noise(p.x * scaleFactor, p.y * scaleFactor);

    // TAU is 2 * PI
    // multiply by 2 to prevent perlin bias
    let a = 2 * TAU * n;

    // bias to the left as perlin clumps around 0.5
    p.x += cos(a) * speed;
    p.y += sin(a) * speed;
    stroke(0);

    if (!onScreen(p)) {
      p.x = random(width);
      p.y = random(height);
      p.strokeWeightScale = 0;
    }
  }
}

function mousePressed(e) {
  noiseSeed(millis());
}

function onScreen(v) {
  return (
    v.x >= 0 - weightMax &&
    v.x <= width + weightMax &&
    v.y >= 0 - weightMax &&
    v.y <= height + weightMax
  );
}
