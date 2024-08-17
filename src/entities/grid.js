import { int, pick } from '../utils/random-utils.js';
import { Square } from './square.js';


const MAX_ELEMENTS = 13;

export class Grid {
    constructor(element, initialSquares) {
        this.squares = [];
        this.indexedSquares = {};
        this.element = element;
        [...Array(initialSquares - 3)].forEach(_ => this.newSquare());
        this.newSquare(MAX_ELEMENTS);
        this.newSquare(int(-12, 12));
        this.newSquare(int(-12, 12));
    }

    getRow(y) {
        // A row is all the squares with the same y
        return this.squares.filter(s => s.y === y).sort(s => s.y);
    }

    getColumn(x) {
        // A column is all the squares with the same x
        return this.squares.filter(s => s.x === x).sort(s => s.x);
    }

    get rows() {
        return [...Array(MAX_ELEMENTS)].map((_, i) => this.getRow(i));
    }

    get columns() {
        return [...Array(MAX_ELEMENTS)].map((_, i) => this.getColumn(i));
    }

    isFull() {
        return this.squares.length === MAX_ELEMENTS * MAX_ELEMENTS;
    }

    calculateFreePositions() {
        const takenPositions = Object.keys(this.indexedSquares);
        const freePositions = [];
        for (let x = 0; x < MAX_ELEMENTS; x++) {
            for (let y = 0; y < MAX_ELEMENTS; y++) {
                if (!takenPositions.includes(`${x}-${y}`)) {
                    freePositions.push([x, y]);
                }
            }
        }
        return freePositions;
    }

    newSquare(nr) {
        if (this.isFull()) {
            return;
        }
        const [x, y] = pick(...this.calculateFreePositions());
        const s = new Square(x, y, nr || int(-MAX_ELEMENTS, MAX_ELEMENTS)).div(this.element);
        this.squares.push(s);
        this.indexedSquares[`${x}-${y}`] = s;
        return s;
    }

    reIndex() {
        this.squares = this.squares.filter(s => s.number !== null);
        this.indexedSquares = {};
        this.squares.forEach(s => {
            this.indexedSquares[`${s.x}-${s.y}`] = s;
        });
    }

    reDraw() {
        this.squares.forEach(s => s.draw());
    }

    moveUp() {
        console.log("moveUp");
        this.columns.forEach(column => {
            let lastWall = -1;
            let lastSquare = null;
            column.forEach(square => {
                if (square.number === MAX_ELEMENTS) {
                    lastWall = square.y;
                    lastSquare = null;
                } else {
                    if (lastSquare) {
                        lastSquare.merge(square);
                    } else {
                        square.y = lastWall + 1;
                        lastSquare = square;
                    }
                }
            });
        });
        this.reIndex();
        this.newSquare();
        this.reDraw();
    }

    moveDown() {
        console.log("moveDown");
        this.columns.forEach(column => {
            let lastWall = MAX_ELEMENTS;
            let lastSquare = null;
            column.reverse().forEach(square => {
                if (square.number === MAX_ELEMENTS) {
                    lastWall = square.y;
                    lastSquare = null;
                } else {
                    if (lastSquare) {
                        lastSquare.merge(square);
                    } else {
                        square.y = lastWall - 1;
                        lastSquare = square;
                    }
                }
            });
        });
        this.reIndex();
        this.newSquare();
        this.reDraw();
    }

    moveLeft() {
        console.log("moveLeft");
        this.rows.forEach(row => {
            let lastWall = -1;
            let lastSquare = null;
            row.forEach(square => {
                if (square.number === MAX_ELEMENTS) {
                    lastWall = square.x;
                    lastSquare = null;
                } else {
                    if (lastSquare) {
                        lastSquare.merge(square);
                    } else {
                        square.x = lastWall + 1;
                        lastSquare = square;
                    }
                }
            });
        });
        this.reIndex();
        this.newSquare();
        this.reDraw();
    }

    moveRight() {
        console.log("moveRight");
        this.rows.forEach(row => {
            let lastWall = MAX_ELEMENTS;
            let lastSquare = null;
            row.reverse().forEach(square => {
                if (square.number === MAX_ELEMENTS) {
                    lastWall = square.x;
                    lastSquare = null;
                } else {
                    if (lastSquare) {
                        lastSquare.merge(square);
                    } else {
                        square.x = lastWall - 1;
                        lastSquare = square;
                    }
                }
            });
        });
        this.reIndex();
        this.newSquare();
        this.reDraw();
    }
}