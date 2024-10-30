let angleSlider, speedSlider;
let projectile;
let launch = false; // Flag to track if launched
let predictedPath = [
]; // Array to store the predicted path


function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);

  angleSlider = createSlider(0, 90, 45);
  angleSlider.position(10, 10);
  angleSlider.input(updateProjectile); // Update on slider input

  speedSlider = createSlider(1, 50, 25);
  speedSlider.position(10, 30);
  speedSlider.input(updateProjectile); // Update on slider input

  projectile = new Projectile();
  updateProjectile(); // Initial prediction

}

function draw() {
  background(220);

  // Display predicted path or launched projectile
  if (launch) {
    projectile.display();
  } else {
    displayPredictedPath();
  }

  // Slider labels
  text(`Angle: ${angleSlider.value()}`, angleSlider.x * 2 + angleSlider.width, angleSlider.y + 15);
  text(`Speed: ${speedSlider.value()}`, speedSlider.x * 2 + speedSlider.width, speedSlider.y + 15);

}


// Function to launch the projectile
function mousePressed() {
  if (!launch) {
    launch = true;
    projectile.launch(); // Start the actual projectile motion
  }
}


function updateProjectile() {
  const angle = angleSlider.value();
  const speed = speedSlider.value();
  projectile.update(angle, speed); // Update initial velocity
  predictedPath = projectile.predictPath(); // Recalculate predicted path
  launch = false; // Reset launch flag
}


function displayPredictedPath() {
  stroke(0, 100); // Semi-transparent predicted path
  noFill();
  beginShape();
  for (let p of predictedPath) {
    vertex(p.x, p.y);
  }
  endShape();

  // Draw a point at the start to make it clear
  fill(0);
  stroke(255); // White stroke
  circle(predictedPath[0].x, predictedPath[0].y, 10);

}



class Projectile {
  constructor() {
    this.gravity = createVector(0, 0.2);
    this.pos = createVector(0, height);
    this.vel = createVector();
    this.path = [
    ];
  }

  update(angle, speed) {
    this.angle = angle;
    this.speed = speed; // Store angle and speed
    this.vel.x = speed * cos(angle);
    this.vel.y = -speed * sin(angle);
  }

  launch() {
    // Set the projectile in motion
    this.pos.set(0, height);
    this.path = [
      this.pos.copy()
    ];
  }

  predictPath() {
    let tempPos = createVector(0, height);
    let tempVel = createVector(this.speed * cos(this.angle), -this.speed * sin(this.angle));
    let path = [
      tempPos.copy()
    ];
    while (tempPos.x < width && tempPos.y < height) { // Predict until off-screen
      tempVel.add(this.gravity);
      tempPos.add(tempVel);
      path.push(tempPos.copy());
    }
    return path;
  }


  display() {
    if (this.pos.y > height || this.pos.x > width) {
      this.update(this.angle, this.speed); // allow slider interaction
      this.launch = false;
      return;
    }

    stroke(0);
    noFill();
    beginShape();
    for (let p of this.path) {
      vertex(p.x, p.y);
    }
    endShape();

    this.vel.add(this.gravity);
    this.pos.add(this.vel);
    this.path.push(this.pos.copy());

    fill(0);
    stroke(255);
    circle(this.pos.x, this.pos.y, 10);
  }
}