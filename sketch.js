let trator;
let produtos = [];
let cidade;
let pontos = 0;
let festaAtiva = false;
let festaTimer = 0;
let obstaculos = [];

function setup() {
  createCanvas(800, 400);
  trator = new Trator();
  cidade = createVector(750, 200);

  // Gerar produtos no campo
  for (let i = 0; i < 3; i++) {
    produtos.push(createVector(random(100, 300), random(50, 350)));
  }

  // Obstáculos
  for (let i = 0; i < 5; i++) {
    obstaculos.push(createVector(random(200, 600), random(50, 350)));
  }
}

function draw() {
  background(150, 200, 150); // campo verde

  // Cidade
  fill(180);
  rect(700, 100, 80, 200);
  fill(0);
  text("CIDADE", 740, 95);

  // Produtos
  fill("gold");
  for (let p of produtos) {
    ellipse(p.x, p.y, 20);
  }

  // Obstáculos
  fill("gray");
  for (let o of obstaculos) {
    rect(o.x, o.y, 30, 30);
  }

  trator.mover();
  trator.mostrar();

  checkColeta();
  checkEntrega();
  checkColisao();

  // Festa
  if (festaAtiva) {
    animarFesta();
    festaTimer--;
    if (festaTimer <= 0) {
      festaAtiva = false;
    }
  }

  // Pontuação
  fill(0);
  textSize(16);
  text("Produtos entregues: " + pontos, 10, 20);
}

// Trator
class Trator {
  constructor() {
    this.pos = createVector(50, 200);
    this.vel = 2;
    this.carregando = false;
  }

  mover() {
    if (keyIsDown(LEFT_ARROW)) this.pos.x -= this.vel;
    if (keyIsDown(RIGHT_ARROW)) this.pos.x += this.vel;
    if (keyIsDown(UP_ARROW)) this.pos.y -= this.vel;
    if (keyIsDown(DOWN_ARROW)) this.pos.y += this.vel;
    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);
  }

  mostrar() {
    fill(this.carregando ? "orange" : "blue");
    rect(this.pos.x - 15, this.pos.y - 15, 30, 30);
  }
}

function checkColeta() {
  for (let i = produtos.length - 1; i >= 0; i--) {
    if (!trator.carregando && dist(trator.pos.x, trator.pos.y, produtos[i].x, produtos[i].y) < 20) {
      trator.carregando = true;
      produtos.splice(i, 1);
    }
  }
}

function checkEntrega() {
  if (trator.carregando && trator.pos.x > 700 && trator.pos.y > 100 && trator.pos.y < 300) {
    pontos++;
    trator.carregando = false;
    festaAtiva = true;
    festaTimer = 60;
    produtos.push(createVector(random(100, 300), random(50, 350))); // novo produto surge
  }
}

function checkColisao() {
  for (let o of obstaculos) {
    if (dist(trator.pos.x, trator.pos.y, o.x + 15, o.y + 15) < 25) {
      trator.pos = createVector(50, 200); // volta pro início
      trator.carregando = false;
    }
  }
}

function animarFesta() {
  for (let i = 0; i < 10; i++) {
    fill(random(255), random(255), random(255));
    ellipse(740 + random(-30, 30), 200 + random(-30, 30), random(5, 15));
  }
}