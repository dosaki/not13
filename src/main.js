import { Grid } from './entities/grid.js';

const grid = new Grid(document.querySelector('[g]'), 5);
grid.reDraw();
window.grid = grid;

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