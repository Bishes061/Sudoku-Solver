// script.js

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
            } else {
                console.error('Failed to fetch puzzle');
            }
        };
        xhrRequest.open('get', 'https://sugoku.onrender.com/board?difficulty=random');
        xhrRequest.send();
    };

    SolvePuzzle.onclick = () => {
        if (SudokuSolver(board, 0, 0, boardSize)) {
            console.log('Sudoku solved');
        } else {
            console.log('No solution exists');
        }
    };

    ResetPuzzle.onclick = () => {
        board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
        FillBoard(board);
    };
});

function check(ch, row, col, boardSize, board) {
    for (let c = 0; c < boardSize; ++c) {
        if (c != col && board[row][c] == ch) {
            return false;
        }
    }

    for (let r = 0; r < boardSize; ++r) {
        if (r != row && board[r][col] == ch) {
            return false;
        }
    }

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
    if (col == boardSize) {
        return SudokuSolver(board, row + 1, 0, boardSize);
    }
    if (row == boardSize) {
        FillBoard(board);
        return true;
    }

    if (board[row][col] == 0) {
        for (let ch = 1; ch <= boardSize; ++ch) {
            if (check(ch, row, col, boardSize, board)) {
                board[row][col] = ch;
                if (SudokuSolver(board, row, col + 1, boardSize)) {
                    return true;
                }
                board[row][col] = 0;
            }
        }
        return false;
    } else {
        if (check(board[row][col], row, col, boardSize, board)) {
            return SudokuSolver(board, row, col + 1, boardSize);
        }
        return false;
    }
}
