import { ECS_component } from "../../src/component.js";
import { ECS_entity } from "../../src/entity.js";
import { TransformComponent } from "./transform-component.js";
/**
 *
 * @param {ECS_entity} ownerEntity Reference to entity that will own this component.
 * @param {TransformComponent} transformComponent Reference to the tranform component of the owning entity (required!).
 */
export function PhysicsComponent(ownerEntity, transformComponent) {
  //Make ECS_component its parent.
  ECS_component.call(this, ownerEntity);

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

  //Set initial values if provided or set it to default.
  this.velocity = { x: 0, y: 0 };
  this.forces = { x: 0, y: 0 };
  this.friction = 0;
}
