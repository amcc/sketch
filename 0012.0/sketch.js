//
// pendulum vars
//

let r1;
let r2;
let m1;
let m2;
let a1;
let a2;
let a1_v = 0;
let a2_v = 0;
let a1_a;
let a2_a;
const g = 1.5;

let can;

let px2;
let py2;
let cx;
let cy;

//
// sound vars
//
let carrier; // this is the oscillator we will hear
let modulator; // this oscillator will modulate the frequency of the carrier

// the carrier frequency pre-modulation
let carrierBaseFreq = 220;

// min/max ranges for modulator
let modMaxFreq = 112;
let modMinFreq = 0;
let modMaxDepth = 150;
let modMinDepth = -150;

function setup() {
  createCanvas(windowWidth, windowHeight);

  noFill();

  // pendulum setup
  can = createGraphics(width, height);
  can.background(255);

  cx = width / 2;
  cy = height / 2 - 100;

  // Values are slightly random, meaning every viewing is slightly different
  r1 = random(height / 6, height / 4);
  r2 = random(height / 6, height / 4);
  m1 = random(10, 50);
  m2 = random(10, 50);

  // Starting angles
  a1 = PI / 2;
  a2 = PI / 4;
  noLoop();
}

function startModulator() {
  carrier = new p5.Oscillator("square");
  carrier.amp(1); // set amplitude
  carrier.freq(carrierBaseFreq); // set frequency
  carrier.start(); // start oscillating

  // try changing the type to 'square', 'sine' or 'triangle'
  modulator = new p5.Oscillator("square");
  modulator.start();

  // add the modulator's output to modulate the carrier's frequency
  modulator.disconnect();
  carrier.freq(modulator);

  // create an FFT to analyze the audio
  analyzer = new p5.FFT();
}

function mousePressed() {
  startModulator();
  loop();
}

function draw() {
  // pendulum draw
  background(255);
  image(can, 0, 0);
  stroke(40);
  strokeWeight(1);

  let num1 = -g * (2 * m1 + m2) * sin(a1);
  let num2 = -m2 * g * sin(a1 - 2 * a2);
  let num3 = -2 * sin(a1 - a2) * m2;
  let num4 = sq(a2_v) * r2 + sq(a1_v) * r1 * cos(a1 - a2);
  let den = r1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));

  let num5 = 2 * sin(a1 - a2);
  let num6 = sq(a1_v) * r1 * (m1 + m2);
  let num7 = g * (m1 + m2) * cos(a1);
  let num8 = sq(a2_v) * r2 * m2 * cos(a1 - a2);
  let den2 = r2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));

  let a1_a = (num1 + num2 + num3 * num4) / den;
  let a2_a = (num5 * (num6 + num7 + num8)) / den2;

  // accelleration

  a1_v += a1_a;
  a2_v += a2_a;
  a1 += a1_v;
  a2 += a2_v;

  translate(cx, cy);

  let x1 = r1 * sin(a1);
  let y1 = r1 * cos(a1);

  let x2 = x1 + r2 * sin(a2);
  let y2 = y1 + r2 * cos(a2);

  stroke(255, 0, 0);
  noFill();

  let crossSize = 15;
  line(0, -crossSize, 0, crossSize);
  line(-crossSize, 0, crossSize, 0);

  circle(x1, y1, m1 * 2);
  circle(x2, y2, m2 * 2);

  // can.background(255);
  can.push();
  can.translate(cx, cy);
  can.stroke(0);
  can.strokeWeight(1);
  // can.circle(x2, y2, 2);

  if (frameCount > 1) can.line(px2, py2, x2, y2);
  can.pop();
  px2 = x2;
  py2 = y2;

  //
  //synth
  //

  if (modulator) {
    // map mouseY to modulator freq between a maximum and minimum frequency
    let modFreq = map(y1, height / 4, 0, modMinFreq, modMaxFreq);
    // modFreq = -10
    modulator.freq(modFreq);

    // change the amplitude of the modulator
    // negative amp reverses the sawtooth waveform, and sounds percussive
    //
    let modDepth = map(y2, 0, height / 4, modMinDepth, modMaxDepth);
    // modDepth = -100
    modulator.amp(modDepth);

    // visual stuff below
    // analyze the waveform
    waveform = analyzer.waveform();

    noStroke();
    fill(0);
    let y = height / 2 + 50;
    let x = -width / 2 + 50;
    let freq = "Frequency: " + carrierBaseFreq + " Hz";
    text("Frequency: " + carrierBaseFreq + " Hz", x, y - 40);
    text("Mod Frequency: " + modFreq.toFixed(1) + " Hz", x, y - 20);
    text("Mod Amplitude: " + modDepth.toFixed(1), x, y);
  }
}
