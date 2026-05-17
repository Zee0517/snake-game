// Constants
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

const boardBackground = "#7a6f52";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";

const unitSize = 25;

// Game variables
let running = false;
let gameTimer;

let xVelocity = unitSize;
let yVelocity = 0;

let foodX;
let foodY;

let score = 0;

// Prevent multiple turns in one frame
let directionChanged = false;

let snake = [
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];

// Event listeners
window.addEventListener("keydown", handleKeyPress);

// Initial screen
clearBoard();
createFood();
drawFood();
drawSnake();

ctx.font = "35px VT323";
ctx.fillStyle = "black";
ctx.textAlign = "center";
ctx.fillText("Press SPACE to Start", gameWidth / 2, gameHeight / 2);

// =========================
// KEY HANDLER
// =========================

function handleKeyPress(event) {
  // Start / Restart game
  if (event.code === "Space" && !running) {
    gameStart();
    return;
  }

  changeDirection(event);
}

// =========================
// GAME START
// =========================

function gameStart() {
  running = true;

  score = 0;
  scoreText.textContent = "Score: " + score;

  xVelocity = unitSize;
  yVelocity = 0;

  snake = [
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];

  clearBoard();

  createFood();
  drawFood();
  drawSnake();

  nextTick();
}

// =========================
// GAME LOOP
// =========================

function nextTick() {
  if (running) {
    gameTimer = setTimeout(() => {

      // Allow ONE turn again each frame
      directionChanged = false;

      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();

      nextTick();

    }, 75);

  } else {
    displayGameOver();
  }
}

// =========================
// CHANGE DIRECTION
// =========================

function changeDirection(event) {

  // Prevent multiple turns in same frame
  if (directionChanged) return;

  const keyPressed = event.keyCode;

  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  const goingUp = yVelocity === -unitSize;
  const goingDown = yVelocity === unitSize;
  const goingRight = xVelocity === unitSize;
  const goingLeft = xVelocity === -unitSize;

  switch (true) {

    case keyPressed === LEFT && !goingRight:
      xVelocity = -unitSize;
      yVelocity = 0;
      directionChanged = true;
      break;

    case keyPressed === UP && !goingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      directionChanged = true;
      break;

    case keyPressed === RIGHT && !goingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      directionChanged = true;
      break;

    case keyPressed === DOWN && !goingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      directionChanged = true;
      break;
  }
}

// =========================
// CLEAR BOARD
// =========================

function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

// =========================
// FOOD
// =========================

function createFood() {

  function randomFood(min, max) {
    return (
      Math.round((Math.random() * (max - min) + min) / unitSize) *
      unitSize
    );
  }

  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameHeight - unitSize);
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

// =========================
// MOVE SNAKE
// =========================

function moveSnake() {

  const head = {
    x: snake[0].x + xVelocity,
    y: snake[0].y + yVelocity,
  };

  snake.unshift(head);

  // Food eaten
  if (snake[0].x === foodX && snake[0].y === foodY) {

    score++;
    scoreText.textContent = "Score: " + score;

    createFood();

  } else {
    snake.pop();
  }
}

// =========================
// DRAW SNAKE
// =========================

function drawSnake() {

  snake.forEach((snakePart, index) => {

    // Head color
    if (index === 0) {
      ctx.fillStyle = "#32cd32";
    }

    // Body color
    else {
      ctx.fillStyle = snakeColor;
    }

    ctx.strokeStyle = snakeBorder;

    ctx.fillRect(
      snakePart.x,
      snakePart.y,
      unitSize,
      unitSize
    );

    ctx.strokeRect(
      snakePart.x,
      snakePart.y,
      unitSize,
      unitSize
    );

    // Draw eyes on head only
    if (index === 0) {
      drawEyes(snakePart.x, snakePart.y);
    }
  });
}

// =========================
// DRAW EYES
// =========================

function drawEyes(x, y) {

  ctx.fillStyle = "black";

  // Left eye
  ctx.fillRect(x + 5, y + 5, 4, 4);

  // Right eye
  ctx.fillRect(x + 16, y + 5, 4, 4);
}

// =========================
// GAME OVER CHECK
// =========================

function checkGameOver() {

  switch (true) {

    case snake[0].x < 0:
      running = false;
      break;

    case snake[0].x >= gameWidth:
      running = false;
      break;

    case snake[0].y < 0:
      running = false;
      break;

    case snake[0].y >= gameHeight:
      running = false;
      break;
  }

  // Self collision
  for (let i = 1; i < snake.length; i++) {

    if (
      snake[i].x === snake[0].x &&
      snake[i].y === snake[0].y
    ) {
      running = false;
    }
  }
}

// =========================
// DISPLAY GAME OVER
// =========================

function displayGameOver() {

  clearTimeout(gameTimer);

  ctx.font = "40px VT323";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";

  ctx.fillText(
    "GAME OVER!",
    gameWidth / 2,
    gameHeight / 2 - 20
  );

  ctx.font = "25px VT323";

  ctx.fillText(
    "Press SPACE to Restart",
    gameWidth / 2,
    gameHeight / 2 + 30
  );

  running = false;
}