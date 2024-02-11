'use strict';

import { Game } from "./Game/game.js";
import { Grid } from "./Game/grid.js";
import { Square } from "./Game/square.js";

window.addEventListener('load', (event) => {
    const canvas = document.getElementById("game_screen");
   
    if (canvas !== null) {
        const game = new Game(canvas,"#2b2b26");
        const grid = new Grid(0, 0, 10, 5, 100);

        //Level layout
        const square_red = new Square(game, 100, '#eb3b43');
        const square_green = new Square(game, 100, '#acc795');
        
        const levelLayout = [
            { gameObject: square_red, gridPos: { x: 0, y: 1 } },
            { gameObject: square_green, gridPos: { x: 7, y: 0 } }
        ];

        game.SetupScene(levelLayout, grid);
        game.Begin();
    }
});

