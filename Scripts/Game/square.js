//Square function-constructor/class
export function Square(game, size, color) {
    //Private properties
    var m_color = color;
    var m_size = size;

    //public properties
    this.game = game;
    this.position = {
        x: 0,
        y: 0,
        Set: function (ax, ay) {
            this.x = ax;
            this.y = ay;
        }
    };
}

Square.prototype.Draw = (context) => {
    context.fillStyle = m_color;
    context.fillRect(this.position.x, this.position.y, m_size, m_size);
}

Square.prototype.Update = () => {
    if (this.game.mouse.clicked === true) {
        console.log(this.game.mouse.x - m_size / 2, this.game.mouse.x);
        this.position.Set(this.game.mouse.x - m_size / 2, this.game.mouse.y - m_size / 2);
    }
}

Square.prototype.SetPosition = (x, y) => {
    this.position.x = x;
    this.position.y = y;
}