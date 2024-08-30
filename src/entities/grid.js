import { int, pick } from '../utils/random-utils.js';
import { Square } from './square.js';


const MAX_ELEMENTS = 5;

const moveLogic = (list, start, increment, axis) => {
    const direction = increment > 0 ? "normal" : "reverse";
    let lastWall = start;
    let lastSquare = null;
    list.forEach(square => {
        if (square.number === 13) {
            lastWall = square[axis];
            lastSquare = square;
        } else {
            if (lastSquare) {
                if(lastSquare.isInt === square.isInt){
                    square[axis] = lastSquare[axis] + increment;
                    if(lastSquare.merge(square)){
                        lastSquare.bump(axis, direction);
                    }
                } else {
                    square[axis] = lastSquare[axis] + increment;
                    lastWall = square[axis];
                    lastSquare = square;
                }
            } else {
                lastSquare = square;
                square[axis] = lastWall + increment;
            }
        }
    });
};

export class Grid {
    constructor(element, initialSquares) {
        this.squares = [];
        this.indexedSquares = {};
        this.element = element;
        [...Array(initialSquares - 3)].forEach(_ => this.newSquare());
        this.newSquare(13);
        this.newSquare(13);
        this.newSquare(-13);
        this.newSquare(int(-13,13)/2);
    }

    getRow(y) {
        // A row is all the squares with the same y
        return this.squares.filter(s => s.y === y).sort((a, b) => a.x - b.x);
    }

    getColumn(x) {
        // A column is all the squares with the same x
        return this.squares.filter(s => s.x === x).sort((a, b) => a.y - b.y);
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

    calculateFreePositions(number) {
        // 13 should never be on the edges
        const adjustment = number === 13 ? 1 : 0;
        const takenPositions = Object.keys(this.indexedSquares);
        const freePositions = [];
        for (let x = adjustment; x < MAX_ELEMENTS-adjustment; x++) {
            for (let y = adjustment; y < MAX_ELEMENTS-adjustment; y++) {
                if (!takenPositions.includes(`${x}-${y}`)) {
                    freePositions.push([x, y]);
                }
            }
        }
        return freePositions;
    }

    newSquare(nr, operator) {
        if (this.isFull()) {
            return;
        }
        const newNumber = nr || Math.round((int(-13, 13)||1) / pick(1, 1, 2, 2, 3) * 10) / 10
        const [x, y] = pick(...this.calculateFreePositions(newNumber));
        const s = new Square(x, y,
            newNumber,
            null //, operator || pick("+", "x")
        ).div(this.element);
        this.squares.push(s);
        this.indexedSquares[`${x}-${y}`] = s;
        s.draw();
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
        this.columns.forEach(column => moveLogic(column, -1, 1, "y"));
        this.reDraw();
        this.reIndex();
        setTimeout(() => {
            this.newSquare();
        }, window.ANIMATION_MS*1.2);
    }

    moveDown() {
        console.log("moveDown");
        this.columns.forEach(column => moveLogic(column.reverse(), MAX_ELEMENTS, -1, "y"));
        this.reDraw();
        this.reIndex();
        setTimeout(() => {
            this.newSquare();
        }, window.ANIMATION_MS*1.2);
    }

    moveLeft() {
        console.log("moveLeft");
        this.rows.forEach(row => moveLogic(row, -1, 1, "x"));
        this.reDraw();
        this.reIndex();
        setTimeout(() => {
            this.newSquare();
        }, window.ANIMATION_MS*1.2);
    }

    moveRight() {
        console.log("moveRight");
        this.rows.forEach(row => moveLogic(row.reverse(), MAX_ELEMENTS, -1, "x"));
        this.reDraw();
        this.reIndex();
        setTimeout(() => {
            this.newSquare();
        }, window.ANIMATION_MS*1.2);
    }
}