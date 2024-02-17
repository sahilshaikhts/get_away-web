import { Grid, GridToWorldPosition } from "./grid.js";
import { Square } from "./square.js";

//Game function-constructor/class
export function Game(canvas, bg_color) {
  this.canvas = canvas;
  this.draw_context = this.canvas.getContext("2d");
  this.mouse = {
    x: 0,
    y: 0,
    clicked: false,
  };
  this.gameObjects = [];
  /**
   * @param aGameObjectsWithGridCoord Array of objects with gameObject and its grid position. ({gameObject,gridPos:{x,y}})
   * @param grid Pass a initialized grid with size and cell size set.
   */
  this.SetupScene = (aGameObjectsWithGridCoord, grid) => {
    if (grid == undefined) {
      console.log("Grid is undefined");
      return null;
    }
    this.grid = grid;
    aGameObjectsWithGridCoord.forEach((obj) => {
      if (obj.gameObject) {
        const worldPos = GridToWorldPosition(
          this.grid,
          obj.gridPos.x,
          obj.gridPos.y
        );
        obj.gameObject.SetPosition(worldPos.x, worldPos.y);

        this.gameObjects.push(obj.gameObject);
      }
    });
  };
  this.Begin = () => {
    if (this.draw_context !== null) RunGame();
    else
      console.error("Canvas's 2D draw context was null, can't run the game !");
  };

  //Game's Loop
  const RunGame = () => {
    this.draw_context.clearRect(0, 0, canvas.width, canvas.height);
    Update();
    DrawBackground();
    Render();
    requestAnimationFrame(RunGame);
  };
  const DrawBackground = () => {
    this.draw_context.fillStyle = bg_color;
    this.draw_context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };
  const Render = () => {
    this.gameObjects.forEach((gameObject) => {
      gameObject.Draw(this.draw_context);
    });
  };
  const Update = () => {
    this.gameObjects.forEach((gameObject) => {
      gameObject.Update();
    });
  };

  //Todo: remove from here and put it in some sort of input handler or controller, and make it retrive gameObject thru grid location from Game class.
  this.canvas.addEventListener("mousedown", (event) => {
    const canvasBounds = this.canvas.getBoundingClientRect();

    //get the scale of the canvas element
    const scaleX = this.canvas.width / canvasBounds.width;
    const scaleY = this.canvas.height / canvasBounds.height;
    //Adjust the mouse position according to the scale
    const mouseX = event.offsetX * scaleX;
    const mouseY = event.offsetY * scaleY;

    this.mouse.x = mouseX;
    this.mouse.y = mouseY;

    this.mouse.clicked = true;
    CheckIfRayHitObject();
  });
  this.canvas.addEventListener("mouseup", (event) => {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;
    this.mouse.clicked = false;
  });
  const CheckIfRayHitObject = () => {
    this.gameObjects.forEach((gameObject) => {
      if (gameObject.CheckRayHit(this.mouse.x, this.mouse.y)) {
        gameObject.m_color = "black";
        this.clickedObject = gameObject;
        return this.clickedObject;
      }
    });
  };
}
