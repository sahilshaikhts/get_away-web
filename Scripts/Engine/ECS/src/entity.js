//ECS_entity function-constructor/class
export function ECS_entity() {
  //Private
  //ToDo: put this in consturucot or something and remove the math.rand*10000 () and the error that happesn on removing it and in component
  const m_id = "UIDE" + Date.now() + Math.random(0, 1) * 100000;
  this.GetID = function () {
    return m_id;
  };
}
