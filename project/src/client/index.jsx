import * as React from "react";
import * as ReactDom from "react-dom";
import { Header } from "./Header/Header.tsx";
import { Game } from "./Game/Game.ts";
import * as THREE from "three";
import "./main.css"

const socket = io();

const gameZone = document.getElementById("game-zone");

function App() {
  const [playerNickname, setPlayerNickname] = React.useState("");
  const [isNicknameConfirmed, setNicknameConfirmed] = React.useState(false);

  function handleNicknameConfirm() {
    console.log("Никнейм :", playerNickname);
    socket.emit("new player", playerNickname);
    setNicknameConfirmed(true);
  }
  

  React.useEffect(() => {
    if (!isNicknameConfirmed) return;
    const game = new Game(socket, "game1", gameZone); //ключ по которому читает сервер(как бы ключ игры потом наверное)
    const usersPromise = game.listen("users update");
    const myUserPromise = game.listen("generate");

    usersPromise.then((users) => {
      console.log("онлайн челики: " + JSON.stringify(users));
    });

    //
    // временно пример
    //
    const movement = {
      up: false,
      down: false,
      left: false,
      right: false,
    };

    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
          movement.up = true;
          break;
        case "ArrowDown":
          movement.down = true;
          break;
        case "ArrowLeft":
          movement.left = true;
          break;
        case "ArrowRight":
          movement.right = true;
          break;
      }
    });

    document.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "ArrowUp":
          movement.up = false;
          break;
        case "ArrowDown":
          movement.down = false;
          break;
        case "ArrowLeft":
          movement.left = false;
          break;
        case "ArrowRight":
          movement.right = false;
          break;
      }
    });
    //
    //
    //
    async function gameLoop() {
      const {id,color} = await myUserPromise;
      console.log("0___")
      console.log(id)
      setInterval(() => {
        if (!id) return;
        
        socket.emit("movement", { id, movement });
      }, 1000 / 60);
    }
    gameLoop();
  }, [isNicknameConfirmed]);

  return (
    <div>
      <Header
        onNicknameConfirm={handleNicknameConfirm}
        onNicknameChange={(newNickname) => setPlayerNickname(newNickname)}
      />
    </div>
  );
}
window.addEventListener("load", () => {
  ReactDom.hydrate(<App />, document.getElementById("react_root"));
});
