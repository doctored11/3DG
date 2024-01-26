import * as React from "react";
import * as ReactDom from "react-dom";
import { Header } from "./Header/Header.tsx";
import { Game } from "./Game/Game.ts";
import * as THREE from "three";
import "./main.css";
import { MainEntrance } from "./MainEntrance/MainEntrance.tsx";
import { MainMenu } from "./MainMenu/MainMenu.tsx";
import Player from "./Player/Player.ts";
import HUD from "./HUD/Hud.tsx";

// const socket = io();

const gameZone = document.getElementById("game-zone");
const player = new Player(Math.round(Math.random() * 1000));

function App() {
  const [playerNickname, setPlayerNickname] = React.useState("");
  const [gameId, setGameId] = React.useState("");
  const [gameState, setGameState] = React.useState({
    step: 0,
    playingSide: -1,
  });

  function handleNicknameConfirm() {
    console.log("Никнейм :", playerNickname);
    player.setNickname(playerNickname);
  }
  const handleConfirm = (nickname) => {
    console.log("ваш никчемный ник: " + nickname);

    setPlayerNickname(nickname);
    player.setNickname(nickname);

    fetch("/add-player", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerId: player.getId(),
        playerName: nickname,
      }),
    });
  };

  React.useEffect(() => {
    console.log(gameId);
    if (!gameId) return; //потом поменять логику
    handleNicknameConfirm();
    console.log("перед созданием игры ", player);

    const game = new Game(player, gameId, gameZone); //ключ по которому читает сервер(как бы ключ игры потом наверное)

    game.onGameStateUpdate((data) => {
      setGameState(data);
    });
  }, [gameId]);

  const handleButtonClick = (id) => {
    console.log(`Кнопка с id ${id} кликнута `);
    setGameId(id);
  };
  const handleLobbyItemClick = ({ id, status }) => {
    console.log(`Клик по лобби в App с id ${id}|${status}`);

    if (status == "play") {
      player.setCurrentGameId(id);
    }
    console.log(player);
    handleButtonClick(id);
  };
  return (
    <div>
      {!gameId && (
        <>
          {!playerNickname && <MainEntrance onConfirm={handleConfirm} />}
          {playerNickname && (
            <MainMenu
              onButtonClick={handleButtonClick}
              onLobbyItemClick={handleLobbyItemClick}
              clientPlayer={player}
            />
          )}
        </>
      )}
      {gameId && (
        <HUD step={gameState.step} playingSide={gameState.playingSide} />
      )}
    </div>
  );
}
window.addEventListener("load", () => {
  ReactDom.hydrate(<App />, document.getElementById("react_root"));
});
