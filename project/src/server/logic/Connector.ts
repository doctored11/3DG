import * as express from "express";
import { Board, ChessData } from "./Board";

import http from "http";
import { indexTemplate } from "../indexTemplate";

class Connector {
  boards: Map<string, Board>;
  server: http.Server;
  app: any;

  constructor(app: any, server: http.Server) {
    this.boards = new Map<string, Board>();
    this.server = server;

    this.app = app;
    // this.setupRoutes();
  }

  setupRoutes() {
    this.app.use("/static", express.static("dist/client"));
    this.app.use(express.json());

    this.app.post("/update-board/:boardId", this.handleUpdateBoard.bind(this));
    this.app.post("/update-env/:boardId", this.handleEnvBoard.bind(this));

    this.app.get("/", this.handleHomePage.bind(this));
    this.app.get("/get-board/:boardId", this.handleGetBoard.bind(this));
    this.app.get("/get-enviroment/:boardId", this.handleGetEnv.bind(this));
    this.app.get("/get-board-keys", this.handleGetBoardKeys.bind(this));

    this.app.post(
      "/create-board",
      (req: express.Request, res: express.Response) => {
        const boardId = req.body.boardId || -1;
        const playersIds = req.body.playersId || ["-0", "-00"];
        this.handleCreateBoard(req, res, boardId, playersIds);
      }
    );

    this.server.on("request", this.app);
  }

  //

  handleUpdateBoard(req: express.Request, res: express.Response) {
    const boardId = req.params.boardId;

    const chessArr = req.body.chessArr;
    const newPlayerId = req.body.playerId;
    console.log("---- : ", req.body);

    const board = this.boards.get(boardId);
    console.log(
      `попытка получить(серверу) доску с id ${boardId}, до парсинга${req.params.boardId}`
    );

    if (board) {
      console.log(`получено обновление доски с id:${boardId} от клиента`);
      console.log("попытка добавить игрока, ", board.getPlayers(), newPlayerId);
      if (board.getPlayerCount() < 2 && newPlayerId) {
        board.addPlayer(newPlayerId);
        board.setStep(0);
      }
      // this.boards.get(boardId)?.figureArrUpdate(chessArr);
      if (!arraysAreEqual(chessArr, board.getFigureArr())) {
        board.figureArrUpdate(chessArr);
        board.nextStep();
        console.log("Ход No", board.getStep());
      }

      res.status(200).send(`Board ${boardId} updated successfully`);
      //return;
    } else {
      res.status(404).send(`Board ${boardId} not found`);
      //return;
    }
    // console.log(this.boards);
  }

  handleEnvBoard(req: express.Request, res: express.Response) {
    const boardId = req.params.boardId;

    const envArr = req.body.envArr;
    const newPlayerId = req.body.playerId;
    console.log("---- : ", req.body);

    const board = this.boards.get(boardId);
    console.log(
      `попытка получить(серверу) природу) с id ${boardId}, до парсинга${req.params.boardId}`
    );

    if (board) {
      console.log(
        `получено обновление природы доски с id:${boardId} от клиента`
      );

      board.setEnviromentArr(envArr);

      res.status(200).send(`Board ${boardId} updated successfully`);
      //return;
    } else {
      res.status(404).send(`Board ${boardId} not found`);
      //return;
    }
    console.log(this.boards);
  }

  handleHomePage(req: express.Request, res: express.Response) {
    const content = "";
    res.send(indexTemplate(content));
    //return;
  }

  handleCreateBoard(
    req: express.Request,
    res: express.Response,
    boardId: string = "-1",
    players: string[] = ["-1", "-2"]
  ) {
    const newBoard = new Board();
    const newBoardId = boardId;
    const playersIds = players;
    playersIds.forEach((pl) => {
      newBoard.addPlayer(pl);
    });

    this.boards.set(newBoardId, newBoard);
    console.log(`доска с id инициализация ${newBoardId}`);
    console.log(this.boards);
    res.json({ boardId: newBoardId });
    //return
  }
  handleGetBoard(req: express.Request, res: express.Response) {
    const boardId = req.params.boardId;
    const board = this.boards.get(boardId);

    if (board) {
      const chessArr = board.getFigureArr();
      // console.log(board);
      const players = board.getPlayers();
      const stepNumber = board.getStep();
      // console.log("отдаем : ", {
      //   // chessArr: chessArr,
      //   players: players,
      //   stepNumber: stepNumber,
      // });
      res.json({
        chessArr: chessArr,
        players: players,
        stepNumber: stepNumber,
      });
      //return
    } else {
      res.status(404).send(`Board ${boardId} not found`);
      //return;
    }
  }

  handleGetEnv(req: express.Request, res: express.Response) {
    const boardId = req.params.boardId;
    const board = this.boards.get(boardId);

    if (board) {
      const envArr = board.getEnviromentArr();
      // console.log(board);

      res.json({ chessArr: envArr });
      //return
    } else {
      res.status(404).send(`Board ${boardId} not found`);
      //return;
    }
  }

  handleGetBoardKeys(req: express.Request, res: express.Response) {
    const boardKeys = Array.from(this.boards.keys());
    res.json(boardKeys);
    //return
  }

  start() {
    this.setupRoutes();
    const PORT = process.env.PORT || 3000;
    this.server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
}
function arraysAreEqual(arr1: ChessData[], arr2: ChessData[]) {
  const isEqual =
    arr1.length === arr2.length &&
    arr1.every((obj1, index) => {
      const obj2 = arr2[index];
      return Object.entries(obj1).every(([key, value]) => obj2[key] === value);
    });

  console.log("________________");
  // console.log(arr1, "\n\n____9_9_____\n\n");
  // console.log(arr2, "0___0");
  console.log("массивы равны :", isEqual);

  return isEqual;
}

export default Connector;
