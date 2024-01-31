

const express = require('express');
const http = require('http');
// const socketIO = require('socket.io');
const path = require('path')
const ReactDOM = require("react-dom/server");
const { Board } = require("./logic/Board");
const Connector = require("./logic/Connector").default;


const app = express();
const cors = require('cors');



const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://192.168.0.15:3000'],

};

app.use(cors(corsOptions));



const server = http.createServer();
const connector = new Connector(app, server);
connector.start();




function generateRandomColor() { //временно или вынести в утилиты
  const color = Math.floor(Math.random() * 16777215);
  return color;
}







