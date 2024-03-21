//ECS_entity function-constructor/class
export function ECS_component(ownerEntity) {
  //Note:Do I need to store this? maybe remove it to minimize dependenices??
  this.ownerEntity = ownerEntity;
}
