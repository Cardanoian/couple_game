const basic_title = "커플게임";
const firstBomb = 10;
const bombPic = $("#bomb-pic");
const couples = [
  "발규하민",
  "민주혹기",
  "텅텅준우",
  "지영근호",
  "가현재무",
  "호퍼서진",
  "유비커플",
];
let character = 0;
let boys = [];
let animation;
let score = 0;
let last_score = 0;
let bomb = firstBomb;
let skillCool = 10;
let boyfriendPercent = 74;
let playing = false;

// Canvas 설정
let canvas = document.getElementById("character");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth > 900 ? 800 : window.innerWidth - 100;
canvas.height = window.innerHeight > 800 ? 800 : window.innerHeight - 100;

// 배경화면 크기 설정
$("body").css({
  backgroundSize: `${window.innerWidth}px ${window.innerHeight}px`,
});

// 폭탄 위치, 크기 설정
bombPic.css({
  height: canvas.height * 0.6,
  width: canvas.width * 0.8,
  top: canvas.height * 0.2,
  left: canvas.width * 0.2,
});
bombPic.children("img").css({
  height: canvas.height * 0.6,
  width: canvas.width * 0.8,
});

// 스킬 존 설정
$("#skill-zone").css({
  top: window.innerHeight - 70,
  left: window.innerWidth / 2 - 20,
});

// 오디오 설정
$("#audio").css({
  top: window.innerHeight - 45,
  left: window.innerWidth - 120,
});

const bgmBtn = document.querySelector("#bgm-btn");
const soundElem = document.querySelector("#sound");
const bgmElem = document.querySelector("#bgm");
let allowAudio = false;

const AudioContext = window.AudioContext;
const audioCtx = new AudioContext();

// 효과음 설정
function playSound(occasion) {
  if (soundElem.paused) {
    soundElem.src = `audio/${occasion}.mp3`;
    soundElem.play();
  } else {
    soundElem.src = `audio/${occasion}.mp3`;
    soundElem.pause();
    soundElem.currentTime = 0;
    soundElem.play();
  }
}

// bgm btn 설정
function pressBgmBtn() {
  if (bgmElem.paused) {
    allowAudio = true;
    bgmElem.play();
    bgmBtn.textContent = "소리끄기";
  } else {
    allowAudio = false;
    bgmElem.pause();
    bgmElem.currentTime = 0;
    bgmBtn.textContent = "소리켜기";
  }
}
document.querySelector("#bgm-btn").addEventListener("click", pressBgmBtn);

// 폭탄 보여주기
const showBomb = () => {
  bombPic.css("opacity", "0.7");
  playSound("bomb");
  changeBombNum();
  setTimeout(() => {
    bombPic.css("opacity", "0");
  }, 1000);
};

// 폭탄 숫자 바꾸기
function changeBombNum() {
  $("#bomb-num").html(bomb);
}

// 선택지 만들기
function makeOptions() {
  let sel = document.getElementById("select-character");
  for (let i = 0; i < couples.length; i++) {
    let node = document.createElement("option");
    node.setAttribute("value", i + "");
    node.innerText = couples[i];
    sel.appendChild(node);
  }
}

makeOptions();
$("#select-character").on("change", function (e) {
  character = parseInt(e.target.options[e.target.selectedIndex].value);
  console.log(character);
  if (character >= 0) {
    $("title").html(basic_title + " <<" + couples[parseInt(character)] + ">>");
    $(".favicon").attr("href", `img/girl/${character}.png`);
  } else {
    $("title").html(basic_title);
  }
});
$("#bomb-num").html(`${bomb}개`);

// 배경화면 설정
const bg = {
  width: canvas.width,
  height: canvas.height,
  x: 0,
  y: 0,
  img: new Image(),
  draw() {
    // ctx.fillStyle = "green";
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  },
};

bg.img.src = "img/bg.png";

// 여학생 능력치
const girl_stat = [
  //width, height, speed, get_score, bomb_score
  [
    70,
    70,
    3,
    5,
    50,
    "img/girl/0.png",
    () => {
      resetSkillCool();
      boys.forEach((e) => {
        if (e.char === 0) {
          e.x = girl.x;
        }
      });
    },
    15,
  ], // 하민
  [
    80,
    80,
    4,
    4,
    50,
    "img/girl/1.png",
    () => {
      resetSkillCool();
      girl.char = 998;
      setTimeout(() => {
        girl.char = 1;
      }, 4000);
    },
    20,
  ], // 민주
  [
    65,
    65,
    3,
    5,
    20,
    "img/girl/2.png",
    () => {
      resetSkillCool();
      girl.char = 1000;
      setTimeout(() => {
        girl.char = 999;
      }, 3000);
      setTimeout(() => {
        girl.char = 2;
      }, 5000);
    },
    30,
  ], // 텅텅
  [
    80,
    80,
    2,
    10,
    50,
    "img/girl/3.png",
    function () {
      resetSkillCool();
      boys.forEach((e) => {
        e.y -= 150;
      });
    },
    12,
  ], // 지영
  [
    65,
    65,
    3,
    5,
    50,
    "img/girl/4.png",
    function () {
      resetSkillCool();
      boyfriendPercent = 19;
      setTimeout(() => {
        boyfriendPercent = 89;
      }, 8000);
      setTimeout(() => {
        boyfriendPercent = 74;
      }, 11000);
    },
    20,
  ], // 가현
  [
    65,
    65,
    4,
    5,
    50,
    "img/girl/5.png",
    () => {
      resetSkillCool();
      girl.speed = 8;
      setTimeout(() => {
        girl.speed = 3;
      }, 4000);
      setTimeout(() => {
        girl.speed = 4;
      }, 8000);
    },
    15,
  ], //  서진
  [
    75,
    75,
    3,
    7,
    50,
    "img/girl/6.png",
    () => {
      resetSkillCool();
      girl.width = 20;
      girl.height = 20;
      setTimeout(() => {
        girl.width = 75;
        girl.height = 75;
        girl.char = 997;
      }, 6000);
      setTimeout(() => {
        girl.char = 6;
      }, 6500);
    },
    11,
  ], // 유덕
];
const boy_stat = [
  //width, height, speed
  [60, 60, 4, "img/boy/0.png"], // 규하
  [65, 65, 3, "img/boy/1.png"], // 혹기
  [70, 70, 2, "img/boy/2.png"], // 준우
  [75, 75, 1, "img/boy/3.png"], // 근호
  [60, 60, 3, "img/boy/4.png"], // 재무
  [60, 60, 4, "img/boy/5.png"], // 호퍼
  [65, 65, 3, "img/boy/6.png"], // 현준
];

class Girl {
  constructor(char) {
    console.log(char);
    this.width = girl_stat[char][0];
    this.height = girl_stat[char][1];
    this.x = canvas.width / 2 + this.width / 2;
    this.y = canvas.height - this.height - 10;
    this.char = char;
    this.img = new Image();
    this.speed = girl_stat[char][2];
    this.get_score = girl_stat[char][3];
    this.bomb_score = girl_stat[char][4];
    this.name = couples[char];
    this.img.src = girl_stat[char][5];
    this.skill = girl_stat[char][6];
    this.cool = girl_stat[char][7];
    console.log(this);
  }
  draw() {
    // ctx.fillStyle = "green";
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

class Boy {
  constructor(x, char) {
    this.x = x;
    this.y = 10;
    this.width = boy_stat[char][0];
    this.height = boy_stat[char][1];
    this.char = char;
    this.speed = boy_stat[char][2];
    this.img = new Image();
    this.img.src = boy_stat[char][3];
    console.log(this);
  }
  draw() {
    // ctx.fillStyle = "red";
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

$("#bomb").css({ top: canvas.height + 45 });

let girl = new Girl(character);

// Start 버튼을 누를 때
$("#start-btn").on("click", () => {
  playSound("start");
  girl = new Girl(character);
  resetGame();
  ExecutePerFrame();
  changeBombNum();
  playing = true;
});

function ExecutePerFrame() {
  animation = requestAnimationFrame(ExecutePerFrame);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  showSkillCool();

  let rand_timer = Math.random();
  // Add boy
  if (rand_timer >= 0.98) {
    let char_int =
      Math.floor(Math.random() * 100) > boyfriendPercent
        ? girl.char
        : Math.floor(Math.random() * 7);
    let x = Math.floor(Math.random() * 400);
    let boy = new Boy(x, char_int);
    boys.push(boy);
    // boys.draw();
    boy.draw();
  }

  boys.forEach(function (a, i, o) {
    // 바닥에 닿으면 => 제거
    if (a.y > canvas.height - a.height) {
      o.splice(i, 1);
    }

    // boy move and draw
    a.y += a.speed;

    collisionCheck(a, i);
    a.draw();
  });

  // girl Draw
  girl.draw();
}

// 게임 리셋
function resetGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cancelAnimationFrame(animation);
  score = 0;
  boys = [];
  bomb = firstBomb;
  skillCool = girl.cool;
  $("#bomb-pic").css({ opacity: "0" });
  changeScore();
}

// collision
function collisionCheck(boy, i) {
  let x_gap = girl.x - boy.x;
  let y_gap = girl.y - boy.y;
  if (
    ((x_gap < boy.width - 20 && x_gap > 0) ||
      (x_gap < 0 && -x_gap < girl.width - 20)) &&
    y_gap < boy.height - 20
  ) {
    if (girl.char === boy.char || girl.char === 1000) {
      playSound("point");
      boys.splice(i, 1);
      skillCool = skillCool > 1 ? skillCool - 1 : skillCool;
      score += girl.get_score;
      changeScore();
      changeBombNum();
      if (score - last_score >= girl.bomb_score) {
        bomb++;
        last_score = score;
      }
    } else if (girl.char === 998) {
      playSound("inval");
      boys.splice(i, 1);
    } else if (girl.char === 997) {
    } else {
      let gameOver = new Promise((resolve) => {
        playSound("gameover");
        resolve();
      });
      gameOver.then(() => {
        resetGame();
        showAlert();
      });
    }
  }
}

// 키 입력
document.addEventListener("keydown", function (e) {
  // 김치 폭탄 사용
  if (e.key === "z" || e.key === "Z") {
    if (bomb > 0 && playing === true) {
      bomb -= 1;
      boys = boys.filter((e) => e.char === 0);

      // boys.forEach(function (e, i, o) {
      //   if (e.char !== girl.char) {
      //     o.splice(i, 1);
      //   }
      // });
      showBomb();
    }
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    if (girl.x >= girl.speed * 10) {
      girl.x -= girl.speed * 10;
    }
  } else if (e.key === "Right" || e.key === "ArrowRight") {
    if (girl.x <= canvas.width - girl.speed * 10) {
      girl.x += girl.speed * 10;
    }
  } else if (e.key === "x" || e.key === "X") {
    if (skillCool === 0) {
      girl.skill();
    }
  }
});

function changeScore() {
  let score_board = document.getElementById("score");
  score_board.innerText = score;
}

function showAlert() {
  alert(`Game Over!`);
}

setInterval(function () {
  if (skillCool > 0 && playing === true) {
    skillCool--;
  }
}, 1000);

function showSkillCool() {
  $("#skill-timer").html(`쿨 : ${skillCool}`);
}

function resetSkillCool() {
  skillCool = girl.cool;
}
