/*----- constants -----*/
const COLORS = {
  '0': 'white',
  '1': 'purple',
  '-1': 'orange'
};

/*----- app's state (variables) -----*/
let board;  // array of column arrays / elements will hold 1/-1 for the players or 0 -> empty
let turn;   // 1 or -1
let winner; // null -> game in progress; 1/-1 a player has won; 'T' -> Tie

/*----- cached element references -----*/
const btnEl = document.querySelector('button');
const msgEl = document.querySelector('h1');
const markerEls = [...document.querySelectorAll('#markers > div')];

/*----- event listeners -----*/
btnEl.addEventListener('click', init);

document.querySelector('#markers')
  .addEventListener('click', handleMove);

/*----- functions -----*/
init();
// Initialize all state, then call render()
function init() {
  // Visualize mapping to DOM by rotating
  // 90 degrees counter-clockwise
  board = [
    [0, 0, 0, 0, 0, 0],  // column 0
    [0, 0, 0, 0, 0, 0],  // column 1
    [0, 0, 0, 0, 0, 0],  // column 2
    [0, 0, 0, 0, 0, 0],  // column 3
    [0, 0, 0, 0, 0, 0],  // column 4
    [0, 0, 0, 0, 0, 0],  // column 5
    [0, 0, 0, 0, 0, 0],  // column 6
  ];
  turn = 1;
  winner = null;
  render();
}

// Update all impacted state, then call render()
function handleMove(evt) {
  // Determine the index of the col clicked
  const colIdx = markerEls.indexOf(evt.target);
  // User miss clicked the section, not a marker
  if (colIdx === -1 || winner) return;
  // Grab the column array
  const colArr = board[colIdx];
  // Find the first 0 in the colArr
  const rowIdx = colArr.indexOf(0);
  // Update the board with who made the turn
  colArr[rowIdx] = turn;
  // Update the turn
  turn *= -1;
  // Update the winner
  winner = getWinner(colIdx, rowIdx);
  render();
}

function render() {
  // ternary expression -> <expression> ? <truthy val> : <falsy val>;
  btnEl.style.visibility = winner ? 'visible' : 'hidden';
  renderBoard();
  renderMessage();
  renderMarkers();
}

function renderMarkers() {
  markerEls.forEach(function(el, colIdx) {
    const showMarker = board[colIdx].includes(0);
    el.style.visibility = showMarker ? 'visible' : 'hidden';
  });
}

function renderMessage() {
  if (winner === 'T') {
    msgEl.innerHTML = "It's a Tie!!!";
  } else if (winner) {
    msgEl.innerHTML = `<span style="color: ${COLORS[winner]}">${COLORS[winner].toUpperCase()}</span> Wins!`;
  } else {
    msgEl.innerHTML = `<span style="color: ${COLORS[turn]}">${COLORS[turn].toUpperCase()}</span>'s Turn`;
  }
}

function renderBoard() {
  board.forEach(function(colArr, colIdx) {
    colArr.forEach(function(playerVal, rowIdx) {
      const divId = `c${colIdx}r${rowIdx}`;  // e.g. "c6r5"
      const divEl = document.getElementById(divId);
      divEl.style.backgroundColor = COLORS[playerVal];
    });
  });
}

function getWinner(colIdx, rowIdx) {
  const winner = checkVertWin(colIdx, rowIdx) || checkHorzWin(colIdx, rowIdx);
  // TODO: Check for tie
  return winner;
}

function checkVertWin(colIdx, rowIdx) {
  const player = board[colIdx][rowIdx];  // 1 or -1
  let count = 1;
  rowIdx--;
  while (rowIdx >= 0 && board[colIdx][rowIdx] === player) {
    count++;
    rowIdx--;
  }
  return count === 4 ? player : null;
}

function checkHorzWin(colIdx, rowIdx) {
  const player = board[colIdx][rowIdx];  // 1 or -1
  let count = 1;
  // Count to the left
  let col = colIdx - 1;
  while (col >= 0 && board[col][rowIdx] === player) {
    count++;
    col--;
  }
  // Count to the right
  col = colIdx + 1
  while (col < board.length && board[col][rowIdx] === player) {
    count++;
    col++;
  }
  return count >= 4 ? player : null;
}
