//ECS_entity function-constructor/class
export function ECS_entity() {
  //Private
  const m_id = "UID" + Date.now() + Math.random(0, 1) * 1000;
  this.GetID = function () {
    return m_id;
  };
}
