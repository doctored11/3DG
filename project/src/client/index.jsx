import * as React from "react";
import * as ReactDom from "react-dom";
import { Header } from "./Header/Header.tsx";
import { Game } from "./Game/Game.ts";
import * as THREE from "three";
import "./main.css";
import { MainEntrance } from "./MainEntrance/MainEntrance.tsx";
import { MainMenu } from "./MainMenu/MainMenu.tsx";

const socket = io();

const gameZone = document.getElementById("game-zone");

function App() {
  const [playerNickname, setPlayerNickname] = React.useState("");
  const [typeEvent, setTypeEvent] = React.useState("");

  function handleNicknameConfirm() {
    console.log("Никнейм :", playerNickname);
  }

  React.useEffect(() => {
    console.log(typeEvent);
    if (typeEvent != "create") return; //потом поменять логику
    handleNicknameConfirm();

    const game = new Game(socket, "game1", gameZone); //ключ по которому читает сервер(как бы ключ игры потом наверное)
   
  }, [typeEvent]);

  const handleConfirm = (nickname) => {
    console.log("ваш никчемный ник: " + nickname);
    setPlayerNickname(nickname);
  };
  const handleButtonClick = (id) => {
    console.log(`Кнопка с id ${id} кликнута `);
    setTypeEvent(id);
  };
  return (
    <div>
      {!typeEvent && (
        <>
          {!playerNickname && <MainEntrance onConfirm={handleConfirm} />}
          {playerNickname && <MainMenu onButtonClick={handleButtonClick} />}
        </>
      )}
    </div>
  );
}
window.addEventListener("load", () => {
  ReactDom.hydrate(<App />, document.getElementById("react_root"));
});
