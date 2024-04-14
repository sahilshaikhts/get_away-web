"use strict";

import { Physics } from "./Engine/ECS/Systems/Physics.js";
import { Sprite } from "./Engine/ECS/Systems/Sprite.js";
import { Transform } from "./Engine/ECS/Systems/Transform.js";
import { ECS_entity } from "./Engine/ECS/src/entity.js";
import { Game } from "./Engine/game.js";

window.addEventListener("load", (event) => {
  const canvas = document.getElementById("game_canvas");
  if (canvas !== null) {
    const game = new Game(canvas, "#2b2b26");
    let mouse_position;
    const squares = [];
    const square_sprite = [
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 50, y: 50 },
      { x: 0, y: 50 },
    ];

    //Level layout
    for (let i = 0; i < 15; i++) {
      squares.push(new ECS_entity(game));
      game.AddComponentToEntity(Transform, squares[i].GetID());

      game.AddComponentToEntity(Physics, squares[i].GetID());

      let sprite = game.AddComponentToEntity(Sprite, squares[i].GetID());
      sprite.shape = square_sprite;
      sprite.color = "#eb3b43";
    }

    game.Begin();
  }
  const button_back = document.getElementsByClassName("btn_back")[0];
  if (button_back) {
    button_back.addEventListener("click", () => {
      document.location.href = "/";
    });
  }
});
