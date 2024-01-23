import * as express from "express";
import { Board } from "./Board";

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
    this.setupRoutes();
  }

  setupRoutes() {
    this.app.use("/static", express.static("dist/client"));
    this.app.use(express.json());

    this.app.post("/update-board/:boardId", this.handleUpdateBoard.bind(this));
    this.app.get("/", this.handleHomePage.bind(this));
    this.app.post(
      "/create-board",
      (req: express.Request, res: express.Response) => {
        const boardId = req.body.boardId || -1;
        const playersIds = req.body.playersId || ["-0", "-00"];
        this.handleCreateBoard(req, res, boardId, playersIds);
      }
    );
    this.app.get("/get-board/:boardId", this.handleGetBoard.bind(this));
    this.app.get("/get-board-keys", this.handleGetBoardKeys.bind(this));

    this.server.on("request", this.app);
  }

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
      if (board.getPlayerCount() < 2 && newPlayerId)
        board.addPlayer(newPlayerId);
      // this.boards.get(boardId)?.figureArrUpdate(chessArr);
      board.figureArrUpdate(chessArr);
      res.status(200).send(`Board ${boardId} updated successfully`);
    } else {
      res.status(404).send(`Board ${boardId} not found`);
    }
    console.log(this.boards);
  }

  handleHomePage(req: express.Request, res: express.Response) {
    const content = "";
    res.send(indexTemplate(content));
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
  }
  handleGetBoard(req: express.Request, res: express.Response) {
    const boardId = req.params.boardId;
    const board = this.boards.get(boardId);

    if (board) {
      const chessArr = board.getFigureArr();
      console.log(board);
      const players = board.getPlayers();
      console.log("отдаем : ", {
        chessArr: chessArr,
        players: players,
      });
      res.json({ chessArr: chessArr, players: players });
    } else {
      res.status(404).send(`Board ${boardId} not found`);
    }
  }
  handleGetBoardKeys(req: express.Request, res: express.Response) {
    const boardKeys = Array.from(this.boards.keys());
    res.json(boardKeys);
  }

  start() {
    const PORT = process.env.PORT || 3000;
    this.server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
}

export default Connector;
