let particles = [];
let targets = [];
const fontSize = 110; 
const threshold = 300; 

function setup() {
  createCanvas(windowWidth, windowHeight); 
  pixelDensity(1); 

  let pg = createGraphics(width, height);
  pg.pixelDensity(1);
  pg.background(255);
  pg.fill(0);
  pg.noStroke(); // Rimosso lo stroke per evitare che le lettere "ingrassino" troppo
  pg.textFont('Courier New', 'Courier');
  pg.textStyle(BOLD);
  pg.textSize(fontSize);
  pg.textAlign(CENTER, CENTER);

  let centerY = height / 2;
  
  // CORREZIONE BUG: Scriviamo le lettere distanziate manualmente
  // Prima riga: PLAYING WITH
  let line1 = "PLAYING WITH";
  let spacing1 = 75; // Spazio tra le lettere della prima riga
  for (let i = 0; i < line1.length; i++) {
    let xOff = (i - (line1.length - 1) / 2) * spacing1;
    pg.text(line1[i], width / 2 + xOff, centerY - 80);
  }

  // Seconda riga: CODE
  let line2 = "CODE";
  let spacing2 = 90; // Spazio maggiore per la parola CODE (molto bold)
  for (let i = 0; i < line2.length; i++) {
    let xOff = (i - (line2.length - 1) / 2) * spacing2;
    pg.text(line2[i], width / 2 + xOff, centerY + 80);
  }

  // Analisi pixel più precisa
  let gap = 7; 
  pg.loadPixels();
  for (let y = 0; y < pg.height; y += gap) {
    for (let x = 0; x < pg.width; x += gap) {
      let index = (x + y * pg.width) * 4;
      if (pg.pixels[index] < 128) {
        targets.push(createVector(x, y));
      }
    }
  }

  let totalParticles = targets.length * 3;
  for (let i = 0; i < totalParticles; i++) {
    let t = i < targets.length ? targets[i] : null;
    particles.push(new Particle(t));
  }
}

function draw() {
  background(255); 

  let center = createVector(width / 2, height / 2);
  let mousePos = createVector(mouseX, mouseY);
  let distToCenter = mousePos.dist(center);
  let assemble = distToCenter < threshold;

  for (let p of particles) {
    p.update(assemble);
    p.show();
  }
}

class Particle {
  constructor(targetVector) {
    this.target = targetVector;
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(2, 6));
    this.acc = createVector();
    this.size = random(5, 12); // Dimensioni bilanciate per la leggibilità
    this.maxSpeed = 22; 
    this.maxForce = 2.0;
    this.noiseOff = random(1000);
    this.alpha = 255;
  }

  update(assemble) {
    if (assemble && this.target) {
      let steer = p5.Vector.sub(this.target, this.pos);
      let d = steer.mag();
      let speed = this.maxSpeed;
      if (d < 100) speed = map(d, 0, 100, 0, this.maxSpeed);
      steer.setMag(speed);
      let force = p5.Vector.sub(steer, this.vel);
      force.limit(this.maxForce);
      this.applyForce(force);
      this.alpha = lerp(this.alpha, 255, 0.1);
    } else {
      let angle = noise(this.noiseOff, frameCount * 0.01) * TWO_PI * 4;
      let wander = p5.Vector.fromAngle(angle).mult(0.8);
      this.applyForce(wander);
      this.vel.limit(5);

      if (assemble && !this.target) {
        this.alpha = lerp(this.alpha, 0, 0.2);
      } else {
        this.alpha = lerp(this.alpha, 255, 0.05);
      }
    }

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
  }

  applyForce(f) { this.acc.add(f); }

  show() {
    if (this.alpha > 5) {
      fill(0, this.alpha);
      noStroke();
      ellipse(this.pos.x, this.pos.y, this.size);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}