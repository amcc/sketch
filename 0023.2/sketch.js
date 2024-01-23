let particles1 = [];
let particles2 = [];
const scaleFactor = 0.001;
let speed = 0.02;
const weightMax = 20;
const bgColor = [220, 220, 200];

let fps;

let x = 0;
let y = 0;
let grid = 50;
let gap;

const num = grid * grid;

function setup() {
  // frameRate(30);
  createCanvas(540, 540);
  gap = width / grid;
  stroke(255);
  for (let i = 0; i < num; i++) {
    let ran = floor(random(6));
    let particle = {
      x: x * gap,
      y: y * gap,
      xStart: x * gap,
      yStart: y * gap,
      opacity: random(255),
      strokeWeight: random(1, ran === 1 ? weightMax : weightMax / 4),
      strokeWeightScale: 0,
      color: ran >= 1 ? [0] : [255],
    };
    particles1.push(particle);

    // create a grid
    x += 1;
    if (x === grid && y < grid) y += 1;
    if (x >= grid) x = 0;
  }
  background(220, 220, 200);
  // blendMode(SCREEN)

  fps = document.getElementById("framerate");
}

function draw() {
  fps.innerHTML = frameRate();
  // clear()
  background(...bgColor, 30);
  for (let i = 0; i < num; i++) {
    let p = particles1[i];
    noStroke();
    fill(...p.color, p.opacity);
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
  if (speed < 1.4) speed += 0.005;
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

function keyPressed() {
  // saveCanvas("flowfield 0023.2", "png");
}
