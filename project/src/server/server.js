

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path')
const ReactDOM = require("react-dom/server");
const { indexTemplate } = require("./indexTemplate");
const { Player } = require("./logic/Player");
const UserList = require("./logic/UserList")
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
const userList = new UserList();

function generateRandomColor() { //временно или вынести в утилиты
  const color = Math.floor(Math.random() * 16777215);
  return color;
}

let board = new Board();
io.sockets.on('connection', async (socket) => {
  socket.on("new player", function (data) {
    console.log("__!")
    console.log(data)
    const id = socket.id
    const color = generateRandomColor()
    const pl = new Player({ id: id, name: data, x: 0, y: 0, color: color });

    userList.addUser(pl);
    board = new Board();
    socket.emit("generate", { id, color })
    console.log(id)

  })

  socket.on('disconnect', (data) => {
    userList.removeUser(socket.id)
  });

  socket.on('movement', ({ id, movement } = data) => {
    const player = userList.getUserById(id);
    if (player) {
      player.updatePosition(movement);
    }

  });

  socket.on('board update', (data) => {
    console.log("board update")
    console.log(data)

    board.figureArrUpdate(data);
    // console.log(board.getFigureArr().length)

  });
  // 
  async function handleConnection() {
    let users = await new Promise(resolve => resolve(userList.getUserList()));
    console.log(users);
  }
  await handleConnection();
  // 


});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const gameLoop = (players, io) => {
  //тут наверное можно не так часто отправлять положение шахмат)
  io.sockets.emit("state", players)
  let arr_ = board.getFigureArr()
  if (arr_.length > 0) {
    io.sockets.emit("board update", arr_)
  }


}

setInterval(() => {
  const players = userList.getUserList();
  if (!(players || io)) return
  gameLoop(players, io)

}, 1000 / 32)