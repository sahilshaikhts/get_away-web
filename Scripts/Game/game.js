import { Grid, GridToWorldPosition } from "./grid.js";
import { Square } from "./square.js";

//Game function-constructor/class
export function Game(canvas) {
    this.canvas = canvas;
    this.draw_context = this.canvas.getContext("2d");
    this.mouse = {
        x: 0, y: 0, clicked: false
    };
    this.gameObjects = [];
    /**
     * @param aGameObjectsWithGridCoord Array of objects with gameObject and its grid position. ({gameObject,gridPos:{gridX,gridY}})
     * @param grid Pass a initialized grid with size and cell size set.
     */
    this.SetupScene = (aGameObjectsWithGridCoord, grid) => {
        this.grid = grid;
        aGameObjectsWithGridCoord.forEach(obj => {
            if (obj.gameObject) {
                const worldPos = GridToWorldPosition(this.grid, obj.gridPos.x, obj.gridPos.y);
                obj.gameObject.SetPosition(worldPos.x, worldPos.y);

                this.gameObjects.push(obj.gameObject);
            }
        });
    }
    this.Begin = () => {
        if (this.draw_context !== null)
            RunGame();
        else
            console.error("Canvas's 2D draw context was null, can't run the game !");
    }

    //Game's Loop
    const RunGame = () => {
        this.draw_context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        Update();
        Render();
        requestAnimationFrame(RunGame);
    }

    const Render = () => {
        this.gameObjects.forEach(gameObject => {
            gameObject.Draw(this.draw_context);
        });
    }
    const Update = () => {
        this.gameObjects.forEach(gameObject => {
            gameObject.Update();
        });
    }

    //Todo: remove from here and put it in some sort of input handler or controller, and make it retrive gameObject thru grid location from Game class.
    this.canvas.addEventListener("mousedown", event => {
        this.mouse.x = event.offsetX;
        this.mouse.y = event.offsetY;
        this.mouse.clicked = true;
    });
    this.canvas.addEventListener("mouseup", event => {
        this.mouse.x = event.offsetX;
        this.mouse.y = event.offsetY;
        this.mouse.clicked = false;
    });
}