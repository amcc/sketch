let w = 450;
let h = 450;

let loaded = false; // use this to prevent drawing while making arrays
const gridArrays = [];
const visibleGridArrays = [];
let currentGrid = 0;
const grid = 45;
const noiseLevel = 0.04;
const diameter = 2;
const marginPercentage = 0;
const accellerationInc = 0.1;
const accellerationMin = 0.4;
let offset = 0;

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
  makeText();

  // info
  // fpsText = document.getElementById("framerate");
  frameRate(25);
  background(0);
  // blendMode(DODGE);

  console.log(squareSizeRange);
}

function draw() {
  clear();
  background(255);
  // background(0);
  // noLoop()
  // fps();

  // fill(255, textAlpha);
  // fill(26, 235, 37);
  // fill(255);
  if (loaded) drawPoints();
  if (gridTicker.checked) drawGridLines();
}

function drawGridLines() {
  stroke(showGreen);
  strokeWeight(1);
  const inc = h / grid;
  for (let i = 0; i < h; i++) {
    line(0, i * inc, width, i * inc);
  }
  for (let i = 0; i < w * 2; i++) {
    line(i * inc, 0, i * inc, height);
  }
  // noStroke();
}

function drawPoints() {
  visibleGridArrays.forEach((gridItem, gridIndex) => {
    gridItem.forEach((p, index) => {
      fill(p.color);
      let inputValue = Number(squareSizeRange.value);
      let sMargin = inputValue;
      let size = w / grid - sMargin * 2;
      let x = p.x + sMargin;
      let y = p.y + sMargin;
      square(x, y, size);

      p.x += p.n;
      p.n += accellerationInc;
      if (p.x > width + 200) {
        // mark for removal
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

function makeText() {
  // image(pg, 0, 0);
  createGridFromText(w, h);
}

function createGridFromText(w, h) {
  const incX = w / grid;
  const incY = h / grid;
  const marginX = incX * marginPercentage;
  const marginY = incY * marginPercentage;

  console.log("images", images.length);
  // make all text arrays
  images.forEach((img) => {
    pg = createGraphics(w, h);
    // input canvas
    pg.background(0);
    pg.fill(255);
    pg.textAlign(CENTER, BOTTOM);
    pg.image(img, 0, 0, w, h);
    // image(pg, 0, 0);

    const gridArray = [];
    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
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
          color: showGreen,
        };

        if (b < 255) {
          gridArray.push(pointInfo);
        }
      }
    }
    // console.log(gridArray);
    gridArrays.push(gridArray);

    offset += 0.1;
  });
  console.log("gridArrays", gridArrays.length);

  loaded = true;
  // console.log(gridArrays)
}

function mousePressed() {
  console.log(currentGrid, gridArrays.length, images.length);
  let grid = JSON.parse(JSON.stringify(gridArrays[currentGrid]));
  visibleGridArrays.push(grid);

  currentGrid++;
  if (currentGrid > gridArrays.length - 1) currentGrid = 0;
}
function fps() {
  fpsText.innerHTML = frameRate().toFixed();
}

function fontLoaded() {
  fontLoaded = true;
}
