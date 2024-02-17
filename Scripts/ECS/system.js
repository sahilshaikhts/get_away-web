//ECS_system function-constructor/class
function ECS_system() {
  //Private

  //Object map with components and there associated enitity's UID as the key.
  var m_components;

  this.GetEntitysComponent = function (id) {
    return m_components[id];
  };

  this.RegisterEntity = function (id) {
    throw new Error("Missing implementation.");
  };
  this.DeregisterEntity = function (id) {
    throw new Error("Missing implementation.");
  };

  this.Update = function (deltaTime) {};
}
