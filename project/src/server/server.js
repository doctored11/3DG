

const express = require('express');
const http = require('http');
// const socketIO = require('socket.io');
const path = require('path')
const ReactDOM = require("react-dom/server");
const { indexTemplate } = require("./indexTemplate");

const { Board } = require("./logic/Board")



const app = express();
const server = http.createServer(app);
// const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.set("port", PORT)
app.use('/static', express.static('dist/client'));
app.use(express.json());



// const userList = new UserList();

function generateRandomColor() { //временно или вынести в утилиты
  const color = Math.floor(Math.random() * 16777215);
  return color;
}

let board = new Board();
// io.sockets.on('connection', async (socket) => {



//     board = new Board();


//   socket.on('disconnect', (data) => {
//     // userList.removeUser(socket.id)
//   });



//   socket.on('board update', (data) => {
//     console.log("board update")
//     console.log(data)

//     board.figureArrUpdate(data);

//   });
//   // 
//   async function handleConnection() {
//     console.log("C ПОДКЛЮЧЕНЕМ ЮЗЕРНАМЕ")

//   }
//   await handleConnection();
//   // 


// });

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/update-board', (req, res) => {
  const chessArr = req.body;

  console.log("получили доску с клиента");
  console.log(chessArr);


  board.figureArrUpdate(chessArr);

  // ответ вернем"
  res.status(200).send("Board updated successfully");
});



app.get('/', (req, res) => {
  const content = '';
  res.send(indexTemplate(content));
});
app.post('/game-start', (req, res) => {
  board = new Board();
  const chessArr = board.getFigureArr();
  res.json(chessArr);
});
app.get('/get-board', (req, res) => {
  const chessArr = board.getFigureArr();
  res.json(chessArr);
});

const gameLoop = () => {
  //тут наверное можно не так часто отправлять положение шахмат)
  // io.sockets.emit("state", players)
  let arr_ = board.getFigureArr()
  if (arr_.length > 0) {
    // io.sockets.emit("board update", arr_)
  }


}


setInterval(() => {

  gameLoop()

}, 1000 / 32)