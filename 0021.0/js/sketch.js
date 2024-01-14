// container groups
var metaBalls;
var originals;

// store the current scale
// updated on resize
var resizeTimer;
var startWidth;
var currentScale;

// circle variables
var circles;
var numberOfCircles;
var radiusRandom;
var radiusMin;
var offsetProportion;
var offSetRandom;
var offSetMin;
var sinRandom;
var sinMin;
var offsetVariant;
var sineVariant;
var scaleFactor;
var scalingMaxWidth;

// colours
var planetColour;
var moonColour;
var connectorColour;

//sizes
var largeMobileSize;
var tabletSize;
var desktopSize;
var widescreenSize;

// mouseposition
var mousePointX;
var mousePointY;

// metaballs
var connections;
var handle_len_rate;
var blobDistance;
var blobDistanceFactor;
var blobRadiusFactor;

// save as svg
var t;

// Make the paper scope global, by injecting it into window:
paper.install(window);
window.onload = function () {
  // Setup directly from canvas id:
  paper.setup("myCanvas");

  metaBalls = new paper.Group();

  // metaballs
  connections = new paper.Group({
    parent: metaBalls,
  });

  // dont put originals in the dom
  originals = new paper.Group({
    parent: metaBalls,
  });

  // set variables
  // breakpoints
  largeMobileSize = 500;
  tabletSize = 768;
  desktopSize = 950;
  widescreenSize = 1280;
  // colours
  planetColour = "black";
  moonColour = "black";
  connectorColour = "black";
  circles = [];
  // numberOfCircles = Math.ceil(Math.random() * 3) + 2;
  numberOfCircles = 16;
  radiusRandom = 100;
  radiusMin = 20;
  // vary this to change distance moved by blobs:
  offsetProportion = 0.78;
  setOffsetRandom();
  sinRandom = 65;
  sinMin = 45;
  // for varying moon rotation
  offsetVariant = 1.3;
  sineVariant = 1.3;
  // scaling
  scaleFactor = 1;
  scalingMaxWidth = 1200;
  startWidth = paper.view.bounds.width;
  strokeWidth = paper.view.size.width > tabletSize ? 1 : 2;
  mousePointX = paper.view.size.width / 2;
  mousePointY = paper.view.size.height / 2;
  handle_len_rate = 2.2;
  blobDistanceFactor = 7.7;
  blobDistance = paper.view.size.width / blobDistanceFactor;
  blobRadiusFactor = 2;

  currentScale = (paper.view.bounds.width / scalingMaxWidth) * scaleFactor;

  for (var i = 0; i < numberOfCircles; i++) {
    var circleRadius =
      (Math.floor(Math.random() * radiusRandom) + radiusMin) * currentScale;
    var isMoon = i % 2 === 0 && i > 0 ? true : false;
    var offsetRandomSeed = [Math.random(), Math.random()];

    var circle = new paper.Path.Circle({
      center: paper.view.center.add(
        new paper.Point(
          Math.floor(Math.random() * offSetRandom) - offSetMin,
          Math.floor(Math.random() * offSetRandom) - offSetMin
        )
      ),
      radius: circleRadius,
      parent: originals,
      moon: isMoon,
      parentPlanet: i - 1,
      fillColor: isMoon ? moonColour : planetColour,
      originalRadius: circleRadius,
      // selected: true,
      offsetRandomSeed: offsetRandomSeed,
      sine: [
        Math.floor(Math.random() * sinRandom) + sinMin,
        Math.floor(Math.random() * sinRandom) + sinMin,
      ],
    });
    circle.offset = createCircleOffset(circle);
    circle.orginalBounds = circle.bounds;
    circles.push(circle);
  }

  function generateConnections(paths) {
    // Remove the last connection paths:
    if (connections) {
      connections.children = [];
      for (var i = 0, l = paths.length; i < l; i++) {
        for (var j = i - 1; j >= 0; j--) {
          var path = metaball(
            paths[i],
            paths[j],
            0.5,
            handle_len_rate,
            blobDistance
          );
          if (path) {
            connections.appendTop(path);
            path.removeOnMove();
          }
        }
      }
    }
  }

  paper.view.onMouseMove = function (evt) {
    mousePointX = evt.point.x;
    mousePointY = evt.point.y;
    generateConnections(circles);
  };

  paper.view.onFrame = function (evt) {
    // run at 30fps
    if (evt.count % 2 === 0) {
      // if (evt.count > 10 && blackOutRectangle.opacity > 0) {
      //   blackOutRectangle.opacity -= 0.02;
      // }
      for (var i = 0; i < circles.length; i++) {
        moveCircles(evt.count, i);
      }
      generateConnections(circles);
    }
  };

  paper.view.onResize = function (resizeAmount) {
    currentScale = resizeAmount.size.width / startWidth;
    getScale(resizeAmount.size.width);
  };

  function getScale() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
    }, 200);
  }

  function resize() {
    // change the offset and rescale circles
    for (var i = 0; i < circles.length; i++) {
      circles[i].offset = createCircleOffset(circles[i]);
      circles[i].fitBounds(circles[i].orginalBounds);
      circles[i].scale(currentScale);
    }
  }

  function setOffsetRandom() {
    offSetRandom =
      paper.view.bounds.width > paper.view.bounds.height
        ? paper.view.bounds.height * offsetProportion
        : paper.view.bounds.width * offsetProportion;
    offSetMin = offSetRandom / 2;
  }

  function createCircleOffset(circle) {
    setOffsetRandom();
    var offset = new paper.Point(
      Math.floor(circle.offsetRandomSeed[0] * offSetRandom) - offSetMin,
      Math.floor(circle.offsetRandomSeed[1] * offSetRandom) - offSetMin
    );
    return offset;
  }

  function moveCircles(count, i) {
    var centerX = circles[i].moon
      ? circles[i - 1].position.x
      : paper.view.center.x;
    var centerY = circles[i].moon
      ? circles[i - 1].position.y
      : paper.view.center.y;
    var parentPoint = new paper.Point(centerX, centerY);

    var offsetX = circles[i].moon
      ? circles[i].offset.x / offsetVariant
      : circles[i].offset.x;
    var offsetY = circles[i].moon
      ? circles[i].offset.y / offsetVariant
      : circles[i].offset.y;
    var sin0 = circles[i].moon
      ? circles[i].sine[0] / sineVariant
      : circles[i].sine[0];
    var sin1 = circles[i].moon
      ? circles[i].sine[1] / sineVariant
      : circles[i].sine[1];

    var spinX = offsetX * Math.sin(count / sin0);
    var spinY = offsetY * Math.sin(count / sin1);
    var deltaX;
    var deltaY;
    deltaX = (mousePointX - centerX) / (i + 2);
    deltaY = (mousePointY - centerY) / (i + 2);
    spinX += deltaX;
    spinY += deltaY;
    var point = [spinX, spinY];

    circles[i].position = parentPoint.add(point);
  }

  // ---------------------------------------------
  function metaball(ball1, ball2, v, handle_len_rate, maxDistance) {
    var center1 = ball1.position;
    var center2 = ball2.position;
    var radius1 = ball1.bounds.width / 2;
    var radius2 = ball2.bounds.width / 2;

    var newMaxDistance = ((radius1 + radius2) / 2) * blobRadiusFactor;
    var pi2 = Math.PI / 2;
    var d = center1.getDistance(center2);
    var u1, u2;
    if (radius1 === 0 || radius2 === 0) return;
    if (d > newMaxDistance || d <= Math.abs(radius1 - radius2)) {
      return;
    } else if (d < radius1 + radius2) {
      // case circles are overlapping
      u1 = Math.acos(
        (radius1 * radius1 + d * d - radius2 * radius2) / (2 * radius1 * d)
      );
      u2 = Math.acos(
        (radius2 * radius2 + d * d - radius1 * radius1) / (2 * radius2 * d)
      );
    } else {
      u1 = 0;
      u2 = 0;
    }

    var angle1 = center2.subtract(center1).getAngleInRadians();
    var angle2 = Math.acos((radius1 - radius2) / d);
    var angle1a = angle1 + u1 + (angle2 - u1) * v;
    var angle1b = angle1 - u1 - (angle2 - u1) * v;
    var angle2a = angle1 + Math.PI - u2 - (Math.PI - u2 - angle2) * v;
    var angle2b = angle1 - Math.PI + u2 + (Math.PI - u2 - angle2) * v;
    var p1a = center1.add(getVector(angle1a, radius1));
    var p1b = center1.add(getVector(angle1b, radius1));
    var p2a = center2.add(getVector(angle2a, radius2));
    var p2b = center2.add(getVector(angle2b, radius2));

    // define handle length by the distance between
    // both ends of the curve to draw
    var totalRadius = radius1 + radius2;
    var d2 = Math.min(
      v * handle_len_rate,
      p1a.subtract(p2a).length / totalRadius
    );

    // case circles are overlapping:
    d2 *= Math.min(1, (d * 2) / (radius1 + radius2));

    radius1 *= d2;
    radius2 *= d2;

    var path = new paper.Path({
      segments: [p1b, p2b, p2a, p1a],
      fillColor: connectorColour,
      closed: true,
      // selected: true,
    });
    var segments = path.segments;
    segments[0].handleOut = getVector(angle1b + pi2, radius1);
    segments[1].handleIn = getVector(angle2b - pi2, radius2);
    segments[2].handleOut = getVector(angle2a + pi2, radius2);
    segments[3].handleIn = getVector(angle1a - pi2, radius1);
    return path;
  }

  // ------------------------------------------------
  function getVector(radians, length) {
    return new paper.Point({
      // Convert radians to degrees:
      angle: (radians * 180) / Math.PI,
      length: length,
    });
  }

  function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
  }

  function tweenVariable(initialVal) {
    var target = initialVal;
    var val = initialVal;

    var set = (v) => (target = v);

    var update = () => {
      val = lerp(val, target, 0.35);
    };

    return {
      set,
      update,
      value: () => val,
    };
  }

  function downloadAsSVG(fileName) {
    if (!fileName) {
      fileName = "blob.svg";
    }

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

  t = new Tool();

  //Listen for SHIFT-P to save content as SVG file.
  t.onKeyUp = function (event) {
    if (event.character == "P") {
      downloadAsSVG();
    }
  };

  // now draw
  paper.view.draw();
};
