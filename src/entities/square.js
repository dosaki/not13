import { int, pick } from '../utils/random-utils.js';

const OPERATION = {
    "+": (a, b) => Math.round((a + b) * 10) / 10,
    "x": (a, b) => Math.round((a * b) * 10) / 10
};

export class Square {
    constructor(x, y, number, operation) {
        this.x = x;
        this.y = y;
        this._number = number;
        this._operation = operation || "+";
        this._ref = null;
        this._parent = null;
    }


    get isInt() {
        return this._number % 1 === 0;
    }

    get number() {
        return this._number;
    }

    set number(value) {
        this._number = value;
        setTimeout(() => {
            if (this._ref) {
                this._ref.innerHTML = `${this.value}`;
            }
            if (this._number === 0) {
                this._ref.classList.remove('bump-x-normal');
                this._ref.classList.remove('bump-x-reverse');
                this._ref.classList.remove('bump-y-normal');
                this._ref.classList.remove('bump-y-reverse');
                this._ref.classList.remove('normal');
                this._ref.classList.add('disappear');
                setTimeout(() => {
                    this.disappear();
                }, window.ANIMATION_MS);
            }
        }, window.ANIMATION_MS);
    }

    get symbol() {
        if (this._operation === "+") {
            return "";
        }
        return this._operation;
    }

    get value() {
        return `${this.symbol}${this._number}`;
    }

    merge(square) {
        const wasInt = this.isInt;
        if (this.number === 13 && square.number !== -13) {
            return false;
        }
        if (this.number === 13 && square.number === -13) {
            this.number = 0;
            this.doWow();
            square.disappear();
            return true;
        }
        if (this._operation === "x") {
            this.number = OPERATION[this._operation](this.number, square.number);
        } else if (square._operation === "x") {
            this.number = OPERATION[square._operation](square.number, this.number);
        } else {
            this.number = OPERATION[this._operation](this.number, square.number);
        }
        this._operation = "+";
        square.disappear();
        if(wasInt !== this.isInt){
            this.doWow();
            console.log('wow');
        }
        return true;
    }

    disappear() {
        this.number = null;
        setTimeout(() => {
            this._ref.remove();
        }, window.ANIMATION_MS);
    }

    div(parent) {
        this._ref = document.createElement('div');
        this._ref.setAttribute('s', 1);
        this._ref.classList.add('appear');
        this._ref.innerHTML = `${this.value}`;
        parent.appendChild(this._ref);
        this._parent = parent;
        setTimeout(() => {
            this._ref.classList.remove('appear');
            this._ref.classList.add('normal');
        }, window.ANIMATION_MS);
        this._ref.square = this;  // @todo: remove this
        return this;
    }

    bump(axis, direction) {
        setTimeout(() => {
            this._ref.classList.add(`bump-${axis}-${direction}`);
            setTimeout(() => {
                this._ref.classList.remove(`bump-${axis}-${direction}`);
            }, window.ANIMATION_MS);
        }, ANIMATION_MS * 0.8);
    }

    draw() {
        this._ref.style.left = `${this.x * 75}px`;
        this._ref.style.top = `${this.y * 75}px`;
        if (this._number === 13) {
            this._ref.classList.add('w');
            this._ref.classList.remove('n');
        } else {
            this._ref.classList.add('n');
            this._ref.classList.remove('w');
        }
        return this;
    }

    doWow() {
        const wow = document.createElement('div');
        wow.classList.add('wow');
        wow.innerHTML = pick("Nice!", "Wow!", "Cool!");
        this._parent.appendChild(wow);
        wow.style.left = `${this.x * 75}px`;
        wow.style.top = `${this.y * 75}px`;
        wow.style.color = pick("#ff0000", "#0088ff", "#00ff00", "#00ffff", "#ff00ff", "#ffff00");
        setTimeout(() => {
            wow.classList.add('popin');
            setTimeout(() => {
                wow.classList.remove('popin');
                wow.classList.add('popout');
                wow.style.top = `${(this.y * 75) - 75}px`;
                setTimeout(() => {
                    wow.remove();
                }, window.ANIMATION_MS);
            }, window.ANIMATION_MS);
        }, 10);
        return this;
    }
}