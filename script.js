const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset");
const msgCon = document.querySelector(".mess");
const msgText = document.querySelector("#msg");
const aiBtn = document.querySelector("#aiMode");

let turn0 = true;
let isAiMode = false;

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (box.innerText === "") {
      if (!isAiMode || (isAiMode && !turn0)) {
        box.innerText = turn0 ? "O" : "X";
        box.disabled = true;
        turn0 = !turn0;
        if (!checkWin() && isAiMode && turn0) {
          setTimeout(makeAiMove, 500);
        }
      }
    }
  });
});

aiBtn.addEventListener("click", () => {
  isAiMode = !isAiMode;
  aiBtn.classList.toggle("active");
  aiBtn.innerText = isAiMode ? "Playing vs AI" : "Play vs AI";
  resetFunc();

  if (isAiMode) {
    turn0 = false;
    msgText.innerText = "You're X, AI is O. Make your move!";
    msgCon.classList.remove("hide");
    setTimeout(() => {
      msgCon.classList.add("hide");
    }, 2000);
  } else {
    turn0 = true;
  }
});

const disableBoxes = () => {
  boxes.forEach(b => b.disabled = true);
};

const enableBoxes = () => {
  boxes.forEach(b => {
    b.disabled = false;
    b.innerText = "";
  });
};

const resetFunc = () => {
  if (isAiMode) {
    turn0 = false;
  } else {
    turn0 = true;
  }
  enableBoxes();
  msgCon.classList.add("hide");
  msgText.innerText = "";
};

const showWin = (winner) => {
  msgText.innerText = winner === "Draw" ? "It's a draw!" : `Congrats! ${winner} has won the game`;
  msgCon.classList.remove("hide");
  disableBoxes();
};

const checkWin = () => {
  for (let patt of winPatterns) {
    const [a, b, c] = patt;
    const v1 = boxes[a].innerText;
    const v2 = boxes[b].innerText;
    const v3 = boxes[c].innerText;

    if (v1 !== "" && v1 === v2 && v2 === v3) {
      showWin(v1);
      return true;
    }
  }

  const allFilled = [...boxes].every(b => b.innerText !== "");
  if (allFilled) {
    showWin("Draw");
    return true;
  }

  return false;
};

const minimax = (board, depth, isMaximizing) => {
  let result = checkWinner(board);
  if (result !== null) {
    if (result === "O") return 10 - depth;
    if (result === "X") return depth - 10;
    if (result === "Draw") return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

const checkWinner = (board) => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }

  if (!board.includes("")) {
    return "Draw";
  }

  return null;
};

const makeAiMove = () => {
  if (checkWin()) return;

  let board = [...boxes].map(box => box.innerText);

  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  if (bestMove !== -1) {
    boxes[bestMove].innerText = "O";
    boxes[bestMove].disabled = true;
    turn0 = !turn0;
    checkWin();
  }
};

resetBtn.addEventListener("click", resetFunc);


const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);

if (savedTheme === 'dark') {
  themeToggle.innerHTML = '<i class="fas fa-moon moon-icon"></i> Theme';
} else {
  themeToggle.innerHTML = '<i class="fas fa-sun sun-icon"></i> Theme';
}

themeToggle.addEventListener('click', () => {
  themeToggle.classList.add('changing');

  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  htmlElement.setAttribute('data-theme', newTheme);

  localStorage.setItem('theme', newTheme);

  if (newTheme === 'dark') {
    themeToggle.innerHTML = '<i class="fas fa-moon moon-icon"></i> Theme';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-sun sun-icon"></i> Theme';
  }

  setTimeout(() => {
    themeToggle.classList.remove('changing');
  }, 500);
});