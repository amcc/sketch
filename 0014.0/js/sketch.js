import { createNoise3D } from "./simplex-noise.js";
const noise3D = createNoise3D();

let svgCount = 0;
let width;
let height;

let waveHeight = 1;
let zoff = 0;
let circumference;
let desiredLength;

const radDivisions = 14;
const stringWidth = 0.8;
const stringGap = 8;

let phase = 0;
let wobble = 0;
const wobbleInc = 0.019;
const phaseInc = 0.0001;
const zoffInc = 0.0006;
const circleNumber = 170;

let redGroup;
let blueGroup;
let greenGroup;

let text;
let prevTime = 0;

// let
//  taken from paper.js docs http://paperjs.org/tutorials/getting-started/using-javascript-directly/
paper.install(window);
window.onload = function () {
  // let height = paper.project.view.viewSize.height;

  //paper setup
  paper.setup("myCanvas");
  width = paper.view.size.width;
  height = paper.view.size.height;

  desiredLength = Math.min(width, height) * 2.2;

  redGroup = new paper.Group();
  greenGroup = new paper.Group();
  blueGroup = new paper.Group();

  let gridSize = 30;
  waveHeight = 1.2;
  let colourSpread = 0.1;

  // if not doing animation then use this to draw
  paper.view.onFrame = function (event) {
    redGroup.removeChildren();
    blueGroup.removeChildren();
    greenGroup.removeChildren();
    zoff += 0.01;
    let chunk = width / gridSize;
    colourGroup({
      parent: redGroup,
      gridSize: gridSize,
      zoff: 0 + zoff,
      colour: "red",
      chunk: chunk,
      xShift: chunk / 10,
      yShift: -chunk / 10,
    });
    colourGroup({
      parent: blueGroup,
      gridSize: gridSize,
      zoff: colourSpread + zoff,
      colour: "blue",
      chunk: chunk,
      xShift: -chunk / 10,
      yShift: -chunk / 10,
    });
    colourGroup({
      parent: greenGroup,
      gridSize: gridSize,
      zoff: colourSpread * 2 + zoff,
      colour: "green",
      chunk: chunk,
      xShift: 0,
      yShift: chunk / 10,
    });
  };
  // view.draw();

  let t = new Tool();

  //Listen for SHIFT-P to save content as SVG file.
  t.onKeyUp = function (event) {
    if (event.character == "s" || event.character == "S") {
      print();
    }
  };
};

function colourGroup({
  parent,
  gridSize,
  zoff,
  colour,
  chunk,
  xShift = 0,
  yShift = 0,
}) {
  for (let y = 0; y < gridSize + 6; y++) {
    for (let x = 0; x < gridSize - gridSize / 3; x++) {
      let xoff = mapRange(x * waveHeight, 0, gridSize, 0, 1);
      let yoff = mapRange(y * waveHeight, 0, gridSize, 0, 1);

      let r = mapRange(noise3D(xoff, yoff, zoff), -1, 1, 0, chunk / 2);

      new Path.Circle({
        center: [x * chunk + xShift, y * chunk + yShift],
        radius: r * 15.9,
        strokeColor: colour,
        strokeWidth: 1.4,
        // opacity: 0.6,
        blendMode: "screen",
        parent: parent,
      });
    }
  }
}

// Helper functions for radians and degrees.
Math.radians = function (degrees) {
  return (degrees * Math.PI) / 180;
};

Math.degrees = function (radians) {
  return (radians * 180) / Math.PI;
};

// linearly maps value from the range (a..b) to (c..d)
function mapRange(value, a, b, c, d) {
  // first map value from (a..b) to (0..1)
  value = (value - a) / (b - a);
  // then map it from (0..1) to (c..d) and return it
  return c + value * (d - c);
}

function dist(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

// make an svg
function downloadAsSVG(fileName) {
  if (!fileName) {
    fileName = `yourimage-${svgCount}.svg`;
  }
  svgCount++;

  var url =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      paper.project.exportSVG({ bounds: "view", asString: true })
    );

  var link = document.createElement("a");
  link.download = fileName;
  link.href = url;
  link.click();
}

function print() {
  downloadAsSVG(); // paper.project.layers.push(pendulumLayer); // now the redCircle is back
}
