

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path')
const ReactDOM = require("react-dom/server");
const { indexTemplate } = require("./indexTemplate");
const UserList = require("./logic/UserList")
const Player = require("./logic/Player")


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



io.sockets.on('connection', async (socket) => {

  socket.on("new player", function () {
    const id = socket.id
    const pl = new Player({ id: id, name: "горя", x: 0, y: 0 });
    userList.addUser(pl);

    socket.emit("generateId", id)
    console.log(id)
    socket.emit("users update", Object.values(userList.getUserList()))
  })

  socket.on('disconnect', (data) => {
    userList.removeUser(socket.id)
  });

  socket.on('movement', ({ myId, movement } = data) => {
    const player = userList.getUserById(myId);
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