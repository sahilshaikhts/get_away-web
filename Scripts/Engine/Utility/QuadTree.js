import { TransformComponent } from "../ECS/Systems/Components/transform-component.js";

/**
 * @param {number} x X coordinate of QuadTree
 * @param {number} y Y coordinate of QuadTree
 * @param {number} w Width of the entire QuadTree
 * @param {number} h Height of the entire QuadTree
 * @param {number} limit Max number of units per quad (defualt 4)
 */
export default function QuadTree(x, y, w, h, limit = 4) {
  //Private
  const m_root = new Quad(x, y, w, h, limit);

  //Public

  /**
   * @param {TransformComponent} transform Transform component of the entity
   */
  this.InsertEntity = function (transform) {
    if (m_root) {
      m_root.Insert(transform);
    } else {
      throw new Error("Fatal: Missing root quad!");
    }
  };
  //temp
  this.rect;
  this.foundObjects;
  /**
   * @param {number} rectX x-coordiante of the area(rectangle) to check
   * @param {number} rectY y-coordiante of the area to check
   * @param {number} w width of the area to check
   * @param {number} h heigth of the area to check
   */
  this.GetEntitiesWithinRange = function (rectX, rectY, w, h) {
    let foundObjects = [];
    this.rect = { x: rectX, y: rectY };
    m_root.Query(foundObjects, rectX, rectY, w, h);
    this.foundObjects = foundObjects;

    if (foundObjects.length > 0) return foundObjects;
    else return undefined;
  };
  this.Draw = function (context) {
    if (this.rect) {
      context.beginPath();
      context.lineWidth = "1";
      context.strokeStyle = "red";
      context.rect(this.rect.x, this.rect.y, 5, 5);
      context.stroke();
    }
    if (this.foundObjects)
      for (let index = 0; index < this.foundObjects.length; index++) {
        const element = this.foundObjects[index];
        context.fillStyle = "green";
        context.fillRect(
          this.foundObjects[index].position.x,
          this.foundObjects[index].position.y,
          50,
          50
        );
      }
    m_root.Draw(context);
  };
}

function Quad(x, y, w, h, limit) {
  //Private
  const m_position = { x: x, y: y };
  const m_size = { x: w, y: h };
  const m_limit = limit;

  //m_objects is the list of transforms associated with different entities
  const m_objects = [];

  const m_childQuads = [];

  //Public
  //Note: Edge case to improve later: When subdivided the parents objects still remains scattered and often in a subquad and visibly looks it exceeds the limit(in sub-quad) ,redistribute the objects for more accurate and optimized version.
  /**
   * @param {TransformComponent} transform Transform component of the entity
   */
  this.Insert = function (transform) {
    //Add new object if not excceding limit,otherwise add it to a child-quad.
    if (m_objects.length < m_limit) {
      //If the shape intersect with the quad add it.
      if (
        CheckIntersection(
          transform.position.x,
          transform.position.y,
          transform.scale.x,
          transform.scale.y,
          m_position.x,
          m_position.y,
          m_size.x,
          m_size.y
        )
      ) {
        m_objects.push(transform);
        return true;
      }
    } else {
      //If Child quads empty create 4 sub quad
      if (m_childQuads.length == 0) {
        //If sub quads were created then try inserting entity intop a sub-quad
        CreateSubQuad();
      }

      let success = false;
      //Loop through each child quad and try insert
      for (let i = 0; i < m_childQuads.length; i++) {
        if (m_childQuads[i].Insert(transform)) {
          success = true; //Set to true if inserted in any sub quad
        }
      }

      return success;
    }
  };

  /**
   *
   * @param {Array} foundObjects Array to store all found transform
   * @param {number} rectX x-coordiante of the area(rectangle) to check
   * @param {number} rectY y-coordiante of the area to check
   * @param {number} w width of the area to check
   * @param {number} h heigth of the area to check
   */
  this.Query = function (foundObjects, rectX, rectY, w, h) {
    //Check if the quad area intersects with the check area.
    if (
      CheckIntersection(
        rectX,
        rectY,
        w,
        h,
        m_position.x,
        m_position.y,
        m_size.x,
        m_size.y
      )
    ) {
      for (let i = 0; i < m_objects.length; i++) {
        if (
          CheckIntersection(
            rectX,
            rectY,
            w,
            h,
            m_objects[i].position.x,
            m_objects[i].position.y,
            m_objects[i].scale.x,
            m_objects[i].scale.y
          )
        ) {
          foundObjects.push(m_objects[i]);
        }
      }
      if (m_childQuads && m_childQuads.length > 0) {
        for (let i = 0; i < m_childQuads.length; i++) {
          m_childQuads[i].Query(foundObjects, rectX, rectY, w, h);
        }
      }
    }
  };

  this.Draw = function (context) {
    context.beginPath();
    context.lineWidth = "1";
    context.strokeStyle = "gray";
    context.rect(m_position.x, m_position.y, m_size.x, m_size.y);
    context.stroke();
    m_childQuads.forEach((quad) => quad.Draw(context));
  };

  /**
   *
   * @param {number} rectX x-coordiante of the area(rectangle) to check
   * @param {number} rectY y-coordiante of the area to check
   * @param {number} w width of the area to check
   * @param {number} h heigth of the area to check
   */
  function CheckIntersection(
    rectA_X,
    rectA_Y,
    rectA_W,
    rectA_H,
    rectB_X,
    rectB_Y,
    rectB_W,
    rectB_H
  ) {
    return !(
      rectA_X > rectB_X + rectB_W ||
      rectA_X + rectA_W < rectB_X ||
      rectA_Y > rectB_Y + rectB_H ||
      rectA_Y + rectA_H < rectB_Y
    );
    return (
      CheckIfPointInside({ x: rectX, y: rectY }) ||
      CheckIfPointInside({ x: rectX, y: rectY + h }) ||
      CheckIfPointInside({ x: rectX + w, y: rectY }) ||
      CheckIfPointInside({ x: rectX + w, y: rectY + h })
    );
  }

  //Creates and add 4 child quad sections.
  function CreateSubQuad() {
    //If the quad size is too small return without subdividing.
    if (m_size.x / 2 < 1) return false;

    const subQuad_1 = new Quad(
      m_position.x,
      m_position.y,
      m_size.x / 2,
      m_size.y / 2,
      m_limit
    );
    const subQuad_2 = new Quad(
      m_position.x + m_size.x / 2,
      m_position.y,
      m_size.x / 2,
      m_size.y / 2,
      m_limit
    );
    const subQuad_3 = new Quad(
      m_position.x + m_size.x / 2,
      m_position.y + m_size.y / 2,
      m_size.x / 2,
      m_size.y / 2,
      m_limit
    );
    const subQuad_4 = new Quad(
      m_position.x,
      m_position.y + m_size.y / 2,
      m_size.x / 2,
      m_size.y / 2,
      m_limit
    );

    m_childQuads.push(subQuad_1);
    m_childQuads.push(subQuad_2);
    m_childQuads.push(subQuad_3);
    m_childQuads.push(subQuad_4);

    return true;
  }

  function CheckIfPointInside(position) {
    return (
      position.x > m_position.x &&
      position.x < m_position.x + m_size.x &&
      position.y > m_position.y &&
      position.y < m_position.y + m_size.y
    );
  }
}
