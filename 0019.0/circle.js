class Circle {
  constructor(x, y, r, fill = 0, stroke = 0) {
    let options = {
      friction: 0.8,
      restitution: 0.1,
    };
    this.body = Bodies.circle(x, y, r, options);
    this.r = r;
    this.fill = fill;
    this.stroke = stroke;
    World.add(world, this.body);
  }

  show() {
    let pos = this.body.position;
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    strokeWeight(0);
    stroke(this.stroke);
    fill(this.fill);
    ellipse(0, 0, this.r * 2);
    pop();
  }
}
