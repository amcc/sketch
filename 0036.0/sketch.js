let w = 450;
let h = 450;

let loaded = false; // use this to prevent drawing while making arrays
const gridArrays = [];
const visibleGridArrays = [];
let currentGrid = 0;
const gridSize = 45;
const noiseLevel = 0.04;
const diameter = 2;
const marginPercentage = 0;
const accellerationInc = 0.1;
const accellerationMin = 0.4;
let offset = 0;

// set up input elements
let squareSizeRange = document.getElementById("square-margin");
let gridTicker = document.getElementById("grid-tick");

// colours
const showGreen = [26, 235, 37];

// make text
let pg; // store text graphics
const tSize = 100;
const textAlpha = 180;
const customFont = "Archivo Black";

// images
const numberOfImages = 45;
const images = [];

// info
let fpsText;

function preload() {
  for (let i = 1; i < numberOfImages; i++) {
    images[i] = loadImage(`1x/${i}.png`);
  }
}

function setup() {
  createCanvas(w * 2, h);
  // createGrid(width, height);

  // look / feel
  noStroke();

  // make and analyse text
  createGridsFromImages(w, h);

  // info (uncomment to use)
  fpsText = document.getElementById("framerate");

  // limit the frame rate
  frameRate(25);
}

function draw() {
  // uncomment to use frame rate
  fps();

  background(255);
  if (loaded) drawPoints();
  if (gridTicker.checked) drawGridLines();
}

// make grid lines (shown using checkbox)
function drawGridLines() {
  stroke(showGreen);
  strokeWeight(1);
  const inc = h / gridSize;
  for (let i = 0; i < h; i++) {
    line(0, i * inc, width, i * inc);
  }
  for (let i = 0; i < w * 2; i++) {
    line(i * inc, 0, i * inc, height);
  }
}

// draw points on the canvas from arrays of point arrays
function drawPoints() {
  // loop over all the visiable grid arrays
  visibleGridArrays.forEach((gridItem, gridIndex) => {
    // loop over all the points in the grid
    gridItem.forEach((p, index) => {
      if (!p.fade) p.fade = 0;
      fill(...p.color, p.fade);
      p.fade += 5;
      if (p.fade > 255) p.fade = 255;

      // select the size of the margin around the square from the range input
      let sMargin = Number(squareSizeRange.value);
      let size = w / gridSize - sMargin * 2;
      let x = p.x + sMargin;
      let y = p.y + sMargin;
      // draw the square using the point objects x and y and margin.
      square(x, y, size);

      // adjust the position of the point for the next frame
      p.x += p.n;
      p.n += accellerationInc;

      // mark the point for removal if it is out of bounds
      if (p.x > width + size * 2) {
        p.splice = true;
      }
    });
    // remove points that are out of bounds
    gridItem.forEach((p, index) => {
      if (p.splice) {
        gridItem.splice(index, 1);
      }
    });
  });

  // remove empty arrays
  visibleGridArrays.forEach((gridItem, gridIndex) => {
    if (gridItem.length === 0) {
      visibleGridArrays.splice(gridIndex, 1);
    }
  });
}

function createGridsFromImages(w, h) {
  const incX = w / gridSize;
  const incY = h / gridSize;
  const marginX = incX * marginPercentage;
  const marginY = incY * marginPercentage;

  // make all text arrays
  images.forEach((img) => {
    pg = createGraphics(w, h);
    // input canvas
    pg.background(0);
    pg.fill(255);
    pg.image(img, 0, 0, w, h);
    // image(pg, 0, 0);

    const gridArray = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        let noiseVal = noise(x * noiseLevel, y * noiseLevel, offset);
        const xVal = x * incX + marginX;
        const yVal = y * incY + marginY;
        const c = pg.get(xVal, yVal);
        const b = (c[0] + c[1] + c[2]) / 3;

        let pointInfo = {
          x: x * incX + marginX,
          y: y * incY + marginY,
          n: noiseVal,
          b: b,
          text: text,
          c: c,
          color: showGreen,
        };

        if (b < 255) {
          gridArray.push(pointInfo);
        }
      }
    }
    gridArrays.push(gridArray);
    offset += 0.1;
  });

  loaded = true;
}

function mousePressed() {
  let newGridOfPoints = JSON.parse(JSON.stringify(gridArrays[currentGrid]));
  visibleGridArrays.push(newGridOfPoints);

  currentGrid++;
  if (currentGrid > gridArrays.length - 1) currentGrid = 0;
}
function fps() {
  fpsText.innerHTML = frameRate().toFixed();
}

function fontLoaded() {
  fontLoaded = true;
}
