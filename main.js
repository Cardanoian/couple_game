let canvas = document.getElementById("character");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

let dino = {
  x: 10,
  y: 200,
  width: 50,
  height: 50,
  direction: true,
  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x - 5, this.y, this.width, this.height);
    // ctx.drawImage(img1, this.x - 5, this.y, this.width, this.height);
  },
};

// let img1 = new Image();
// img1.src = "img/dinosaur.png";
// dino.draw();
// let img2 = new Image();
// img2.src = "img/cactus.png";

class Enemy {
  constructor() {
    this.x = 300;
    this.y = 200;
    this.width = 50;
    this.height = 50;
  }
  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x - 20, this.y, this.width, this.height);
    // ctx.drawImage(img2, this.x - 20, this.y, this.width, this.height);
  }
}

let timer = 0;
let enemies = [];
let jumping = false;
let jump_timer = 0;
let jump_counter = 0;
let animation;
let score = document.getElementById("");

function ExecutePerFrame() {
  animation = requestAnimationFrame(ExecutePerFrame);
  timer++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Add enemy
  if (timer % 180 === 0) {
    let enemy = new Enemy();
    enemies.push(enemy);
    enemies.draw();
  }

  enemies.forEach(function (a, i, o) {
    // a.x < 0 => 제거
    if (a.x < 0) {
      o.splice(i, 1);
      score++;
      changeScore();
    }
    // enemy move and draw
    a.x -= 2;

    collisionCheck(dino, a);
    a.draw();
  });

  // Jump
  if (jumping === true) {
    dino.y -= 2;
    jump_timer++;
  }
  if (jumping === false) {
    if (dino.y < 200) {
      dino.y += 2;
    }
  }
  if (jump_timer > 60) {
    jumping = false;
    jump_timer = 0;
  }
  if (dino.y == 200) {
    jump_counter = 0;
  }

  // Dino Draw
  dino.draw();
}
ExecutePerFrame();

// collision
function collisionCheck(dino, enemy) {
  let x_gap = enemy.x - (dino.x + dino.width) + 3;
  let y_gap = enemy.y - (dino.y + dino.height) + 3;
  if (x_gap < 0 && y_gap < 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(animation);
  }
}

document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    if (jump_counter == 0) {
      jumping = true;
      jump_counter++;
    }
  }
});

function changeScore() {
  let score_board = document.getElementById("score");
  score_board.innerText = score + "";
}
