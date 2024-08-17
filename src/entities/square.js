export class Square {
    constructor(x, y, number) {
        this.x = x;
        this.y = y;
        this._number = number;
        this._ref = null;
    }

    get number() {
        return this._number;
    }
    set number(value) {
        this._number = value;
        if (this._ref) {
            this._ref.innerHTML = `${value}`;
        }
    }

    merge(square) {
        if (this.number === 13 || square.number === 13) {
            return false;
        }
        this.number += square.number;
        square.disappear();
        return true;
    }

    disappear() {
        this.number = null;
        
        //maybe a setTimeout to wrap the removal (for animation)
        this._ref.remove();
    }

    div(parent) {
        this._ref = document.createElement('div');
        this._ref.setAttribute('s', 1);
        this._ref.innerHTML = `${this._number}`;
        parent.appendChild(this._ref);
        return this;
    }

    draw() {
        this._ref.style.left = `${this.x * 50}px`;
        this._ref.style.top = `${this.y * 50}px`;
        return this;
    }
}