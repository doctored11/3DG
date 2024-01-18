

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path')
const ReactDOM = require("react-dom/server");
const { indexTemplate } = require("./indexTemplate");
const { Player } = require("./logic/Player");
const UserList = require("./logic/UserList")



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

io.sockets.on('connection', async (socket) => {
  socket.on("new player", function (data) {
    console.log("__!")
    console.log(data)
    const id = socket.id
    const color = generateRandomColor()
    const pl = new Player({ id: id, name: data, x: 0, y: 0, color: color });
    userList.addUser(pl);

    socket.emit("generate", { id, color })
    console.log(id)
    socket.emit("users update", Object.values(userList.getUserList()))
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
  io.sockets.emit("state", players)
}

setInterval(() => {
  const players = userList.getUserList();
  if (!(players || io)) return
  gameLoop(players, io)

}, 1000 / 32)