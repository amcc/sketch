let loaded = false; // use this to prevent drawing while making arrays
const gridArrays = [];
const visibleGridArrays = [];
let currentGrid = 0;
const grid = 300;
const noiseLevel = 0.04;
const diameter = 2;
const marginPercentage = 0.5;
const accellerationInc = 6;
const accellerationMin = 0.4;

// make text
let pg; // store text graphics
const tSize = 100;
const textAlpha = 180;
const customFont = "Archivo Black";
const texts = [
  "One",
  "should",
  "never",
  "mistake",
  "pattern",
  "for",
  "...",
  "meaning.",
];

// info
let fpsText;

function setup() {
  createCanvas(544, 544);
  // createGrid(width, height);

  // look / feel
  noStroke();

  // make and analyse text
  makeText();

  // info
  // fpsText = document.getElementById("framerate");
  frameRate(25);
  background(0);
}

function draw() {
  background(0, 40);
  // background(0);
  // noLoop()
  // fps();

  fill(255, textAlpha);
  // fill(255);
  if (loaded) drawPoints();
}

function drawPoints() {
  visibleGridArrays.forEach((grid, gridIndex) => {
    if (grid.length === 0) {
      visibleGridArrays.splice(gridIndex, 1);
    }
    grid.forEach((p, index) => {
      circle(p.x, p.y, diameter);
      p.y -= p.n * accellerationInc + accellerationMin;
      if (p.y < 0 - diameter * 3) {
        grid.splice(index, 1);
      }
    });
  });
}

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
  texts.forEach((text) => {
    pg = createGraphics(width, height);
    // input canvas
    pg.background(0);
    pg.fill(255);
    pg.textAlign(CENTER, BOTTOM);
    pg.textSize(tSize);
    pg.textFont(customFont);
    pg.text(
      text,
      width / 10,
      height / 10,
      width - (width * 2) / 10,
      height - (height * 2) / 10
    );
    image(pg, 0, 0);

    const gridArray = [];
    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
        let noiseVal = noise(x * noiseLevel, y * noiseLevel);
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
        };

        if (b > 0) {
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

  currentGrid++;
  if (currentGrid > texts.length - 1) currentGrid = 0;
}
function fps() {
  fpsText.innerHTML = frameRate().toFixed();
}

function fontLoaded() {
  fontLoaded = true;
}
