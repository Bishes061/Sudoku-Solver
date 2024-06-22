// Global variables
var cellSize = 3;

var arr = [];
for (var i = 0; i < 9; i++) {
    arr[i] = [];
    for (var j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);
    }
}

var board = Array.from({ length: 9 }, () => Array(9).fill(0));

function FillBoard(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            arr[i][j].innerText = board[i][j] !== 0 ? board[i][j] : '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let GetPuzzle = document.getElementById('GetPuzzle');
    let SolvePuzzle = document.getElementById('SolvePuzzle');

    GetPuzzle.onclick = function () {
        var xhrRequest = new XMLHttpRequest();
        xhrRequest.onload = function () {
            if (xhrRequest.status === 200) {
                var response = JSON.parse(xhrRequest.response);
                console.log(response);
                board = response.board;
                FillBoard(board);
            } else {
                console.error('Failed to fetch puzzle');
            }
        };
        xhrRequest.open('get', 'https://sugoku.onrender.com/board?difficulty=random');
        // we can change the difficulty of the puzzle; the allowed values of difficulty are easy, medium, hard, and random
        xhrRequest.send();
    };

    SolvePuzzle.onclick = () => {
        if (SudokuSolver(board, 0, 0, 9)) {
            console.log('Sudoku solved');
        } else {
            console.log('No solution exists');
        }
    };
});

function check(ch, row, col, boardSize, board) {
    // Check in a row
    for (let c = 0; c < boardSize; ++c) {
        if (c != col && board[row][c] == ch) {
            return false;
        }
    }

    // Check in a column
    for (let r = 0; r < boardSize; ++r) {
        if (r != row && board[r][col] == ch) {
            return false;
        }
    }

    // Check in square
    let str = Math.floor(row / cellSize) * cellSize;
    let stc = Math.floor(col / cellSize) * cellSize;
    for (let dx = 0; dx < cellSize; ++dx) {
        for (let dy = 0; dy < cellSize; ++dy) {
            if (str + dx == row && stc + dy == col) continue;
            if (board[str + dx][stc + dy] == ch) return false;
        }
    }
    return true;
}

function SudokuSolver(board, row, col, boardSize) {
    // Level is the cell
    if (col == boardSize) {
        return SudokuSolver(board, row + 1, 0, boardSize);
    }
    if (row == boardSize) {
        // Base case
        FillBoard(board);
        return true;
    }

    // Recursive case
    if (board[row][col] == 0) {
        // We need to fill
        for (let ch = 1; ch <= boardSize; ++ch) {
            if (check(ch, row, col, boardSize, board)) {
                // Move
                board[row][col] = ch;
                if (SudokuSolver(board, row, col + 1, boardSize)) {
                    return true;
                }
                board[row][col] = 0;
            }
        }
        return false;
    } else {
        // Pre-filled
        if (check(board[row][col], row, col, boardSize, board)) {
            return SudokuSolver(board, row, col + 1, boardSize);
        }
        return false;
    }
}
