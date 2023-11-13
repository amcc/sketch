import { createNoise3D } from "./simplex-noise.js";
const noise3D = createNoise3D();

let svgCount = 0;
// let width;
// let height;

let waveHeight = 1;
let zoff = 0;
let zoffs = [];
let circumference;
let desiredLength;

const radDivisions = 18;
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
  let width = paper.view.size.width;
  let height = paper.view.size.height;

  desiredLength = Math.min(width, height) * 2.2;

  redGroup = new paper.Group();
  greenGroup = new paper.Group();
  blueGroup = new paper.Group();

  let gridSize = 30;
  waveHeight = 5.9;
  wobble = 0.9;
  let colourSpread = 0.08;

  for (let y = 0; y < gridSize / 2; y++) {
    for (let x = 0; x < gridSize / 2; x++) {
      zoffs[x + y] = Math.random();
    }
  }
  // if not doing animation then use this to draw
  paper.view.onFrame = function (event) {
    redGroup.removeChildren();
    blueGroup.removeChildren();
    greenGroup.removeChildren();
    zoff += 0.01;
    let chunk = width / gridSize;
    let chunkGap = chunk / 40;
    colourGroup({
      parent: redGroup,
      gridSize: gridSize,
      zoff: 0 + zoff,
      colour: "cyan",
      chunk: chunk,
      xShift: chunkGap,
      yShift: -chunkGap,
    });
    colourGroup({
      parent: blueGroup,
      gridSize: gridSize,
      zoff: colourSpread + zoff,
      colour: "magenta",
      chunk: chunk,
      xShift: -chunkGap,
      yShift: -chunkGap,
    });
    colourGroup({
      parent: greenGroup,
      gridSize: gridSize,
      zoff: colourSpread * 2 + zoff,
      colour: "yellow",
      chunk: chunk,
      xShift: 0,
      yShift: chunkGap,
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
  for (let y = 0; y < gridSize / 2; y++) {
    for (let x = 0; x < gridSize / 2; x++) {
      let xoff = mapRange(x * waveHeight, 0, gridSize, 0, 1);
      let yoff = mapRange(y * waveHeight, 0, gridSize, 0, 1);

      let r = mapRange(noise3D(xoff, yoff, zoff), -1, 1, chunk / 16, chunk / 4);
      // let r = 10;

      // new Path.Circle({
      //   center: [x * chunk + xShift, y * chunk + yShift],
      //   radius: r * 1.9,
      //   strokeColor: colour,
      //   strokeWidth: 1.4,
      //   // opacity: 0.6,
      //   blendMode: "screen",
      //   parent: parent,
      // });

      makeCircle({
        centerX: x * chunk + xShift + (chunk / 4) * gridSize,
        centerY: y * chunk + yShift + (chunk / 4) * gridSize,
        radius: r,
        radMin: r * 0.5,
        parent: parent,
        strokeColor: colour,
        strokeWidth: 1.8,
        blendMode: "multiply",
        zoff: zoffs[x + y],
      });

      zoff += 0.001;
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

const makeCircle = ({
  centerX: centerX,
  centerY: centerY,
  radius: radius,
  parent: parent,
  strokeColor: strokeColor,
  strokeWidth: strokeWidth,
  radMin: radMin,
  zoff: zoff,
  blendMode: blendMode,
}) => {
  const gap = close ? 0 : stringGap;

  circumference = 0;
  let prevX, prevY;
  // p5.stroke(0);
  // p5.noFill();
  // p5.strokeWeight((stringWeight * p5.width) / 1580);
  // p5.strokeWeight(stringWeight);
  // p5.strokeCap(p5.ROUND);
  // p5.noFill();

  // shift shapes across by radius
  const add = desiredLength / Math.PI;
  // p5.translate(x, y);

  let shapeArray = [];

  let noiseMax = wobble;
  for (
    let a = phase;
    a < Math.PI * 2 + phase - Math.radians(gap);
    a += Math.radians(radDivisions)
  ) {
    let xoff = mapRange(Math.cos(a + phase), -1, 1, 0, noiseMax);
    let yoff = mapRange(Math.sin(a + phase), -1, 1, 0, noiseMax);

    //   simplex;
    let r = mapRange(noise3D(xoff, yoff, zoff), -1, 1, radius * radMin, radius);

    let x = r * Math.cos(a);
    let y = r * Math.sin(a);

    shapeArray.push([x, y]);

    if (prevX && prevY) {
      circumference += dist(prevX, prevY, x, y);
    }

    prevX = x;
    prevY = y;
  }
  var myPath = new paper.Path();
  myPath.parent = parent;
  myPath.strokeColor = strokeColor;
  myPath.strokeWidth = strokeWidth;

  // p5.scale(desiredLength / circumference);
  // p5.beginShape();
  shapeArray.forEach((point) =>
    myPath.add(new Point(point[0] + centerX, point[1] + centerY))
  );

  myPath.closed = true;
  myPath.smooth();
  myPath.blendMode = blendMode;
  // myPath.fullySelected = true;
  // myPath.scale(desiredLength / circumference);
  // close ? p5.endShape(p5.CLOSE) : p5.endShape();
};
