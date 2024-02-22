import { ECS_entity } from "../Engine/ECS/src/entity.js";
import { Game } from "../Engine/game.js";
//Square function-constructor/class
export function Square(game, size, color) {
  ECS_entity.call(this);
  this.color = color;
  this.size = size;

  this.game = game;
  this.position = {
    x: 0,
    y: 0,
    Set: function (ax, ay) {
      this.x = ax;
      this.y = ay;
    },
  };
}

Square.prototype.Draw = function (context) {
  context.fillStyle = this.color;
  context.fillRect(this.position.x, this.position.y, this.size, this.size);
};

Square.prototype.Update = function () {};

Square.prototype.SetPosition = function (x, y) {
  this.position.x = x;
  this.position.y = y;
};
Square.prototype.CheckRayHit = function (rayX, rayY) {
  if (
    rayX > this.position.x &&
    rayX < this.position.x + this.size &&
    rayY > this.position.y &&
    rayY < this.position.y + this.size
  )
    return true;
  else return false;
};
