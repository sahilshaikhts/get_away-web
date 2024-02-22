//ECS_entity function-constructor/class
export function ECS_component(ownerEntity) {
  //Private
  const m_ownerEntity = ownerEntity;
  this.GetOwnerEntity = function () {
    return m_ownerEntity;
  };
}
