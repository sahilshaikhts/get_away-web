//Grid function-constructor/class
export function Grid(x, y, w, h, cellSize) {
    this.position = { x: x, y: y };
    this.size = { x: w, y: h };
    this.cellSize = cellSize;
}
/**
 * @returns object {x,y} representing canvas position of the center of the cell.
 */
export const GridToWorldPosition = function (grid,gridX, gridY) {
    return {
        x: grid.position.x + (gridX * grid.cellSize) + grid.cellSize * .05,
        y: grid.position.y + (gridY * grid.cellSize) + grid.cellSize * .05
    };
}
/**
 * @returns object {x,y} representing the world coordinates in the grid coordinate
 */
export const WorldToGridPosition = function (grid,worldX, worldY) {
    //if world coordinates are out of grid return null.
    if (worldX > grid.position.x + (grid.size.x * grid.cellSize) + grid.cellSize || worldX < grid.position.x ||
        worldY > grid.position.y + (grid.size.y * grid.cellSize) + grid.cellSize || worldY < grid.position.y) {
        return null;
    }
    //Else calculate and return grid coordinate.
    return {
        x: Math.floor((worldX - grid.position.x) / cellSize),
        y: Math.floor((worldY - grid.position.y) / cellSize)
    };
}


