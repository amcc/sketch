let loaded = false; // use this to prevent drawing while making arrays
const gridArrays = [];
const visibleGridArrays = [];
let currentGrid = 0;
const cWidth = 544;
const grid = cWidth / 4;
const noiseLevel = 0.04;
const diameter = 2;
const marginPercentage = 0.0;
const velocity = 0.5;
const velocityMin = 0.4;
const brightMin = 10; // 0-255

// make image
let pg; // store text graphics
const images = ["images/banner.jpg"];
const imagesLoaded = [];
const dotAlpha = 255;
let direction = 0;

// info
let fpsText;
let showFps = false;

function preload() {
  // load font
  // font = loadFont("fonts/ArchivoBlack-Regular.ttf", fontLoaded);
  // load images
  images.forEach((image) => {
    imagesLoaded.push(loadImage(image));
  });
}

function setup() {
  createCanvas(cWidth, cWidth);
  // createGrid(width, height);

  // look / feel
  noStroke();

  // make and analyse text
  makeText();

  // info
  fpsText = document.getElementById("framerate");
  if (showFps) fpsText.style.display = "block";
  else fpsText.style.display = "none";
  frameRate(25);
  background(0);
}

function draw() {
  // background(0, 40);
  // background(0);
  // noLoop()
  if (showFps) fps();

  fill(255, dotAlpha);
  // fill(255);
  if (loaded) drawPoints();
}

function drawPoints() {
  visibleGridArrays.forEach((grid, gridIndex) => {
    if (grid.length === 0) {
      visibleGridArrays.splice(gridIndex, 1);
    }
    grid.forEach((p, index) => {
      fill(p.c[0], p.c[1], p.c[2], dotAlpha);
      circle(p.x, p.y, diameter);
      if (direction === 0) {
        p.y -= p.n * velocity + velocityMin;
      }
      if (direction === 1) {
        p.x -= p.n * velocity + velocityMin;
      }
      if (direction === 2) {
        p.x += p.n * velocity + velocityMin;
      }
      if (direction === 3) {
        p.y += p.n * velocity + velocityMin;
      }
      if (
        p.y < 0 - diameter * 3 ||
        p.y > height + diameter * 3 ||
        p.x < 0 - diameter * 3 ||
        p.x > width + diameter * 3
      ) {
        grid.splice(index, 1);
      }
    });
  });
}

function accellerate(p) {}

function makeText() {
  // image(pg, 0, 0);
  createGridFromText(width, height);
}

function createGridFromText(w, h) {
  const incX = w / grid;
  const incY = h / grid;
  const marginX = incX * marginPercentage;
  const marginY = incY * marginPercentage;

  // make all text arrays
  imagesLoaded.forEach((pgImage) => {
    pg = createGraphics(width, height);
    // input canvas
    pg.background(0);
    pg.fill(255);
    pg.image(pgImage, 0, 0, pg.width, pg.height);
    image(pg, 0, 0);

    const gridArray = [];
    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
        const xVal = x * incX + marginX;
        const yVal = y * incY + marginY;
        const c = pg.get(xVal, yVal);
        const b = (c[0] + c[1] + c[2]) / 3;

        let pointInfo = {
          x: x * incX + marginX,
          y: y * incY + marginY,
          n: b / 255,
          b: b,
          c: c,
        };

        if (b > brightMin) {
          gridArray.push(pointInfo);
        }
      }
    }
    // console.log(gridArray);
    gridArrays.push(gridArray);
  });

  loaded = true;
  // console.log(gridArrays)
}

function mousePressed() {
  let grid = JSON.parse(JSON.stringify(gridArrays[currentGrid]));
  visibleGridArrays.push(grid);
  // direction = floor(random(4));

  currentGrid++;
  if (currentGrid > imagesLoaded.length - 1) currentGrid = 0;
}
function fps() {
  fpsText.innerHTML = frameRate().toFixed();
}

function fontLoaded() {
  fontLoaded = true;
}
