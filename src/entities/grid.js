import { int, pick } from '../utils/random-utils.js';
import { Note } from '../utils/audio-utils.js';
import { Square } from './square.js';


const MAX_ELEMENTS = 5;

const moveLogic = (list, start, increment, axis) => {
    const direction = increment > 0 ? 'normal' : 'reverse';
    let lastWall = start;
    let lastSquare = null;
    list.forEach(square => {
        if (square.number === 13) {
            lastWall = square[axis];
            lastSquare = square;
        } else {
            if (lastSquare) {
                if (lastSquare.isInt === square.isInt) {
                    square[axis] = lastSquare[axis] + increment;
                    if (lastSquare.merge(square)) {
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
        this.initialSquares = initialSquares;
        this.squares = [];
        this.indexedSquares = {};
        this.element = element;
        this.tutorialPath = null;
        this.tutorialText = null;
        this.inTutorial = false;
        this.tutorialStage = 0;
        this.stats = {
            'Moves': 0,
            'Most 13s': 0,
            'Most Squares': 0
        };
        this.allow = ['left', 'right', 'up', 'down'];
        this.tutorialStages = [
            () => {
                this.allow = ["click"];
                this.tutorialSpotlight(
                    { x: 0, y: 0, w: 0, h: 0 },
                    'Welcome to Warehouse 13. We don\'t have 13 warehouses, it\'s uhm... You\'ll see. Tap or click to continue.');
            },
            () => {
                this.allow = ["click"];
                this.tutorialSpotlight(
                    { x: 0, y: 0, w: 0, h: 0 },
                    'Every time these auto-merging boxes collide, they add up. I know: it makes no sense.');
            },
            () => {
                this.allow = ["click"];
                this.tutorialSpotlight(
                    { x: 0, y: 0, w: 0, h: 0 },
                    'That\'s why the rookies like you get assigned this place.');
            },
            () => {
                this.allow = ["click"];
                const plus13 = this.squares.find(s => s.number === 13);
                this.tutorialSpotlightSquare(plus13, 'These "13" boxes don\'t move.');
            },
            () => {
                this.allow = ["click"];
                const minus13 = this.squares.find(s => s.number === -13);
                this.tutorialSpotlightSquare(minus13, '"-13" boxes can destroy the "13" boxes.');
            },
            () => {
                this.allow = ["click"];
                const intSquare = this.squares.find(s => s.number !== 13 && s.number !== -13 && s.isInt);
                this.tutorialSpotlightSquare(intSquare, 'Boxes with integers only merge with other integer boxes.');
            },
            () => {
                this.allow = ["click"];
                const floatSquare = this.squares.find(s => !s.isInt);
                this.tutorialSpotlightSquare(floatSquare, 'Boxes with floats only merge with other float boxes.');
            },
            () => {
                this.allow = ["right"];
                const minus13 = this.squares.find(s => s.number === -13);
                const plus13 = this.squares.find(s => s.number === 13);
                this.tutorialSpotlightSquares(
                    minus13, plus13,
                    'Swipe right or press the right key to make the "-13" box collide with the "13" box.');
            },
            () => {
                this.allow = ["click"];
                this.tutorialSpotlight(
                    { x: 0, y: 0, w: 0, h: 0 },
                    'It\'s gone! When there are no more "13" boxes left, you get to end your shift.');
            },
            () => {
                this.allow = ["click"];
                this.tutorialSpotlight(
                    { x: 0, y: 0, w: 0, h: 0 },
                    'Good luck, rookie. You\'ll need it.');
            },
            () => {
                this.allow = ['left', 'right', 'up', 'down'];
                this.disableTutorial();
            }
        ];
    }

    get isWin() {
        return !this.squares.find(s => s.number === 13);
    }

    initSquares() {
        this.squares.forEach(s => s.disappear());
        this.reIndex();
        this.reDraw();
        [...Array(this.initialSquares - 3)].forEach(_ => this.newSquare());
        this.newSquare(13, this.inTutorial ? [3, 3] : null);
        this.newSquare(13);
        this.newSquare(-13, this.inTutorial ? [2, 3] : null);
        this.newSquare(int(-12, 12) + 0.5);
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
        for (let x = adjustment; x < MAX_ELEMENTS - adjustment; x++) {
            for (let y = adjustment; y < MAX_ELEMENTS - adjustment; y++) {
                if (!takenPositions.includes(`${x}-${y}`)) {
                    freePositions.push([x, y]);
                }
            }
        }
        return freePositions;
    }

    newSquare(nr, pos) {
        if (this.isFull()) {
            return;
        }
        const newNumber = nr || Math.round((int(-13, 13) || 1) / pick(1, 1, 2, 2, 3) * 10) / 10;
        const [x, y] = pos || pick(...this.calculateFreePositions(newNumber));
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
        if (!this.allow.includes("up")) {
            return;
        }
        this.columns.forEach(column => moveLogic(column, -1, 1, 'y'));
        this.reDraw();
        this.reIndex();
        this.doTutorialLogic();
        this.checkWin();
        this.doNewSquare();
    }

    moveDown() {
        if (!this.allow.includes("down")) {
            return;
        }
        this.columns.forEach(column => moveLogic(column.reverse(), MAX_ELEMENTS, -1, 'y'));
        this.reDraw();
        this.reIndex();
        this.doTutorialLogic();
        this.checkWin();
        this.doNewSquare();
    }

    moveLeft() {
        if (!this.allow.includes("left")) {
            return;
        }
        this.rows.forEach(row => moveLogic(row, -1, 1, 'x'));
        this.reDraw();
        this.reIndex();
        this.doTutorialLogic();
        this.checkWin();
        this.doNewSquare();
    }

    moveRight() {
        if (!this.allow.includes("right")) {
            return;
        }
        this.rows.forEach(row => moveLogic(row.reverse(), MAX_ELEMENTS, -1, 'x'));
        this.reDraw();
        this.reIndex();
        this.doTutorialLogic();
        this.checkWin();
        this.doNewSquare();
    }

    disableTutorial() {
        if (this.tutorialPath) {
            this.tutorialPath.remove();
            this.tutorialPath = null;
        }
        if (this.tutorialText) {
            this.tutorialText.remove();
            this.tutorialText = null;
        }
        if (this.tutorialElement) {
            this.tutorialElement.remove();
            this.tutorialElement = null;
        }
        this.inTutorial = false;
    }

    setupTutorial() {
        this.disableTutorial();
        this.inTutorial = true;
        this.tutorialStage = 0;
        this.initSquares();
        this.tutorialElement = this.tutorialCover();
        this.tutorialStages[this.tutorialStage]();
        this.tutorialElement.addEventListener('click', () => {
            if (this.allow.includes("click")) {
                this.doTutorialLogic();
            }
        });
    }

    doTutorialLogic() {
        if (this.inTutorial) {
            this.tutorialStage++;
            if (this.tutorialStages[this.tutorialStage]) {
                this.tutorialStages[this.tutorialStage]();
                Note.new("c#", 2, 0.05).play();
            } else {
                this.disableTutorial();
            }
        }
    }

    tutorialCover() {
        const { top, left, width, height } = this.element.getBoundingClientRect();
        const cover = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        cover.setAttributeNS(null, 'viewBox', `0 0 ${width} ${height}`);
        cover.setAttributeNS(null, 'width', width);
        cover.setAttributeNS(null, 'height', height);
        cover.setAttributeNS(null, 'style', `position: absolute; left: ${left}px; top: ${top}px;`);
        this.tutorialPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.tutorialPath.setAttributeNS(null, 'd', makeTutorialSquare({ width, height }, { x: 0, y: 0, w: 0, h: 0 }));
        this.tutorialPath.setAttributeNS(null, 'fill', '#000000aa');
        cover.append(this.tutorialPath);
        document.body.append(cover);

        this.tutorialText = document.createElement('div');
        document.body.append(this.tutorialText);

        return cover;
    }

    tutorialSpotlightSquares(square1, square2, text) {
        this.tutorialSpotlight({
            x: square1.x * 75,
            y: square1.y * 75,
            w: 75 + (square2.x - square1.x) * 75,
            h: 75 + (square2.y - square1.y) * 75
        }, text);
    }

    tutorialSpotlightSquare(square, text) {
        this.tutorialSpotlight({
            x: square.x * 75,
            y: square.y * 75,
            w: 75,
            h: 75
        }, text);
    }

    tutorialSpotlight(holeDimensions, text) {
        const dimensions = this.element.getBoundingClientRect();
        this.tutorialPath.setAttributeNS(null, 'd', makeTutorialSquare(dimensions, holeDimensions));
        this.tutorialText.className = "tutorial-box";
        this.tutorialText.innerHTML = text;
        const textDimensions = this.tutorialText.getBoundingClientRect();
        let textTop = (holeDimensions.y - textDimensions.height);
        if (textTop < 0) {
            textTop = Math.max(holeDimensions.y + holeDimensions.h, 0);
        }
        this.tutorialText.setAttribute('style',
            ` left: ${dimensions.left}px;` +
            ` top: ${dimensions.top + textTop}px;` +
            ` width: ${dimensions.width}px;` +
            ` height: 30px;`);
    }

    checkWin() {
        this.recordStats();
        if (this.isWin) {
            this.showEnd("Nice one, rookie. You can go home now.");
        } else if (this.isFull()) {
            this.showEnd("Oh no... What the hell did you do, rookie?!");
        }
    }

    showEnd(message) {
        const endElement = document.querySelector('[end]');
        endElement.innerHTML = '';
        endElement.classList.add('end-screen');
        const messageElement = document.createElement('div');
        messageElement.innerHTML = message;
        endElement.appendChild(messageElement);
        Object.keys(this.stats).forEach(key => {
            const div = document.createElement('div');
            div.innerHTML = `${key}: ${this.stats[key]}`;
            endElement.appendChild(div);
        });
    }

    recordStats() {
        const squareCount = this.squares.length;
        const square13Count = this.squares.filter(s => s.number === 13).length;
        this.stats = {
            'Moves': this.stats['Moves'] + 1,
            'Most 13s': Math.max(this.stats['Most 13s'], square13Count),
            'Most Squares': Math.max(this.stats['Most Squares'], squareCount)
        };
    }

    doNewSquare() {
        if (pick(true, true, false, false, false)) {
            return;
        }
        setTimeout(() => {
            this.newSquare();
            Note.new("g#", 2, 0.05).play();
            setTimeout(() => {
                Note.new("f#", 2, 0.05).play();
                setTimeout(() => {
                    Note.new("f#", 2, 0.05).play();
                }, 100);
            }, 200);
        }, window.ANIMATION_MS * 1.2);
    }
}

const makeTutorialSquare = ({ width, height }, { x, y, w, h }) => {
    return `M 0,0 V ${height} H ${width} V 0 Z M ${x},${y} h ${w} v ${h} H ${x} Z`;
};