//ECS_entity function-constructor/class
export function ECS_component(ownerEntity) {
  this.ownerEntity = ownerEntity;
  this.m_id = "UIDC" + Date.now() + Math.random(0, 1) * 100000;
  this.GetID = function () {
    return this.m_id;
  };
}
