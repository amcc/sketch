import * as THREE from "three";
import { mediaPipe } from "./mediaPipe.js";

const eyeAmount = 0.2;

export const startFaceInput = () => {
  // getUsermedia parameters.
  const constraints = {
    video: true,
  };

  // Activate the webcam stream.
  const video = document.getElementById("webcam");
  let videoLoaded = false;

  // navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  //   video.srcObject = stream;
  //   video.addEventListener("loadeddata", mediaPipe.predictWebcam(video));
  // });

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      return new Promise((resolve) => (video.onplaying = resolve));
    })
    .then(() => mediaPipe.predictWebcam(video));
  // .catch(log);
};

export const reactToFace = (camRotation) => {
  if (mediaPipe.faceBlendshapes[0]) {
    const downLeft = mediaPipe.faceBlendshapes[0].categories[11].score;
    const downRight = mediaPipe.faceBlendshapes[0].categories[12].score;
    const upLeft = mediaPipe.faceBlendshapes[0].categories[17].score;
    const upRight = mediaPipe.faceBlendshapes[0].categories[18].score;
    const inLeft = mediaPipe.faceBlendshapes[0].categories[13].score;
    const inRight = mediaPipe.faceBlendshapes[0].categories[14].score;
    const outLeft = mediaPipe.faceBlendshapes[0].categories[15].score;
    const outRight = mediaPipe.faceBlendshapes[0].categories[16].score;

    const straightUpAndDown =
      (upLeft < eyeAmount && downLeft < eyeAmount) ||
      (upRight < eyeAmount && downRight < eyeAmount);
    const straightLeftAndRight =
      (inLeft < eyeAmount && outLeft < eyeAmount) ||
      (inRight < eyeAmount && outRight < eyeAmount);
    // console.log(mediaPipe.faceBlendshapes[0].categories);
    if ((downLeft > eyeAmount || downRight > eyeAmount) && !straightUpAndDown) {
      //   console.log("look down");
      camRotation.x = THREE.MathUtils.degToRad(-30);
    }
    if ((upLeft > eyeAmount || upRight > eyeAmount) && !straightUpAndDown) {
      //   console.log("look up");
      camRotation.x = THREE.MathUtils.degToRad(30);
    }
    if (straightUpAndDown) {
      //   console.log("look straight (up/down)");
      camRotation.x = THREE.MathUtils.degToRad(0);
    }
    if ((inLeft > eyeAmount || outRight > eyeAmount) && !straightLeftAndRight) {
      //   console.log("look right");
      camRotation.y = THREE.MathUtils.degToRad(30);
    }
    if ((outLeft > eyeAmount || inRight > eyeAmount) && !straightLeftAndRight) {
      //   console.log("look left");
      camRotation.y = THREE.MathUtils.degToRad(-30);
    }

    if (straightLeftAndRight) {
      //   console.log("look straight (left/right)");
      camRotation.y = THREE.MathUtils.degToRad(0);
    }
  }
};

function onDocumentKeyDown(event, object, camRotation) {
  var keyCode = event.which;
  console.log("keydown");

  if (!object) return;
  if (keyCode == 38) {
    // up arrow
    console.log("up arrow");
    camRotation.x += THREE.MathUtils.degToRad(30);
  }
  if (keyCode == 40) {
    console.log("down arrow");
    // object.rotation.x -= THREE.MathUtils.degToRad(30);
    camRotation.x -= THREE.MathUtils.degToRad(30);
  }
  if (keyCode == 37) {
    console.log("left arrow");
    // object.rotation.y += THREE.MathUtils.degToRad(30);
    camRotation.y += THREE.MathUtils.degToRad(30);
  }
  if (keyCode == 39) {
    console.log("right arrow");
    // object.rotation.y -= THREE.MathUtils.degToRad(30);
    camRotation.y -= THREE.MathUtils.degToRad(30);
  }
}
