const basic_title = "커플게임";
let character = 0;

const couples = [
  "발규하민",
  "민주혹기",
  "텅텅준우",
  "지영근호",
  "가현재무",
  "호퍼서진",
  "유비커플",
];

let sel = document.getElementById("select_character");
for (let i = 0; i < couples.length; i++) {
  let node = document.createElement("option");
  node.setAttribute("value", i);
  node.innerText = couples[i];
  sel.appendChild(node);
}

let canvas = document.getElementById("character");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

class Girl {
  constructor() {
    this.x = 10;
    this.y = 200;
    this.width = 50;
    this.height = 50;
  }
  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x - 5, this.y, this.width, this.height);
    // ctx.drawImage(img1, this.x - 5, this.y, this.width, this.height);
  }
}

// let img1 = new Image();
// img1.src = "img/girlsaur.png";
// girl.draw();
// let img2 = new Image();
// img2.src = "img/cactus.png";

class Boy {
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
let boys = [];
let jumping = false;
let jump_timer = 0;
let jump_counter = 0;
let animation;
let score = document.getElementById("");

function ExecutePerFrame() {
  animation = requestAnimationFrame(ExecutePerFrame);
  timer++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Add boy
  if (timer % 180 === 0) {
    let boy = new Boy();
    boys.push(boy);
    boys.draw();
  }

  boys.forEach(function (a, i, o) {
    // a.x < 0 => 제거
    if (a.x < 0) {
      o.splice(i, 1);
      score++;
      changeScore();
    }
    // boy move and draw
    a.x -= 2;

    collisionCheck(girl, a);
    a.draw();
  });

  // Jump
  if (jumping === true) {
    girl.y -= 2;
    jump_timer++;
  }
  if (jumping === false) {
    if (girl.y < 200) {
      girl.y += 2;
    }
  }
  if (jump_timer > 60) {
    jumping = false;
    jump_timer = 0;
  }
  if (girl.y == 200) {
    jump_counter = 0;
  }

  // girl Draw
  girl.draw();
}
ExecutePerFrame();

// collision
function collisionCheck(girl, boy) {
  let x_gap = boy.x - (girl.x + girl.width) + 3;
  let y_gap = boy.y - (girl.y + girl.height) + 3;
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
