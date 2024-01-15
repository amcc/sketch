let particles1 = [];
let particles2 = [];
const num = 10000;
const scaleFactor = 0.001;
const speed = 0.12;
const weightMax = 1;

let fps;

let x = 0;
let y = 0;
let grid = 50;
let gap;

function setup() {
  frameRate(30);
  createCanvas(540, 540);
  gap = width / 100;
  stroke(255);
  for (let i = 0; i < num; i++) {
    let ran = floor(random(2));
    let particle = {
      x: x * gap,
      y: y * gap,
      xStart: x * grid,
      yStart: y * grid,
      strokeWeight: random(1, ran === 1 ? weightMax : weightMax / 4),
      strokeWeightScale: 0,
      color: ran === 1 ? [0, 100] : [255],
    };
    particles1.push(particle);

    x += 1;
    if (x === grid) y += 1;
    if (x > grid) x = 0;
  }
  background(220,220,200);
  // blendMode(SCREEN)

  fps = document.getElementById("framerate");
}

function draw() {
  fps.innerHTML = frameRate();
  // clear()
  // background(222, 10);
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
      p.x = p.xStart;
      p.y = p.yStart;
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
