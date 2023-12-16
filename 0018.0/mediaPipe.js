import {
  PoseLandmarker,
  HandLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";

let poseLandmarker;
let handLandmarker;

let runningMode = "VIDEO";
// let video = null;
let lastVideoTime = -1;
let captureEvent;
let loadedCamera;
window.landmarks = [];
window.worldLandmarks = [];

const mediaPipe = {
  personLandmarks: [],
  personWorldLandmarks: [],
  handednesses: [],
  handLandmarks: [],
  handWorldLandmarks: [],
};

// Before we can use PoseLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createPoseLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
      delegate: "GPU",
    },
    runningMode: runningMode,
    numPoses: 1,
  });

  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
      delegate: "GPU",
    },
    runningMode: runningMode,
    numHands: 2,
  });
};
createPoseLandmarker();

const predictWebcam = async (video) => {
  // Now let's start detecting the stream.
  let startTimeMs = performance.now();

  if (
    video.elt &&
    lastVideoTime !== video.elt.currentTime &&
    poseLandmarker &&
    handLandmarker
  ) {
    lastVideoTime = video.elt.currentTime;
    // console.log(poseLandmarker)
    poseLandmarker.detectForVideo(video.elt, startTimeMs, (result) => {
      mediaPipe.personLandmarks = result.landmarks;
      mediaPipe.personWorldLandmarks = result.worldLandmarks;
    });

    let handResults = handLandmarker.detectForVideo(video.elt, startTimeMs);
    mediaPipe.handednesses = handResults.handednesses;
    mediaPipe.handLandmarks = handResults.landmarks;
    mediaPipe.handWorldLandmarks = handResults.worldLandmarks;
  }

  // Call this function again to keep predicting when the browser is ready.
  window.requestAnimationFrame(() => {
    predictWebcam(video);
  });
};

// add the predictWebcam function to the mediaPipe object
mediaPipe.predictWebcam = predictWebcam;

export { mediaPipe };
