// set up input elements in the HTML for use in JS
const squareSizeRange = document.getElementById("square-margin");
const marginValue = document.getElementById("margin-value");
const gridThicknessRange = document.getElementById("grid-thickness");
const gridThicknessValue = document.getElementById("grid-thickness-value");
const gridTicker = document.getElementById("grid-tick");
const gridValue = document.getElementById("grid-value");
const gridSizeRange = document.getElementById("grid-size");

// range event listeners
squareSizeRange.addEventListener("input", (e) => {
  marginValue.innerHTML = e.target.value;
});
gridThicknessRange.addEventListener("input", (e) => {
  gridThicknessValue.innerHTML = e.target.value;
});
gridTicker.addEventListener("input", (e) => {
  gridTicker.checked = e.target.checked;
});
gridSizeRange.addEventListener("input", (e) => {
  gridValue.innerHTML = e.target.value;
  gridSize = Number(e.target.value);
  createGridsFromImages(w, h);
});

// desired size of image area when creating the graphics to analyse images
const w = 450;
const h = 450;

// canvas variables
let gridCanvas; // store canvas variable
const canvasContainer = document.getElementById("canvas-container");
canvasContainer.addEventListener("click", (e) => clickedTheCanvas(e));

let loaded = false; // use this to prevent drawing while making arrays

// grid variables
const gridArrays = []; // store the original images in grids
const visibleGridArrays = []; // store the images to draw onto the canvas
let currentGrid = 0; // increment through the images
let gridSize = Number(gridSizeRange.value); // size of grid to slice imagesc

// look and feel
const noiseLevel = 0.04; // create noise in order to animate points in an interesting way
let offset = 0; // allow the noise on each image to be different - we increment this when sampling images
const marginPercentage = 0; // create a margin around the grid when sampling the images
const accellerationInc = 0.03; // acceleration of the points
const showGreen = [26, 235, 37]; // color of the points
const fadeRate = 1; // how quickly the points fade in

// images to be loaded in preload
const numberOfImages = 45;
const images = [];

// info for frame rate
let fpsText = document.getElementById("framerate");

function preload() {
  for (let i = 1; i < numberOfImages; i++) {
    images[i] = loadImage(`1x/${i}.png`);
  }
}

function setup() {
  gridCanvas = createCanvas(w * 3, h);
  gridCanvas.parent("canvas-container");
  // createGrid(width, height);

  // look / feel
  noStroke();

  // make and analyse text
  createGridsFromImages(w, h);

  // limit the frame rate
  frameRate(30);
}

function draw() {
  // uncomment to use frame rate
  fps();

  background(255);
  if (loaded) drawPoints();
  drawGridLines();
}

// make grid lines (shown using checkbox)
function drawGridLines() {
  const gridThickness = Number(gridThicknessRange.value);
  const strokeColor = gridTicker.checked ? showGreen : 255;
  stroke(strokeColor);
  strokeWeight(gridThickness);
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
      if (p.fade < 255) p.fade += fadeRate;
      noStroke();
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
  // reset the arrays
  visibleGridArrays.length = 0;
  gridArrays.length = 0;

  const incX = w / gridSize;
  const incY = h / gridSize;
  const marginX = incX * marginPercentage;
  const marginY = incY * marginPercentage;

  // make all text arrays
  images.forEach((img) => {
    const pg = createGraphics(w, h);
    // input canvas
    pg.background(0);
    pg.fill(255);
    pg.image(img, 0, 0, w, h);

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

function clickedTheCanvas(e) {
  // make a new copy of the grid array at the currentGrid index
  let newGridOfPoints = JSON.parse(JSON.stringify(gridArrays[currentGrid]));
  // add this copy to the visibleGridArrays
  visibleGridArrays.push(newGridOfPoints);

  currentGrid++;
  if (currentGrid > gridArrays.length - 1) currentGrid = 0;
}

function fps() {
  fpsText.innerHTML = frameRate().toFixed();
}
