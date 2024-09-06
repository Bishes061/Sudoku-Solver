var cellSize = 3;
var boardSize = 9;

var arr = [];
for (var i = 0; i < boardSize; i++) {
    arr[i] = [];
    for (var j = 0; j < boardSize; j++) {
        arr[i][j] = document.createElement('div');
        arr[i][j].id = i * boardSize + j;
        document.getElementById('sudoku-grid').appendChild(arr[i][j]);
    }
}

var board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));

// Bitmasks for row, column, and grid
var takenRow = Array(boardSize).fill(0);
var takenCol = Array(boardSize).fill(0);
var takenGrid = Array.from({ length: cellSize }, () => Array(cellSize).fill(0));

var ans = 0;

function FillBoard(board) {
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            arr[i][j].innerText = board[i][j] !== 0 ? board[i][j] : '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let GetPuzzle = document.getElementById('GetPuzzle');
    let SolvePuzzle = document.getElementById('SolvePuzzle');
    let ResetPuzzle = document.getElementById('ResetPuzzle');

    GetPuzzle.onclick = function () {
        var xhrRequest = new XMLHttpRequest();
        xhrRequest.onload = function () {
            if (xhrRequest.status === 200) {
                var response = JSON.parse(xhrRequest.response);
                console.log(response);
                board = response.board;
                FillBoard(board);
                initializeBitmasks(board);
            } else {
                console.error('Failed to fetch puzzle');
            }
        };
        xhrRequest.open('get', 'https://sugoku.onrender.com/board?difficulty=random');
        xhrRequest.send();
    };

    SolvePuzzle.onclick = () => {
        if (rec(0, 0)) {
            console.log('Sudoku solved');
        } else {
            console.log('No solution exists');
        }
    };

    ResetPuzzle.onclick = () => {
        board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
        FillBoard(board);
        resetBitmasks();
    };
});

function initializeBitmasks(board) {
    resetBitmasks();
    for (let i = 0; i < boardSize; ++i) {
        for (let j = 0; j < boardSize; ++j) {
            let ch = board[i][j];
            if (ch !== 0) {
                makemove(ch, i, j);
            }
        }
    }
}

function resetBitmasks() {
    takenRow.fill(0);
    takenCol.fill(0);
    for (let i = 0; i < cellSize; ++i) {
        takenGrid[i].fill(0);
    }
}

function makemove(ch, row, col) {
    board[row][col] = ch;
    takenRow[row] ^= (1 << ch); // Set the (ch)th bit
    takenCol[col] ^= (1 << ch); // Set the (ch)th bit
    takenGrid[Math.floor(row / cellSize)][Math.floor(col / cellSize)] ^= (1 << ch); // Set the (ch)th bit in the 3x3 grid
}

function revertmove(ch, row, col) {
    board[row][col] = 0;
    takenRow[row] ^= (1 << ch); // Clear the (ch)th bit
    takenCol[col] ^= (1 << ch); // Clear the (ch)th bit
    takenGrid[Math.floor(row / cellSize)][Math.floor(col / cellSize)] ^= (1 << ch); // Clear the (ch)th bit in the 3x3 grid
}

function getchoices(row, col) {
    let taken = takenRow[row] | takenCol[col] | takenGrid[Math.floor(row / cellSize)][Math.floor(col / cellSize)];
    let notTaken = ((1 << (boardSize + 1)) - 1) ^ taken; // Invert taken bits to find available choices
    if (notTaken & 1) notTaken ^= 1; // Ensure zero is not a valid choice
    return notTaken;
}

function rec(row, col) {
    if (col == boardSize) {
        return rec(row + 1, 0);
    }

    if (row == boardSize) {
        FillBoard(board);
        return true;
    }

    if (board[row][col] === 0) {
        let chmask = getchoices(row, col);

        for (let ch = 1; ch <= boardSize; ++ch) {
            if (chmask & (1 << ch)) {
                makemove(ch, row, col);
                if (rec(row, col + 1)) {
                    return true;
                }
                revertmove(ch, row, col);
            }
        }
        return false;
    } else {
        return rec(row, col + 1);
    }
}
