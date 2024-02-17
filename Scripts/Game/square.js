//Square function-constructor/class
export function Square(game, size, color) {
  //Private properties

  this.m_color = color;
  this.m_size = size;

  //public properties
  this.game = game;
  this.position = {
    x: 0,
    y: 0,
    Set: function (ax, ay) {
      this.x = ax;
      this.y = ay;
    },
  };
}

Square.prototype.Draw = function (context) {
  context.fillStyle = this.m_color;
  context.fillRect(this.position.x, this.position.y, this.m_size, this.m_size);
};

Square.prototype.Update = function () {};

Square.prototype.SetPosition = function (x, y) {
  this.position.x = x;
  this.position.y = y;
};
Square.prototype.CheckRayHit = function (rayX, rayY) {
  if (
    rayX > this.position.x &&
    rayX < this.position.x + this.m_size &&
    rayY > this.position.y &&
    rayY < this.position.y + this.m_size
  )
    return true;
  else return false;
};
