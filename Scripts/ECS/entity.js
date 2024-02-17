//ECS_entity function-constructor/class
function ECS_entity() {
  //Private
  m_id = Date.now;
  this.GetID = function () {
    return m_id;
  };
}
