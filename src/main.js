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


const grid = new Grid(document.querySelector('[g]'), 5);
grid.reDraw();
window.grid = grid;
document.querySelector('[g]').requestFullscreen();

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