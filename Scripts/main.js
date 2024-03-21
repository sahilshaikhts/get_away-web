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

    //Level layout
    const square_red = new ECS_entity(game);

    game.AddComponentToEntity(Transform, square_red.GetID());
    game.AddComponentToEntity(Physics, square_red.GetID());

    const sprite = game.AddComponentToEntity(Sprite, square_red.GetID());
    sprite.shape = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
    ];

    sprite.color = "#eb3b43";

    game.Begin();
  }

  const button_back = document.getElementsByClassName("btn_back")[0];
  if (button_back) {
    button_back.addEventListener("click", () => {
      document.location.href = "/";
    });
  }
});
