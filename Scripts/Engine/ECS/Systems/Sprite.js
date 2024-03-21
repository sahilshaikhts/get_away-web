//Sprite function-constructor/class
import { ECS_system } from "../src/system.js";
import { SpriteComponent } from "./Components/sprite-component.js";
import { Transform } from "./Transform.js";

export function Sprite(game, draw_context) {
  //Throw error if missing draw_context
  if (draw_context == undefined) {
    throw new Error("game missing draw_context for sprite");
  }

  this.game = game;
  this.draw_context = draw_context;

  //Make ECS_system its parent.
  ECS_system.call(this);
  this.RegisterEntity = function (id) {
    if (this.components.hasOwnProperty(id)) {
      console.warn(
        "Entity associated with this id already has the transform component or the id is duplicate!"
      );
    } else {
      const transformComponent = this.game.GetEntitysComponent(Transform, id);
      if (transformComponent != undefined) {
        const newComponent = new SpriteComponent(id, transformComponent);
        this.components[id] = newComponent;
        return newComponent;
      } else {
        console.error(
          "Entity should have transform component to support phyisics component."
        );
      }
    }
  };
  this.DeregisterEntity = function (id) {
    if (this.components.hasOwnProperty(id)) {
      delete this.components[id];
    }
  };

  this.Update = function (deltaTime) {
    for (let key in this.components) {
      //Check if component's sprite is set.
      if (this.components[key].shape != undefined) {
        this.draw_context.fillStyle = this.components[key].color;
        this.draw_context.beginPath();
        //Draw start point
        this.draw_context.moveTo(
          this.components[key].shape[0].x +
            this.components[key].transformComponent.position.x,
          this.components[key].shape[0].y +
            this.components[key].transformComponent.position.y
        );
        //Draw rest of the points by adding transform's position
        for (let i = 1; i < this.components[key].shape.length; i++) {
          this.draw_context.lineTo(
            this.components[key].shape[i].x +
              this.components[key].transformComponent.position.x,
            this.components[key].shape[i].y +
              this.components[key].transformComponent.position.y
          );
        }
        this.draw_context.closePath();
        this.draw_context.fill(); // or this.draw_context.stroke();
      }
    }
  };
}
