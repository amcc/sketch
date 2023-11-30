import { createNoise3D } from "./simplex-noise.js";
const noise3D = createNoise3D();

let zoff = 0;
let circumference;
let desiredLength;

const radDivisions = 9;
const stringGap = 8;

let phase = 0;
let wobble = 0;
const wobbleInc = 0.0199;
const phaseInc = 0.0011;
const zoffInc = 0.0116;
const circleNumber = 9;
let svgCount = 0;

let circleGroup;

let text;
let prevTime = 0;

let width;
let height;

let colours = ["cyan", "magenta", "yellow"];

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

  circleGroup = new paper.Group();
  circleGroup.applyMatrix = false;

  // text = new PointText(new Point(200, 50));
  // text.justification = "center";
  // text.fillColor = "black";
  // text.content = "framerate";

  view.onFrame = function (event) {
    if (event.count % 2 === 0) {
      // text.content = "framerate = " + Math.floor(1 / (event.time - prevTime));
      prevTime = event.time;

      circleGroup.removeChildren();
      wobble = 0;
      for (let x = 0; x < circleNumber; x++) {
        makeCircle(width, height, wobble, true, colours[x % 3]);
        wobble += wobbleInc;
      }
      phase += phaseInc;
      zoff += zoffInc;
    }
  };
  // if not doing animation then use this to draw
  //view.draw();

  view.onResize = function (event) {
    width = paper.view.size.width;
    height = paper.view.size.height;
    desiredLength = Math.min(width, height) * 2.2;
  };

  let t = new Tool();

  //Listen for SHIFT-P to save content as SVG file.
  t.onKeyUp = function (event) {
    if (event.character == "s" || event.character == "S") {
      print();
    }
  };
};

// make an svg
function downloadAsSVG(fileName) {
  if (!fileName) {
    fileName = `squares-${svgCount}.svg`;
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

const makeCircle = (width, height, wobble, close = false, color = "black") => {
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

  var circleParent = new paper.Group();
  circleParent.parent = circleGroup;

  let flip = true;
  for (
    let a = phase;
    a < Math.PI * 2 + phase - Math.radians(gap);
    a += Math.radians(radDivisions)
  ) {
    flip = !flip;
    let xoff = mapRange(Math.cos(a + phase), -1, 1, 0, noiseMax);
    let yoff = mapRange(Math.sin(a + phase), -1, 1, 0, noiseMax);

    //   simplex;
    let r = mapRange(noise3D(xoff, yoff, zoff), -1, 1, width / 10, width / 4);

    let circleRadius = mapRange(
      noise3D(xoff, yoff, zoff),
      -1,
      1,
      width / 10,
      width / 5
    );

    let x = r * Math.cos(a);
    let y = r * Math.sin(a);

    // let ran = Math.floor(Math.random() * 20);
    let ran = 0;

    if (ran === 0) {
      let rect = new Path.Rectangle({
        point: [
          x + width / 2 - circleRadius / 2,
          y + height / 2 - circleRadius / 2,
        ],
        size: [circleRadius, circleRadius],
        strokeColor: color,
        strokeWidth: r / 50,
        rotation: flip ? -r : r,
        parent: circleParent,
        // fillColor: `rgba(0,0,0,${alpha})`,
      });
      rect.blendMode = "multiply";
    }

    shapeArray.push([x, y]);

    if (prevX && prevY) {
      circumference += dist(prevX, prevY, x, y);
    }

    prevX = x;
    prevY = y;
  }

  // myPath.strokeColor = "black";
  // myPath.strokeWidth = stringWidth;

  // p5.scale(desiredLength / circumference);
  // p5.beginShape();
  // shapeArray.forEach((point) =>
  //   myPath.add(new Point(point[0] + width / 2, point[1] + height / 2))
  // );

  // myPath.closed = true;
  // myPath.smooth();
  // myPath.fullySelected = true;
  // circleParent.scale(desiredLength / circumference);
  // close ? p5.endShape(p5.CLOSE) : p5.endShape();
};

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
