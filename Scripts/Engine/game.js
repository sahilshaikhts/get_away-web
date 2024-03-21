import { Physics } from "./ECS/Systems/Physics.js";
import { Sprite } from "./ECS/Systems/Sprite.js";
import { Transform } from "./ECS/Systems/Transform.js";
import { ECS_system } from "./ECS/src/system.js";

//Game function-constructor/class
export function Game(canvas, bg_color) {
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
  };

  /**
   *
   * @param {ECS_system} systemClass Reference to the system-class that the component belongs to.
   * @param {Number} entityID ID of an existing entity.
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
