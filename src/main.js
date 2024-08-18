import { Grid } from './entities/grid.js';
import { quarterImageToFull } from './utils/images.js';

window.ANIMATION_MS = 400;

const addBoxStyle = (name, image) => {
    var style = document.querySelector('style');
    style.innerHTML = `${style.innerHTML}
        ${name} {
            background-image: ${image};
        }
`;
};

quarterImageToFull("/imgs/box_part.png", 50, 50).then((box) => {
    addBoxStyle('.n', `url(${box})`);
    quarterImageToFull("/imgs/metal_stud.png", 50, 50).then((metal) => {
        addBoxStyle('.w', `url(${metal}), url(${box})`);
    });
});

const gridArea = document.querySelector('[g]');
const containerArea = document.querySelector('[c]');
const fullscreenButton = document.querySelector('button');
const grid = new Grid(gridArea, 5);
let isFullScreen = false;
grid.reDraw();
window.grid = grid;

fullscreenButton.addEventListener('click', () => {
    if(isFullScreen) {
        document.exitFullscreen();
    } else {
        containerArea.requestFullscreen();
    }
    isFullScreen = !isFullScreen;
    fullscreenButton.innerHTML = isFullScreen ? "Exit Fullscreen" : "Fullscreen";

});

window.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key === 'ArrowUp') {
        grid.moveUp();
    } else if (key === 'ArrowDown') {
        grid.moveDown();
    } else if (key === 'ArrowLeft') {
        grid.moveLeft();
    } else if (key === 'ArrowRight') {
        grid.moveRight();
    }
});

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;
    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) < Math.abs(yDiff)) {
        if (yDiff > 0) {
            grid.moveUp();
        } else {
            grid.moveDown();
        }
    } else {
        if (xDiff > 0) {
            grid.moveLeft();
        } else {
            grid.moveRight();
        }
    }
    xDown = null;
    yDown = null;
};