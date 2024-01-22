

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path')
const ReactDOM = require("react-dom/server");
const { indexTemplate } = require("./indexTemplate");
const { Player } = require("./logic/Player");
// const UserList = require("./logic/UserList")
const { Board } = require("./logic/Board")



const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.set("port", PORT)
app.use('/static', express.static('dist/client'));

app.get('/', (req, res) => {
  const content = '';
  res.send(indexTemplate(content));
});
// const userList = new UserList();

function generateRandomColor() { //временно или вынести в утилиты
  const color = Math.floor(Math.random() * 16777215);
  return color;
}

let board = new Board();
io.sockets.on('connection', async (socket) => {



    board = new Board();
 

  socket.on('disconnect', (data) => {
    // userList.removeUser(socket.id)
  });

 

  socket.on('board update', (data) => {
    console.log("board update")
    console.log(data)

    board.figureArrUpdate(data);

  });
  // 
  async function handleConnection() {
   
  }
  await handleConnection();
  // 


});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const gameLoop = (io) => {
  //тут наверное можно не так часто отправлять положение шахмат)
  // io.sockets.emit("state", players)
  let arr_ = board.getFigureArr()
  if (arr_.length > 0) {
    io.sockets.emit("board update", arr_)
  }


}

setInterval(() => {

  gameLoop(io)

}, 1000 / 32)