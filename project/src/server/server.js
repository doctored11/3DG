

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






const server = http.createServer();
const connector = new Connector(app,  server);
connector.start();




function generateRandomColor() { //временно или вынести в утилиты
  const color = Math.floor(Math.random() * 16777215);
  return color;
}







