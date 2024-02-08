'use strict';

import { Game } from "./Game/game.js";

window.addEventListener('load', (event) => {
    const canvas = document.getElementById("game_screen");

    if (canvas !== null) {
        const game = new Game(canvas);
        
        game.SetupScene([{}]);
        game.Begin();
    }
});

