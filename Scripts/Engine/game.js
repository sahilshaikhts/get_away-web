import { Physics } from "./ECS/Systems/Physics.js";
import { Sprite } from "./ECS/Systems/Sprite.js";
import { Transform } from "./ECS/Systems/Transform.js";
import { ECS_component } from "./ECS/src/component.js";
import { ECS_system } from "./ECS/src/system.js";
import QuadTree from "./Utility/QuadTree.js";

//Game function-constructor/class
export function Game(canvas, bg_color) {
  //Temporary
  const quadTree = new QuadTree(0, 0, canvas.width, canvas.height);
  //End

  const m_canvas = canvas;
  if (m_canvas == undefined) {
    throw new Error(
      "Canvas was undefined ,provide reference to canvas while initializing game class."
    );
  }

  const m_draw_context = m_canvas.getContext("2d");
  if (m_draw_context == undefined) {
    throw new Error(
      "Canvas's 2D draw context was undefined, can't run the game !"
    );
  }

  //Define systems in order of priority.(e.g sprite should be rendered after physics update).
  let m_systems = [
    new Transform(),
    new Physics(this),
    new Sprite(this, m_draw_context),
  ];

  //Initlizing function
  this.Begin = () => {
    this.lastFrameTimeStamp = 0;
    SetUpQuadTree();
    RunGame(0);
  };

  //Game's Loop
  const RunGame = (timeStamp) => {
    const deltaTime = (timeStamp - this.lastFrameTimeStamp) / 1000;
    this.lastFrameTimeStamp = timeStamp;

    m_draw_context.clearRect(0, 0, canvas.width, canvas.height);

    DrawBackground();
    Update(deltaTime);
    requestAnimationFrame(RunGame);
  };

  canvas.addEventListener("mousemove", (event) => {
    const canvasBounds = canvas.getBoundingClientRect();

    //get the scale of the canvas element
    const scaleX = canvas.width / canvasBounds.width;
    const scaleY = canvas.height / canvasBounds.height;

    //Adjust the mouse position according to the scale
    const mouseX = event.offsetX * scaleX;
    const mouseY = event.offsetY * scaleY;

    if (quadTree) {
      let found = quadTree.GetEntitiesWithinRange(
        mouseX - 2.5,
        mouseY - 2.5,
        5,
        5
      );
    }
  });
  canvas.addEventListener("click", (event) => {
    const canvasBounds = canvas.getBoundingClientRect();

    //get the scale of the canvas element
    const scaleX = canvas.width / canvasBounds.width;
    const scaleY = canvas.height / canvasBounds.height;

    //Adjust the mouse position according to the scale
    const mouseX = event.offsetX * scaleX;
    const mouseY = event.offsetY * scaleY;

    if (quadTree) {
      let found = quadTree.GetEntitiesWithinRange(
        mouseX - 2.5,
        mouseY - 2.5,
        5,
        5
      );
      if (found && found.length > 0) {
        const transformComponents = m_systems[0].GetAllComponents();

        for (let key in transformComponents) {
          if (transformComponents[key].GetID() === found[0].GetID()) {
            transformComponents[key].position = {
              x: transformComponents[key].position.x,
              y: transformComponents[key].position.y + 50,
            };
          }
        }
        //Migrate
        quadTree.MigrateObject(found[0].GetID());
      }
    }
  });
  const DrawBackground = () => {
    m_draw_context.fillStyle = bg_color;
    m_draw_context.fillRect(0, 0, m_canvas.width, m_canvas.height);
  };

  const Update = (deltaTime) => {
    if (m_systems) {
      m_systems.forEach((system) => {
        system.Update(deltaTime);
      });
    }
    quadTree.Draw(m_draw_context);
  };

  const SetUpQuadTree = function () {
    const transformComponents = m_systems[0].GetAllComponents();
    for (let key in transformComponents) {
      quadTree.InsertObject(transformComponents[key]);
    }
  };

  /**
   *
   * @param {ECS_system} systemClass Reference to the system-class that the component belongs to.
   * @param {Number} entityID ID of an existing entity.
   * @returns {ECS_component} Returns newly created component
   */
  this.AddComponentToEntity = function (systemClass, entityID) {
    const system = m_systems.find((sys) => sys instanceof systemClass);
    if (system) {
      return system.RegisterEntity(entityID);
    } else {
      console.warn(
        "Error: No system of given class exists,make sure to register your system to game."
      );
    }
  };

  this.GetEntitysComponent = function (systemClass, entityID) {
    const system = m_systems.find((sys) => sys instanceof systemClass);
    if (system) {
      return system.GetEntitysComponent(entityID);
    }
  };
}
