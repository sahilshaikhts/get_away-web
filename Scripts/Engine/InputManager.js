export default function InputManager(canvas) {
  const m_canvas = canvas;

  if (m_canvas == undefined) {
    throw new Error("Missing canvas reference in input manager!");
  }

  this.GetMousePosition = () => {
    return this.mouse_position;
  };

  //Subscribe to mousemove to track and update mouse position
  m_canvas.addEventListener("mousemove", (event) => {
    const canvasBounds = m_canvas.getBoundingClientRect();

    //get the scale of the canvas element
    const scaleX = m_canvas.width / canvasBounds.width;
    const scaleY = m_canvas.height / canvasBounds.height;

    //Adjust the mouse position according to the scale
    const mouseX = event.offsetX * scaleX;
    const mouseY = event.offsetY * scaleY;

    this.mouse_position = { x: mouseX, y: mouseY };
  });

  /**
   *
   * @param {*} key String/char representing the key
   */
  this.SubscribeToKeyDownEvent = function (key, callBack) {
    m_canvas.addEventListener("keydown", (event) => {
      if (event.key === key) {
        callBack();
      }
    });
  };

  /**
   *
   * @param {*} key String/char representing the key
   */
  this.SubscribeToKeyUpEvent = function (key, callBack) {
    m_canvas.addEventListener("keyup", (event) => {
      if (event.key === key) {
        callBack();
      }
    });
  };

  /**
   *
   * @param {*} button number representing the mouse button.
   * @callback mouse_position On dispatch ,provides the subscriber with mouse coordinate.
   */
  this.SubscribeToMouseClickEvent = function (button, callBack) {
    m_canvas.addEventListener("keyup", (event) => {
      if (event.button === button) {
        callBack({ x: event.offsetX, y: event.offsetY });
      }
    });
  };
}
