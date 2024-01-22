import * as express from "express";
import { Board } from "./Board";

import http from "http";
import { indexTemplate } from "../indexTemplate";

class Connector {
  board: Board;
  server: http.Server;
  app: any;

  constructor(app: any, board: Board, server: http.Server) {
    this.board = board;
    this.server = server;

    this.app = app;
    this.setupRoutes();
  }

  setupRoutes() {
    this.app.use("/static", express.static("dist/client"));
    this.app.use(express.json());

    this.app.post("/update-board", this.handleUpdateBoard.bind(this));
    this.app.get("/", this.handleHomePage.bind(this));
    this.app.post("/game-start", this.handleGameStart.bind(this));
    this.app.get("/get-board", this.handleGetBoard.bind(this));

    this.server.on("request", this.app);
  }

  handleUpdateBoard(req: express.Request, res: express.Response) {
    const chessArr = req.body;
    console.log("Получил доску от клиента");
    console.log(chessArr);
    this.board.figureArrUpdate(chessArr);
    res.status(200).send("Board updated successfully");
  }

  handleHomePage(req: express.Request, res: express.Response) {
    const content = "";
    res.send(indexTemplate(content));
  }

  handleGameStart(req: express.Request, res: express.Response) {
    this.board = new Board();
    console.log("новая доска")
    const chessArr = this.board.getFigureArr();
    res.json(chessArr);
  }

  handleGetBoard(req: express.Request, res: express.Response) {
    console.log("отдаем доску")
    const chessArr = this.board.getFigureArr();
    res.json(chessArr);
  }

  start() {
    const PORT = process.env.PORT || 3000;
    this.server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
}

export default Connector;
