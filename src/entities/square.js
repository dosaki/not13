const OPERATION = {
    "+": (a, b) => Math.round(a + b * 10) / 10,
    "x": (a, b) => Math.round(a * b * 10) / 10
};

export class Square {
    constructor(x, y, number, operation) {
        this.x = x;
        this.y = y;
        this._number = number;
        this._operation = operation || "+";
        this._ref = null;
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
        if (this.number === 13 || square.number === 13) {
            return false;
        }
        if (this._operation === "x") {
            this.number = OPERATION[this._operation](this.number, square.number);
        } else {
            this.number = OPERATION[this._operation](square.number, this.number);
        }
        this._operation = "+";
        square.disappear();
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
        setTimeout(() => {
            this._ref.classList.remove('appear');
            this._ref.classList.add('normal');
        }, window.ANIMATION_MS);
        return this;
    }

    bump(axis) {
        setTimeout(() => {
            this._ref.classList.add(`bump-${axis}`);
            setTimeout(() => {
                this._ref.classList.remove(`bump-${axis}`);
            }, window.ANIMATION_MS);
        }, ANIMATION_MS*0.8);
    }

    draw() {
        this._ref.style.left = `${this.x * 50}px`;
        this._ref.style.top = `${this.y * 50}px`;
        if (this._number === 13) {
            this._ref.classList.add('w');
            this._ref.classList.remove('n');
        } else {
            this._ref.classList.add('n');
            this._ref.classList.remove('w');
        }
        return this;
    }
}