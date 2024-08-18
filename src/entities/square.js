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
        if (this.number === 13 && square.number !== -13) {
            return false;
        }
        if (this.number === 13 && square.number === -13) {
            this.number = 0;
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
}