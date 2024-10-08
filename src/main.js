import {Grid} from './entities/grid.js';
import {quarterImageToFull} from './utils/images.js';
import { Note } from './utils/audio-utils.js';


window.ANIMATION_MS = 400;
const TUTORIAL_BUTTON = document.querySelector('[tutorial]');
const RESET_BUTTON = document.querySelector('[reset]');
const GRID = new Grid(document.querySelector('[g]'), 5);
window._GRID = GRID;
let X_DOWN = null;
let Y_DOWN = null;

function setGameUp(grid) {
    grid.initSquares();
    grid.reDraw();

    TUTORIAL_BUTTON.addEventListener("mouseenter", () => {
        Note.new("c#", 3, 0.05).play();
    });
    TUTORIAL_BUTTON.addEventListener("click", () => {
        grid.setupTutorial();
        Note.new("f#", 4, 0.05).play(0.5);
    });

    RESET_BUTTON.addEventListener("mouseenter", () => {
        Note.new("c#", 3, 0.05).play();
    });
    RESET_BUTTON.addEventListener("click", () => {
        grid.disableTutorial();
        grid.initSquares();
        Note.new("f#", 4, 0.05).play(0.5);
    });
}

const addBoxStyle = (name, image) => {
    var style = document.querySelector('style');
    style.innerHTML = `${style.innerHTML}
        ${name} {
            background-image: ${image};
        }
`;
};

function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    X_DOWN = firstTouch.clientX;
    Y_DOWN = firstTouch.clientY;
};

function handleTouchMove(evt) {
    if (!X_DOWN || !Y_DOWN) {
        return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;
    const xDiff = X_DOWN - xUp;
    const yDiff = Y_DOWN - yUp;

    if (Math.abs(xDiff) < Math.abs(yDiff)) {
        if (yDiff > 0) {
            GRID.moveUp();
        } else {
            GRID.moveDown();
        }
    } else {
        if (xDiff > 0) {
            GRID.moveLeft();
        } else {
            GRID.moveRight();
        }
    }
    X_DOWN = null;
    Y_DOWN = null;
}

quarterImageToFull('./imgs/box_part.png', 50, 50).then((box) => {
    addBoxStyle('.n', `url(${box})`);
    quarterImageToFull('./imgs/metal_stud.png', 50, 50).then((metal) => {
        addBoxStyle('.w', `url(${metal}), url(${box})`);
        setGameUp(GRID);
        window.addEventListener('keydown', (e) => {
            const key = e.key;
            if (key === 'ArrowUp') {
                GRID.moveUp();
            } else if (key === 'ArrowDown') {
                GRID.moveDown();
            } else if (key === 'ArrowLeft') {
                GRID.moveLeft();
            } else if (key === 'ArrowRight') {
                GRID.moveRight();
            }
        });
        document.addEventListener('touchstart', handleTouchStart, false);
        document.addEventListener('touchmove', handleTouchMove, false);
    });
});