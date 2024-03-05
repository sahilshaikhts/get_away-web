import { Transform } from "../Engine/ECS/Systems/Transform.js";
import { ECS_entity } from "../Engine/ECS/src/entity.js";
import { Game } from "../Engine/game.js";
//Square function-constructor/class
export function Square(game, size, color) {
  ECS_entity.call(this);
  this.color = color;
  this.size = size;

  this.game = game;

  Square.prototype.Draw = function (context) {
    const tranformComp = this.game.GetEntitysComponent(Transform, this.GetID());
    context.fillStyle = this.color;
    context.fillRect(
      tranformComp.position.x,
      tranformComp.position.y,
      this.size,
      this.size
    );
  };

  Square.prototype.CheckRayHit = function (rayX, rayY) {
    const tranformComp = this.game.GetEntitysComponent(Transform, this.GetID());
    const position = tranformComp.position;
    if (
      rayX > position.x &&
      rayX < position.x + this.size &&
      rayY > position.y &&
      rayY < position.y + this.size
    )
      return true;
    else return false;
  };
}
