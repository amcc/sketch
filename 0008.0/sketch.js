// HOW TO USE
// predictWebcam(video) will start predicting landmarks

// pass a video MediaElement using createCapture
// make sure to call predictWebcam as a callback to createCapture
// this ensures the video is ready

// parts index:
// https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/index

let capture;
let loadedCamera;
let captureEvent;
let confidence = 0.0;
let yOff = 0;
let defaultWeight = 50;
let lerpRate = 0.4;
let madeClone = false;
let lerpLandmarks = [];
let videGraphics;

//font stuff
let variableText;
let weightSlider;
let slantSlider;
let crsvSlider;
let monoSlider;
let caslSlider;
// slider values
let slant;
let crsv;
let mono;
let casl;

let fingerIsClicked = false;
let fingerClickPos = {
  x: 0,
  y: 0,
};
let textPos = {
  x: 0,
  y: 0,
};

let tFrames = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  captureWebcam();
  vidGraphics = createGraphics(width, height);

  variableText = select(".variable");
  weightSlider = select(".weight");
  slantSlider = select(".slant");
  crsvSlider = select(".crsv");
  monoSlider = select(".mono");
  caslSlider = select(".casl");
}

function draw() {
  // background(255);
  let xDiff = width - capture.width;
  let yDiff = height - capture.height;
  let xM = capture.width + xDiff / 2;
  let yM = capture.height + yDiff / 2;
  clear();
  image(capture, xDiff / 2, yDiff / 2);
  fill(255, 255);
  noStroke();
  rect(0, 0, width, height);

  function relPos(point) {
    let pos = {
      x: point.x * xM * 0.8,
      y: point.y * xM * 0.8,
    };
    return pos;
  }
  // console.log({landmarks})
  let first = true;
  if (landmarks.length > 0) {
    for (const hand of landmarks) {
      first ? fill(255, 0, 0) : fill(0, 255, 0);
      let tWidth;
      if (first) {
        tWidth = hand[4].y * yM - hand[8].y * yM;
      }

      for (const [index, m] of hand.entries()) {
        if (first) {
          stroke(100, 200, 255);
        } else {
          stroke(255, 200, 100);
        }
        if (index === 4 || index === 8 || index === 12) {
          stroke(255, 0, 0);
        }
        if ((index === 4 || index === 8) && first) {
          if (tWidth < height/20) {
            // find the finger clicked pos
            // only happens at the moment fingers are clicked
            if (!fingerIsClicked) fingerClickPos = relPos(hand[8]);
            // set to true to prevent above happening in this loop
            fingerIsClicked = true;
            stroke(0, 255, 0);

            // get the previous position and current position
            let prev = textPos;
            let pos = relPos(hand[8]);

            // find differences between position and clicked pos
            let diffX = pos.x - fingerClickPos.x;
            let diffY = pos.y - fingerClickPos.y;

            // move the text
            textPos.x = prev.x + diffX;
            textPos.y = prev.y + diffY;
            
            // reset the position of fingerClick to prevent runaway movement
            fingerClickPos = relPos(hand[8]);
          } else {
            fingerIsClicked = false;
          }
        }
        noFill();
        strokeWeight(abs(50 * m.z));

        let x = m.x * capture.width + xDiff / 2;
        let y = m.y * capture.height + yDiff / 2;
        let z = m.z * 400;

        circle(x, y, z);
      }
      // console.log(dist(hand[4].x, hand[8].x))

      let weight;
      let slant;
      let mono;
      let casl;
      let crsv;
      if (first) {
        // variableText.style("font-size", tWidth + "px");
        // variableText.style("line-height", tWidth + "px");
        variableText.style("left", textPos.x + "px");
        variableText.style("top", textPos.y + "px");
        slant = map(hand[8].x * xM - hand[4].x * xM, 10, width / 6, 0, -15);
        casl = map(hand[4].y * yM - hand[12].y * yM, height / 4, 10, 0, 1);
        // crsv = map(hand[4].y * yM - hand[16].y * yM, height / 4, 10, 0, 1);

        slantSlider.value(slant);
        caslSlider.value(casl);
        // crsvSlider.value(crsv);
      } else {
        weight = map(
          hand[4].y * yM - hand[8].y * yM,
          10,
          height / 2,
          300,
          1000
        );
        mono = map(hand[4].y * yM - hand[12].y * yM, 10, height / 4, 0, 1);

        weightSlider.value(weight);
        monoSlider.value(mono);
      }
      first = false;
    }
  }

  variableText.style("font-weight", weightSlider.value());

  slant = slantSlider.value();
  crsv = crsvSlider.value();
  mono = monoSlider.value();
  casl = caslSlider.value();
  variableText.style(
    "font-variation-settings",
    "'slnt' " +
      slant +
      ", 'CRSV' " +
      crsv +
      ", 'MONO' " +
      mono +
      ", 'CASL' " +
      casl
  );
}

function loc(point) {
  let xDiff = width - capture.width;
  let yDiff = height - capture.height;
  return [
    point.x * capture.width + xDiff / 2 - width / 2,
    point.y * capture.height + yDiff / 2 - height / 2,
    point.z * 1000,
  ];
}

function captureWebcam() {
  capture = createCapture(
    {
      audio: false,
      video: {
        facingMode: "user",
      },
    },
    function (e) {
      captureEvent = e;
      // do things when video ready
      // until then, the video element will have no dimensions, or default 640x480
      capture.srcObject = e;

      setCameraDimensions();
      predictWebcam(capture);
    }
  );
  capture.elt.setAttribute("playsinline", "");
  // capture.hide();
}

function setCameraDimensions() {
  loadedCamera = captureEvent.getTracks()[0].getSettings();
  // console.log("cameraDimensions", loadedCamera);
  if (capture.width > capture.height) {
    if(height > width) {
      capture.size((capture.width / capture.height) * height, height);
    } else {
      capture.size(width, (capture.height / capture.width) * width);
    }
    
  } else {
    capture.size(width, (capture.height / capture.width) * width);
  }
  // console.log(capture);
}

function getAngle(v0x, v0y, v1x, v1y) {
  return atan2(v1y - v0y, v1x - v0x);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setCameraDimensions();
}

function simpLerp(a, b, rate) {
  return a + rate * (b - a);
}
