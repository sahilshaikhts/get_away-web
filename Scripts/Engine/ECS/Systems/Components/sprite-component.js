import { ECS_component } from "../../src/component.js";
import { ECS_entity } from "../../src/entity.js";
import { TransformComponent } from "./transform-component.js";

//SpriteComponent function-constructor/class
/**
 *
 * @param {ECS_entity} ownerEntity Reference to entity that will own this component.
 * @param {TransformComponent} transformComponent Reference to the tranform component of the owning entity (required!).
 * @param {object} shape Array of points(x,y) that defines the shape of your sprite.
 */
export function SpriteComponent(ownerEntity, transformComponent) {
  //Make ECS_component its parent.
  ECS_component.call(this, ownerEntity);

  //Default shape
  this.shape = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
  ];

  this.color = "white";

  //Throw error if ownerEntity is not provided.
  if (ownerEntity == undefined) {
    throw new Error("Missing reference to ownerEntity!");
  }

  //Throw error if transformComponent is not provided.
  if (transformComponent == undefined) {
    throw new Error("Missing reference to transformComponent!");
  } else {
    this.transformComponent = transformComponent;
  }
}
