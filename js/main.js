const basic_title = "커플게임";
const bombPic = $("#bomb-pic");
const bombNum = $("#bomb-num");
const skillZone = $("#skill-zone");
const startBtn = $("#start-btn");
const closeBtn = $("#close-btn");
const menuScore = $("#menu-score");
const lifeBar = $("#life");
const couples = [
  "발규하민",
  "민주혹기",
  "텅텅준우",
  "지영근호",
  "가현재무",
  "호퍼서진",
  "유비커플",
];
const firstBomb = 2;
const basicBoyfriendPercent = 30;
let boyfriendPercent = basicBoyfriendPercent;
let character = 0;
let boys = [];
let animation;
let score = 0;
let last_score = 0;
let bomb = firstBomb;
let skillCool = 10;
let playing = false;
let pause = false;
let onSkill = false;
let status = {
  immortal: false,
  lovely: false,
  weak: false,
  superHamin: false,
  invisible: false,
};
let life;

// Canvas 설정
let canvas = document.getElementById("character");
let ctx = canvas.getContext("2d");

canvas.width = 560;
canvas.height = 740;

// 창 크기 변경
$(document).ready(function () {
  window.resizeTo(610, 880);
});
// 배경화면 크기 설정
$("body").css({
  backgroundSize: `${canvas.width + 10}px ${canvas.height + 80}px`,
});

// 폭탄 위치, 크기 설정
bombPic.css({
  height: canvas.height * 0.6,
  width: canvas.width * 0.8,
  top: canvas.height * 0.25,
  left: canvas.width * 0.11,
});
bombPic.children("img").css({
  height: canvas.height * 0.6,
  width: canvas.width * 0.8,
});

// 폭탄 숫자 위치 설정
$("#bomb").css({ top: canvas.height + 38 });

// 스킬 존 설정
skillZone.css({
  top: canvas.height + 38,
  left: canvas.width - 220,
});

// 오디오 설정
$("#audio").css({
  top: canvas.height + 48,
  left: canvas.width - 125,
});

// const bgmBtn = document.querySelector("#bgm-btn");
const bombElem = document.querySelector("#bomb-effect");
const gameOverElem = document.querySelector("#gameover");
const immortalElem = document.querySelector("#inval");
const pointElem = document.querySelector("#point");
const skillElem = document.querySelector("#skill");
const startElem = document.querySelector("#start");
const bgmElem = document.querySelector("#bgm");
const lifeElem = document.querySelector("#life-lost");

// const AudioContext = window.AudioContext;
// const audioCtx = new AudioContext();

// 효과음 설정
function playSound(elem) {
  if (elem.paused) {
    elem.play();
  } else {
    elem.pause();
    elem.currentTime = 0;
    elem.play();
  }
}

// bgm on
function bgmOn(src = "basic") {
  bgmElem.src = `audio/bgm/${src}.mp3`;
  bgmElem.currentTime = 0;
  bgmElem.play();
}
// document.querySelector("#bgm-btn").addEventListener("click", bgmOn);

// 폭탄 보여주기
const showBomb = () => {
  bombPic.css("opacity", "0.7");
  playSound(bombElem);
  changeBombNum();
  setTimeout(() => {
    bombPic.css("opacity", "0");
  }, 1000);
};

// 폭탄 숫자 바꾸기
function changeBombNum() {
  bombNum.html(`${bomb}개`);
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
  if (character >= 0) {
    $("title").html(basic_title + " <<" + couples[parseInt(character)] + ">>");
    $(".favicon").attr("href", `img/girl/${character}.png`);
    switch (character) {
      case 0:
        life = 1;
        skillElem.src = "audio/skill/bakka.mp3";
        break;
      case 1:
        life = 1;
        if (Math.random() >= 0.5) {
          skillElem.src = "audio/skill/siden.mp3";
        } else {
          skillElem.src = "audio/skill/ohohoh.mp3";
        }
        break;
      case 2:
        life = 1;
        skillElem.src = "audio/skill/tt.mp3";
        break;
      case 3:
        life = 2;
        skillElem.src = "audio/skill/mamot.mp3";
        break;
      case 4:
        life = 1;
        skillElem.src = "audio/skill/baby.mp3";
        break;
      case 5:
        life = 1;
        skillElem.src = "audio/skill/squid.mp3";
        break;
      case 6:
        life = 1;
        skillElem.src = "audio/skill/ys.mp3";
        break;
      default:
        life = 1;
        skillElem.src = "audio/skill.mp3";
        break;
    }
  } else {
    $("title").html(basic_title);
  }
});

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
  {
    name: "하민",
    size: 70,
    speed: 3,
    getPoint: 5,
    bombPoint: 50,
    img: "img/girl/0.png",
    cool: 15,
    skill: () => {
      playSound(skillElem);
      resetSkillCool();
      haminSkill();
    },
  },
  {
    name: "민주",
    size: 80,
    speed: 4,
    getPoint: 4,
    bombPoint: 50,
    img: "img/girl/1.png",
    cool: 15,
    skill: () => {
      playSound(skillElem);
      resetSkillCool();
      minjuSkill();
    },
  },
  {
    name: "텅텅",
    size: 65,
    speed: 3,
    getPoint: 5,
    bombPoint: 20,
    img: "img/girl/2.png",
    cool: 25,
    skill: () => {
      playSound(skillElem);
      resetSkillCool();
      ttSkill();
    },
  },
  {
    name: "쿠쿠",
    size: 80,
    speed: 2,
    getPoint: 8,
    bombPoint: 50,
    img: "img/girl/3.png",
    cool: 7,
    skill: () => {
      playSound(skillElem);
      resetSkillCool();
      kukuSkill();
    },
  },
  {
    name: "우앵",
    size: 65,
    speed: 3,
    getPoint: 5,
    bombPoint: 50,
    img: "img/girl/4.png",
    cool: 30,
    skill: () => {
      playSound(skillElem);
      resetSkillCool();
      uengSkill();
    },
  },
  {
    name: "쭈꾸미",
    size: 65,
    speed: 4,
    getPoint: 5,
    bombPoint: 50,
    img: "img/girl/5.png",
    cool: 25,
    skill: () => {
      playSound(skillElem);
      resetSkillCool();
      squidSkill();
    },
  },
  {
    name: "유덕화",
    size: 75,
    speed: 3,
    getPoint: 7,
    bombPoint: 50,
    img: "img/girl/6.png",
    cool: 20,
    skill: () => {
      playSound(skillElem);
      resetSkillCool();
      yunseoSkill();
    },
  },
];
const boy_stat = [
  { name: "규하", size: 60, speed: 5, img: "img/boy/0.png" },
  { name: "혹기", size: 65, speed: 3, img: "img/boy/1.png" },
  { name: "준우", size: 70, speed: 2, img: "img/boy/2.png" },
  { name: "근호", size: 75, speed: 2, img: "img/boy/3.png" },
  { name: "재무", size: 60, speed: 3, img: "img/boy/4.png" },
  { name: "호퍼", size: 60, speed: 4, img: "img/boy/5.png" },
  { name: "현준", size: 65, speed: 3, img: "img/boy/6.png" },
];

class Girl {
  constructor(char) {
    this.width = girl_stat[char].size;
    this.height = girl_stat[char].size;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height - 10;
    this.char = char;
    this.img = new Image();
    this.speed = girl_stat[char].speed;
    this.get_score = girl_stat[char].getPoint;
    this.bomb_score = girl_stat[char].bombPoint;
    this.name = girl_stat[char].name;
    this.img.src = girl_stat[char].img;
    this.skill = girl_stat[char].skill;
    this.cool = girl_stat[char].cool;
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
    this.name = boy_stat[char].name;
    this.width = boy_stat[char].size;
    this.height = boy_stat[char].size;
    this.char = char;
    this.speed = boy_stat[char].speed;
    this.img = new Image();
    this.img.src = boy_stat[char].img;
  }
  draw() {
    // ctx.fillStyle = "red";
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

let girl = new Girl(character);

// 메뉴 보기 버튼
$("#show-menu").on("click", () => {
  if (playing) {
    pause = true;
    playing = false;
    bgmElem.pause();
  } else if (pause) {
    pause = false;
    playing = true;
    bgmElem.play();
    ExecutePerFrame();
  }
});

// 닫기 버튼을 누를 때
closeBtn.on("click", () => {
  if (pause) {
    pause = false;
    playing = true;
    bgmElem.play();
    ExecutePerFrame();
  }
});

// Start 버튼을 누를 때
startBtn.on("click", () => {
  playSound(startElem);
  startBtn.html("다시시작");
  girl = new Girl(character);
  bgmOn();
  resetGame();
  playing = true;
  ExecutePerFrame();
  changeBombNum();
});

function ExecutePerFrame() {
  if (playing) {
    animation = requestAnimationFrame(ExecutePerFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    $("#skill-timer").html(`스킬 : ${skillCool}초 남음`);

    // Add boy
    let rand_timer = Math.random();
    if (rand_timer >= 0.965) {
      let char_int =
        Math.floor(Math.random() * 100) > 100 - boyfriendPercent
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

    // life bar renew
    lifeBar.html(`Life ${life}`);

    // menu score
    if (score > 0) {
      menuScore.html(`점수 : ${score}점`);
    } else {
    }
  }
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
  onSkill = false;
  menuScore.html("점수 : 0점");
  for (let key in status) {
    status[key] = false;
  }
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
    if (status.immortal) {
      playSound(immortalElem);
      boys.splice(i, 1);
    } else if (
      (status.invisible && girl.char !== boy.char) ||
      (status.superHamin && boy.char === 0)
    ) {
    } else if (girl.char === boy.char || status.lovely) {
      playSound(pointElem);
      boys.splice(i, 1);
      skillCool = skillCool > 1 ? skillCool - 1 : skillCool;
      score += girl.get_score;
      changeScore();
      if (score - last_score >= girl.bomb_score) {
        bomb++;
        last_score = score;
        if (girl.name === "쿠쿠" && life === 1) {
          life++;
        }
      }
      changeBombNum();
    } else {
      if (life === 2) {
        life--;
        boys.splice(i, 1);
        playSound(lifeElem);
      } else {
        let gameOver = new Promise((resolve) => {
          playSound(gameOverElem);
          resolve();
        });
        gameOver.then(() => {
          playing = false;
          $("#start-btn").html("시작");
          bgmElem.pause();
          bgmElem.currentTime = 0;
        });
      }
    }
  }
}

// 키 입력
document.addEventListener("keydown", function (e) {
  // 김치 폭탄 사용
  if (e.key === "z" || e.key === "Z") {
    if (bomb > 0 && playing === true) {
      bomb -= 1;
      boys = boys.filter((a) => a.char === girl.char);
      showBomb();
    }
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    if (girl.x >= girl.speed * 10) {
      girl.x -= girl.speed * 10;
    } else {
      girl.x = 0;
    }
  } else if (e.key === "Right" || e.key === "ArrowRight") {
    if (girl.x <= canvas.width - girl.speed * 10) {
      girl.x += girl.speed * 10;
    } else {
      girl.x = canvas.width - girl.width;
    }
  } else if (e.key === "x" || e.key === "X") {
    if (skillCool === 0) {
      girl.skill();
    }
  } else if (e.key === "Escape") {
    $("#show-menu").trigger("click");
  }
});

function changeScore() {
  let score_board = document.getElementById("score");
  score_board.innerText = score;
}

setInterval(function () {
  if (skillCool > 0 && playing === true) {
    skillCool--;
  }
}, 1000);

function resetSkillCool() {
  skillCool = girl.cool;
}

function yunseoSkill() {
  if (!onSkill) {
    onSkill = true;
    status.invisible = true;
    girl.speed = 5;
    setTimeout(() => {
      skillZone.addClass("danger");
    }, 4000);
    setTimeout(() => {
      girl.speed = 2;
      status.invisible = false;
    }, 5000);
    setTimeout(() => {
      girl.speed = 3;
      onSkill = false;
      skillZone.removeClass("danger");
      status.invisible = false;
    }, 7000);
  }
}

function squidSkill() {
  if (!onSkill) {
    life = life === 1 ? life + 1 : life;
    onSkill = true;
    girl.speed = 8;
    setTimeout(() => {
      skillZone.addClass("danger");
    }, 3000);
    setTimeout(() => {
      girl.speed = 2;
    }, 4000);
    setTimeout(() => {
      onSkill = false;
      skillZone.removeClass("danger");
      girl.speed = 4;
    }, 6000);
  }
}

function uengSkill() {
  if (!onSkill) {
    onSkill = true;
    boyfriendPercent = 80;
    setTimeout(() => {
      skillZone.addClass("danger");
      boyfriendPercent = 20;
    }, 8000);
    setTimeout(() => {
      onSkill = false;
      skillZone.removeClass("danger");
      boyfriendPercent = basicBoyfriendPercent;
    }, 11000);
  }
}

function kukuSkill() {
  boys.forEach((e) => {
    if (e.y <= 250) {
      e.y = 0;
    } else {
      e.y -= 250;
    }
  });
}

function ttSkill() {
  if (!onSkill) {
    onSkill = true;
    status.lovely = true;
    setTimeout(() => {
      skillZone.addClass("danger");
    }, 2000);
    setTimeout(() => {
      status.lovely = false;
      status.weak = true;
    }, 3000);
    setTimeout(() => {
      onSkill = false;
      skillZone.removeClass("danger");
      status.weak = false;
    }, 5000);
  }
}

function minjuSkill() {
  if (!onSkill) {
    onSkill = true;
    status.immortal = true;
    setTimeout(() => {
      skillZone.addClass("danger");
    }, 3000);
    setTimeout(() => {
      onSkill = false;
      skillZone.removeClass("danger");
      status.immortal = false;
    }, 4000);
  }
}

function haminSkill() {
  if (!onSkill) {
    onSkill = true;
    status.superHamin = true;
    let timer = 0;
    let gyuha = boys.filter((e) => e.char === 0);
    let point = gyuha.length;
    let haminInterval = setInterval(() => {
      if (timer > 20) {
        clearInterval(haminInterval);
      }
      timer++;
      gyuha.forEach((e) => {
        if (e.char === 0) {
          e.x = girl.x;
        }
      });
    }, 100);
    setTimeout(() => {
      skillZone.addClass("danger");
    }, 1000);
    setTimeout(() => {
      onSkill = false;
      status.superHamin = false;
      skillZone.removeClass("danger");
      score += point * 5;
      if (point >= skillCool) {
        skillCool = 0;
      } else {
        skillCool -= point;
      }
    }, 2000);
  }
}
