import { TransformComponent } from "../ECS/Systems/Components/transform-component.js";

/**
 * @param {number} x X coordinate of QuadTree
 * @param {number} y Y coordinate of QuadTree
 * @param {number} w Width of the entire QuadTree
 * @param {number} h Height of the entire QuadTree
 * @param {number} limit Max number of units per quad (defualt 4)
 */
export default function QuadTree(x, y, w, h, limit = 4) {
  //temp
  this.rect;
  this.foundObjects;

  //Private
  const m_root = new Quad(x, y, w, h, limit);
  //Map of all the entities and the quads it's aquiring (transformID(key),Quad[](value))
  const m_entities_quad = new Map();

  //Map of all the enitities in the QuadTree(EntityID(key))
  const m_entities = new Map();

  //Public
  /**
   * @param {TransformComponent} aTransform
   */
  this.InsertObject = function (aTransform) {
    if (m_root) {
      //Array to store the quads that the entity was inserted in.
      const arr_quads = [];
      const entityID = aTransform.GetID();

      //If inserted sucessfully add it to the m_entities_quad
      if (m_root.Insert(aTransform, arr_quads)) {
        //If entity already in the map
        if (m_entities_quad.has(aTransform.GetID())) {
          const quads = m_entities_quad.get(aTransform.GetID());

          m_entities_quad.set(aTransform.GetID(), [...quads, arr_quads]);
        } else {
          m_entities_quad.set(aTransform.GetID(), arr_quads);
        }
        if (!m_entities.has(aTransform.GetID())) {
          m_entities.set(aTransform.GetID(), aTransform);
        }
        return true;
      } else {
        console.warn("Failed inserting entity to QuadTree!");
        return false;
      }
    } else {
      throw new Error("Fatal: Missing root quad!");
    }
  };

  /**
   *
   * @param {*} aTransformID UID of the enitity that was given when inserting object into QuadTree.
   */
  this.MigrateObject = function (aTransformID) {
    if (
      m_entities_quad.has(aTransformID) &&
      m_entities_quad.has(aTransformID)
    ) {
      const quads = m_entities_quad.get(aTransformID);

      for (let i = 0; i < quads.length; i++) {
        quads[i].RemoveEntity(aTransformID);
      }

      m_entities_quad.delete(aTransformID);

      //Reinsert entity ,if failed to insert for any reason remove from the m_entities map.
      if (this.InsertObject(m_entities.get(aTransformID)) === false) {
        m_entities.delete(aTransformID);
      }
    } else {
      console.warn(
        "Requested migration for the entity with given id doesn't exists in the QuadTree."
      );
    }
  };

  /**
   * @param {number} rectX x-coordiante of the area(rectangle) to check
   * @param {number} rectY y-coordiante of the area to check
   * @param {number} w width of the area to check
   * @param {number} h heigth of the area to check
   * @returns {Array} Returns array of found entities.
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

/**
 * Quad is class representing a branch in the quad tree.
 * @param {*} x Center origin x coordinate
 * @param {*} y Center origin y coordinate
 * @param {*} w Width
 * @param {*} h Height
 * @param {*} limit Max number of entities before it creates sub-branches.
 */
function Quad(x, y, w, h, limit) {
  //Private
  const m_position = { x: x, y: y };
  const m_size = { x: w, y: h };
  const m_limit = limit;

  //m_entities is the list of QEntity associated with different entities
  const m_entities = new Map();
  const m_childQuads = [];

  this.GetObjects = () => m_entities;

  //Public
  //Note: Edge case to improve later: When subdivided the parents objects still remains scattered and often in a subquad and visibly looks it exceeds the limit(in sub-quad) ,redistribute the objects for more accurate and optimized version.
  /**
   * @param {TransformComponent} aTransformID Object of TransformComponent class
   * @param {Array} aArrQuads Array to store quads that the entity was stored in.
   */
  this.Insert = function (aTransform, aArrQuads) {
    //Add new object if not excceding limit,otherwise add it to a child-quad.
    if (m_entities.size < m_limit) {
      //If the shape intersect with the quad add it.
      if (
        CheckIntersection(
          aTransform.position.x,
          aTransform.position.y,
          aTransform.scale.x,
          aTransform.scale.y,
          m_position.x,
          m_position.y,
          m_size.x,
          m_size.y
        )
      ) {
        m_entities.set(aTransform.GetID(), aTransform);
        aArrQuads.push(this);
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
        if (m_childQuads[i].Insert(aTransform, aArrQuads)) {
          success = true; //Set to true if inserted in any sub quad
        }
      }

      return success;
    }
  };

  this.RemoveEntity = function (aTransformID) {
    if (m_entities.has(aTransformID)) {
      m_entities.delete(aTransformID);
    }
  };
  /**
   *
   * @param {Array} foundObjects Array to store all found QEntity
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
      for (const [key, value] of m_entities) {
        if (
          CheckIntersection(
            rectX,
            rectY,
            w,
            h,
            value.position.x,
            value.position.y,
            value.scale.x,
            value.scale.y
          )
        ) {
          foundObjects.push(value);
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
}
