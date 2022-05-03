/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
const grid = document.querySelector('.grid');
const winnerOuter = document.querySelector('.winner-outer');
const loserOuter = document.querySelector('.loser-outer');
const resetButton = document.querySelector('.reset');
const SIZE = 10;
const BOMB_AMOUNT = 18;
let squares = [];
let isGameOver = false;
let flag = 0;

// Make a function that resets everything
function resetBoard() {
  // Delete all divs
  squares.forEach((e) => {
    grid.removeChild(e);
  });
  // Reset Parameters
  flag = 0;
  squares = [];
  // Remake board
  resetButton.innerHTML = '😊';
  createBoard();
  isGameOver = false;
}

// close the loser and winner message
function closeModals() {
  if (winnerOuter.classList.contains('open')) {
    winnerOuter.classList.remove('open');
  } else {
    loserOuter.classList.remove('open');
  }
}

// check neighboring squares once square is clicked
function checkSquare(square, currentId) {
  const isLeftEdge = currentId % SIZE === 0;
  const isRightEdge = currentId % SIZE === SIZE - 1;

  function clickNewSquare(newId) {
    const newSquare = document.getElementById(newId);
    click(newSquare);
  }

  setTimeout(() => {
    if (!isLeftEdge) {
      const newId = parseInt(currentId) - 1;
      clickNewSquare(newId);
    }
    if (currentId > SIZE - 1 && !isRightEdge) {
      const newId = parseInt(currentId) + 1 - SIZE;
      clickNewSquare(newId);
    }
    if (currentId >= SIZE) {
      const newId = parseInt(currentId) - SIZE;
      clickNewSquare(newId);
    }
    if (currentId > SIZE && !isLeftEdge) {
      const newId = parseInt(currentId) - 1 - SIZE;
      clickNewSquare(newId);
    }
    if (!isRightEdge) {
      const newId = parseInt(currentId) + 1;
      clickNewSquare(newId);
    }
    if (currentId < SIZE ** 2 - SIZE) {
      const newId = parseInt(currentId) + SIZE;
      clickNewSquare(newId);
    }
    if (currentId < SIZE ** 2 - SIZE && !isLeftEdge) {
      const newId = parseInt(currentId) + SIZE - 1;
      clickNewSquare(newId);
    }
    if (currentId < SIZE ** 2 - SIZE && !isRightEdge) {
      const newId = parseInt(currentId) + SIZE + 1;
      clickNewSquare(newId);
    }
  }, 10);
}

// Coloring each number
function coloringNumbers(square, total) {
  const number = parseInt(total);
  if (number === 1) {
    square.style.color = '#0075F2';
  }
  if (number === 2) {
    square.style.color = 'green';
  }
  if (number === 3) {
    square.style.color = '#F45B69';
  }
  if (number === 4) {
    square.style.color = '#171389';
  }
  if (number === 5) {
    square.style.color = '#8C1C13';
  }
  if (number === 6) {
    square.style.color = '#18a999';
  }
  if (number === 7) {
    square.style.color = 'black';
  }
  if (number === 8) {
    square.style.color = '#73648A';
  }
}

// Game Over
function gameOver() {
  isGameOver = true;

  // show all bombs and numbers
  squares.forEach((square) => {
    const total = square.getAttribute('data');
    if (square.classList.contains('bomb')) {
      square.innerHTML = '💩';
    }
    if (square.classList.contains('empty') && parseInt(total) !== 0) {
      square.innerHTML = total;
      coloringNumbers(square, total);
    }
  });
}

// click on square actions
function click(square) {
  const currentId = square.id;
  checkForWin();
  if (isGameOver) return;
  if (square.classList.contains('checked') || square.classList.contains('flag'))
    return;
  if (square.classList.contains('bomb')) {
    resetButton.innerHTML = '😒';
    loserOuter.classList.add('open');
    gameOver();
  } else {
    const total = square.getAttribute('data');
    if (parseInt(total) !== 0) {
      square.classList.add('checked');
      square.innerHTML = total;
      coloringNumbers(square, total);
      return;
    }
    checkSquare(square, currentId);
  }
  square.classList.add('checked');
}

// create board
function createBoard() {
  // We need to make a shuffled array of bombs and empties.
  const bombArray = Array(BOMB_AMOUNT).fill('bomb');
  const emptyArray = Array(SIZE * SIZE - BOMB_AMOUNT).fill('empty');
  const gameArray = [...bombArray, ...emptyArray];
  const shuffleArray = gameArray.sort(() => Math.random() - 0.5);

  shuffleArray.forEach((e, index) => {
    const square = document.createElement('div');
    square.setAttribute('id', index);
    square.classList.add(e);
    grid.appendChild(square);
    squares.push(square);

    // normal click
    square.addEventListener('click', () => {
      click(square);
    });

    // cntrl and left click
    square.oncontextmenu = function (event) {
      event.preventDefault();
      addFlag(square);
    };
  });
  // add numbers
  squares.forEach((e, index, array) => {
    let total = 0;
    const isLeftEdge = index % SIZE === 0;
    const isRightEdge = index % SIZE === SIZE - 1;

    const isNumber = e.classList.contains('empty');

    function getIndex(tempIndex) {
      const min = 0;
      const max = array.length;
      if (tempIndex < min || tempIndex >= max) {
        return undefined;
      }
      return array[tempIndex];
    }

    if (isNumber) {
      if (!isLeftEdge && getIndex(index - 1)?.classList.contains('bomb'))
        total++;
      if (!isRightEdge && getIndex(index + 1)?.classList.contains('bomb'))
        total++;
      if (getIndex(index - SIZE)?.classList.contains('bomb')) total++;
      if (
        !isRightEdge &&
        getIndex(index - SIZE + 1)?.classList.contains('bomb')
      )
        total++;
      if (!isLeftEdge && getIndex(index - SIZE - 1)?.classList.contains('bomb'))
        total++;
      if (getIndex(index + SIZE)?.classList.contains('bomb')) total++;
      if (
        !isRightEdge &&
        getIndex(index + SIZE + 1)?.classList.contains('bomb')
      )
        total++;
      if (!isLeftEdge && getIndex(index + SIZE - 1)?.classList.contains('bomb'))
        total++;
      e.setAttribute('data', total);
    }
  });
}

createBoard();

// add Flag with right click
function addFlag(square) {
  if (isGameOver) return;
  if (!square.classList.contains('checked')) {
    if (!square.classList.contains('flag') && flag < BOMB_AMOUNT) {
      square.classList.add('flag');
      square.innerHTML = '🚩';
      flag++;
      checkForWin();
    } else if (square.classList.contains('flag')) {
      square.classList.remove('flag');
      square.innerHTML = '';
      flag--;
    }
  }
}

// check for win
function checkForWin() {
  let matches = 0;
  let numbersChecked = 1;

  squares.forEach((e, index, array) => {
    if (
      array[index].classList.contains('flag') &&
      array[index].classList.contains('bomb')
    ) {
      matches++;
    }
    if (
      array[index].classList.contains('empty') &&
      array[index].classList.contains('checked')
    ) {
      numbersChecked++;
    }
    if (matches === BOMB_AMOUNT || numbersChecked === SIZE ** 2 - BOMB_AMOUNT) {
      resetButton.innerHTML = '😁';
      winnerOuter.classList.add('open');
      gameOver();
    }
  });
}

resetButton.addEventListener('click', resetBoard);
winnerOuter.addEventListener('click', closeModals);
loserOuter.addEventListener('click', closeModals);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModals();
  }
});
