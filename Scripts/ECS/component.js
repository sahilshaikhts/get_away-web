//ECS_entity function-constructor/class
function ECS_component(ownerEntity) {
  //Private
  const m_ownerEntity = ownerEntity;
  this.GetOwnerEntity () {
    return m_ownerEntity;
  };
}
