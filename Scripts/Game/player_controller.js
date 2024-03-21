import InputManager from "../Engine/InputManager";
import { Game } from "../Engine/game";

/**
 *
 * @param {Game} game
 * @param {InputManager} inputManager
 */
function PlayerController(game, inputManager) {
  if (game == undefined) throw new Error("Missing reference to game");
  if (inputManager == undefined)
    throw new Error("Missing reference to inputManager");
  const m_game = game;
  const m_inputManager = inputManager;

  function OnMouseClick(mouse_pos) {}
  m_inputManager.SubscribeToMouseClickEvent(0, OnMouseClick);
}
