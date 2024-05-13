import { ECS_component } from "../../src/component.js";

//TransformComponent function-constructor/class
/**
 *
 * @param {object} position Object representing x and y coordinates for position (obj:{x,y}).
 * @param {object} rotation Object representing rotation.
 * @param {object} scale Object representing scale in x and y coordinates (obj:{x,y}).
 */
export function TransformComponent(ownerEntity, position, rotation, scale) {
  //Make ECS_component its parent.
  ECS_component.call(this, ownerEntity);

  //Throw error if ownerEntity is not provided.
  if (ownerEntity == undefined) {
    throw new Error("Missing reference to ownerEntity!");
  }
  /**
   *
   * @param {*} aX Width
   * @param {*} aY Height
   * @returns
   */
  this.SetScale = (aX, aY) => (this.scale = { x: aX, y: aY });
  //Set initial values if provided or set it to default.
  this.position = position ? position : { x: 0, y: 0 };
  this.rotation = rotation ? rotation : { x: 0, y: 0 };
  this.scale = scale ? scale : { x: 1, y: 1 };
}
