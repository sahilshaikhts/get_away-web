//ECS_entity function-constructor/class
import { ECS_system } from "../src/system.js";
import { TransformComponent } from "./Components/transform-component.js";

export function Transform() {
  //Make ECS_system its parent.
  ECS_system.call(this);

  this.RegisterEntity = function (id) {
    if (this.components.hasOwnProperty(id)) {
      console.warn(
        "Entity associated with this id already has the transform component or the id is duplicate!"
      );
    } else {
      const newComponent = new TransformComponent(id, {
        x: Math.random() * 900,
        y: Math.random() * 700,
      });
      this.components[id] = newComponent;
      return newComponent;
    }
  };
  this.DeregisterEntity = function (id) {
    if (this.components.hasOwnProperty(id)) {
      delete this.components[id];
    }
  };

  this.Update = function (deltaTime) {};
}
