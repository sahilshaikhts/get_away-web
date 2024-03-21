//Physics function-constructor/class
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
      const transformComponent = this.game.GetEntitysComponent(Transform, id);
      if (transformComponent != undefined) {
        const newComponent = new PhysicsComponent(id, transformComponent);
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
      this.components[key].transformComponent.position = {
        x:
          this.components[key].transformComponent.position.x +
          this.components[key].velocity.x,
        y:
          this.components[key].transformComponent.position.y +
          this.components[key].velocity.y,
      };
    }
  };
}
