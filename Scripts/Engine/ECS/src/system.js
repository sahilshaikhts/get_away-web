//ECS_system function-constructor/class
export function ECS_system() {
  //Object map with components and there associated enitity's UID as the key.
  this.components = {};

  //This function needs to be overwritten by the child class.
  this.RegisterEntity = function (id) {
    throw new Error("Missing implementation.");
  };
  //This function needs to be overwritten by the child class.
  this.DeregisterEntity = function (id) {
    throw new Error("Missing implementation.");
  };

  this.GetEntitysComponent = function (entityID) {
    if (this.components) {
      //Check if entity with the id exists in the list.
      if (this.components.hasOwnProperty(entityID)) {
        return this.components[entityID];
      } else {
        return undefined; //if not return undefined
      }
    }
  };
  this.Update = function (deltaTime) {};
}
