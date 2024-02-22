//ECS_entity function-constructor/class
export function ECS_entity() {
  //Private
  const m_id = "UID" + Date.now();
  this.GetID = function () {
    return m_id;
  };
}
