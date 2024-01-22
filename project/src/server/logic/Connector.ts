import * as express from "express";
import { Board } from "./Board";

import http from "http";
import { indexTemplate } from "../indexTemplate";

class Connector {
  boards: Map<number, Board>;
  server: http.Server;
  app: any;

  constructor(
    app: any,
    boards: { id: number; board: Board }[],
    server: http.Server
  ) {
    this.boards =new Map<number, Board>();
    this.server = server;

    this.app = app;
    this.setupRoutes();
  }

  setupRoutes() {
    this.app.use("/static", express.static("dist/client"));
    this.app.use(express.json());

    this.app.post("/update-board", this.handleUpdateBoard.bind(this));
    this.app.get("/", this.handleHomePage.bind(this));
    this.app.post("/create-board", this.handleCreateBoard.bind(this));
    this.app.get("/get-board/:boardId", this.handleGetBoard.bind(this));

    this.server.on("request", this.app);
  }

  handleUpdateBoard(req: express.Request, res: express.Response) {
    const { boardId, chessArr } = req.body;
    const board = this.boards.get(boardId);

    if (board) {
      console.log(`Received board update for board ${boardId} from client`);
      board.figureArrUpdate(chessArr);
      res.status(200).send(`Board ${boardId} updated successfully`);
    } else {
      res.status(404).send(`Board ${boardId} not found`);
    }
  }

  handleHomePage(req: express.Request, res: express.Response) {
    const content = "";
    res.send(indexTemplate(content));
  }

  handleCreateBoard(req: express.Request, res: express.Response) {
    const newBoard = new Board();
    const newBoardId = 1; // Замените этот код на генерацию уникального идентификатора
    this.boards.set(newBoardId, newBoard);
    console.log(`доска с id инициализация ${newBoardId}`);
    console.log(this.boards)
    res.json({ boardId: newBoardId });
  }
  handleGetBoard(req: express.Request, res: express.Response) {
    const boardId = parseInt(req.params.boardId);
    const board = this.boards.get(boardId);

    if (board) {
      const chessArr = board.getFigureArr();
      res.json(chessArr);
    } else {
      res.status(404).send(`Board ${boardId} not found`);
    }
  }

  start() {
    const PORT = process.env.PORT || 3000;
    this.server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
}

export default Connector;
