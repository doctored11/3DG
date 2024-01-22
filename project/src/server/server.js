

const express = require('express');
const http = require('http');
// const socketIO = require('socket.io');
const path = require('path')
const ReactDOM = require("react-dom/server");
const { Board } = require("./logic/Board");
const Connector = require("./logic/Connector").default;


const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

const PORT = process.env.PORT || 3000;
// 



let board = new Board();
const server = http.createServer();
const connector = new Connector(app, board, server);
connector.start();




function generateRandomColor() { //временно или вынести в утилиты
  const color = Math.floor(Math.random() * 16777215);
  return color;
}




app.post('/update-board', (req, res) => {
  const chessArr = req.body;

  console.log("получили доску с клиента");
  console.log(chessArr);


  board.figureArrUpdate(chessArr);

  // ответ вернем"
  res.status(200).send("Board updated successfully");
});





