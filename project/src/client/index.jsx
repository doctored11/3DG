import * as React from "react";
import * as ReactDom from "react-dom";
import { Header } from "./Header/Header.tsx";
import { Game } from "./Game/Game.ts";

const socket = io();
const game = new Game(socket, "game1"); //ключ по которому читает сервер(как бы ключ игры потом наверное)

socket.emit("new player", socket.id);

const usersPromise = game.listen("users update");
const myIdPromise = game.listen("generateId");

usersPromise.then((users) => {
  console.log("онлайн челики: " + JSON.stringify(users));
});

// тоже вынести render
const Window_WIDTH = 800;
const Window_HIGHT = 600;

const gameZone = document.getElementById("game-zone");
gameZone.width = Window_WIDTH;
gameZone.height = Window_HIGHT;
const context = gameZone.getContext("2d");

socket.on("state", (players) => {
  context.beginPath();
  context.fillStyle = "green";
  context.fillRect(0, 0, Window_WIDTH, Window_HIGHT);

  for (const id in players) {
    const player = players[id];

    const _x = player.x;
    const _y = player.y;
    context.beginPath();
    context.fillStyle = "red";
    context.fillRect(_x, _y, 2, 2);
    context.fillStyle = "black";
    context.fillText(`Игрок ${player.name}`, _x - 1, _y - 1.5);
  }
});
//
// временно пример

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
async function gameLoop() {
  const myId = await myIdPromise;

  setInterval(() => {
    if (!myId) return;

    socket.emit("movement", { myId, movement });
  }, 1000 / 60);
}
gameLoop();

window.addEventListener("load", () => {
  ReactDom.hydrate(<Header />, document.getElementById("react_root"));
});
