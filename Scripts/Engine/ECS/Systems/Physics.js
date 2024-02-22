//ECS_entity function-constructor/class
import { ECS_system } from "../src/system.js";
import { PhysicsComponent } from "./Components/physics-component.js";
import { Transform } from "./Transform.js";

export function Physics(game) {
  this.game = game;
  //Make ECS_system its parent.
  ECS_system.call(this);

  this.RegisterEntity = function (id) {
    if (this.components.hasOwnProperty(id)) {
      console.warn(
        "Entity associated with this id already has the transform component or the id is duplicate!"
      );
    } else {
      if (this.game.GetEntitysComponent(Transform, id) != undefined) {
        const newComponent = new PhysicsComponent(id);
        this.components[id];
        return newComponent;
      }
    }
  };
  this.DeregisterEntity = function (id) {
    if (this.components.hasOwnProperty(id)) {
      delete this.components[id];
    }
  };

  this.Update = function (deltaTime) {};
}
