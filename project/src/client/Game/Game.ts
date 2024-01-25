import React, { useEffect, useRef } from "react";

import * as THREE from "three";
import { Board } from "./objects/Board";
import { ChessPiece } from "./objects/figure/ChessPiece";
import { Figure } from "./objects/figure/Figure";
import { Cell } from "./objects/Cell";
import { ChessData } from "./objects/Board";
import Player from "../Player/Player";
const FREQUENCY_UPDATE = 5;

export class Game {
  // private socket: any;
  // private key: string;
  private gameZone: HTMLDivElement;
  private scene: THREE.Scene = new THREE.Scene();
  private clientId: string = "_0";

  protected raycaster!: THREE.Raycaster;
  private renderer!: THREE.WebGLRenderer;
  private playerCamera!: THREE.PerspectiveCamera;
  private board!: Board;
  private player: Player;
  private gamersId: string[] = [];

  private boardId: string | null = "-1";

  private activeChessFigure: ChessPiece | null = null;

  private onGameStateUpdateCallback: (data: {
    step: number;
    playingSide: number;
  }) => void = () => {};
  public onGameStateUpdate(
    callback: (data: { step: number; playingSide: number }) => void
  ) {
    this.onGameStateUpdateCallback = callback;
  }

  constructor(player: Player, gameId: string, gameZone: HTMLDivElement) {
    // this.socket = socket;
    this.boardId = gameId;
    this.gameZone = gameZone;
    this.player = player;
    this.initThree();
    this.setupEventHandlers();
    this.raycaster = new THREE.Raycaster();

    window.addEventListener("click", (event) => this.onClick(event));
  }

  private setupEventHandlers() {
    const chessArr = this.board.getChessToSend();
    const envArr = this.board.getEnvToSend();
    console.log("ВХОД");
    console.log(chessArr);
    const plId = this.player.getId();
    console.log(plId);

    console.log({ chessArr: chessArr, playerId: plId });
    if (this.player.getCurrentGameId() == this.boardId) {
      console.log("ИГРОК УЧАСТНИК!");
      fetch(`/update-board/${this.boardId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chessArr: chessArr,
          playerId: plId,
        }),
      });

      fetch(`/update-env/${this.boardId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          envArr: envArr,
        }),
      });
    }
    let plCount = 0;
    // setTimeout(() => {
    fetch(`/get-enviroment/${this.boardId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("обновление доски ", data);

        this.board.restoreEnv(data.chessArr);
      });

    fetch(`/get-board/${this.boardId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("обновление доски ", data);

        this.board.restoreFigures(data.chessArr);

        this.gamersId.push(data.players);
        this.board.setStep(data.stepNumber);
        console.log(data.players);
        for (const playerId in data.players) {
          if (data.players.hasOwnProperty(playerId)) {
            const teamSide = data.players[playerId];
            console.log(teamSide, "Tside!");
            console.log(playerId, this.player.getId());

            if (playerId == this.player.getId()) {
              this.player.setPlayingSide(teamSide);
              console.log("удачно присваиваем команду на входе ", this.player);
              break;
            }
          }
        }
        //
        console.log("camSide:  _", this.player.getPlayingSide());
        if (this.player.getPlayingSide() == 1) {
          this.playerCamera.position.set(37, 38, 25);
          this.playerCamera.lookAt(new THREE.Vector3(37, 43, 5));
        } else {
          this.playerCamera.up.set(0, 0, 1);
          this.playerCamera.position.set(37, 43, 25);
          this.playerCamera.lookAt(new THREE.Vector3(37, 38, 5));
        }
        //
        plCount = Object.keys(data.players).length;
        this.onGameStateUpdateCallback({
          step: this.board.getStep(),
          playingSide: this.player.getPlayingSide(),
        });
        console.log(data.players, "получил ", this.player.getId(), plCount);
        this.render();
        if (plCount < 2) {
          setTimeout(() => {
            this.setupEventHandlers();
          }, (2 * 1000) / FREQUENCY_UPDATE);
          return;
        }

        this.getLoop();
      });
    // }, 100);
    // this.render();
  }

  private onNewEvent(result: string, eventKey?: any) {
    console.log(`событие на ${eventKey || "?"} :`, result);
  }

  private initThree() {
    this.playerCamera = new THREE.PerspectiveCamera(
      80,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.gameZone.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color(0x00ff00);

    this.board = new Board(this.scene, this.playerCamera, 8, 8);
    this.board.render();

    const boardCells = this.board.getCells();
    // console.log("camSide:  _", this.player.getPlayingSide());
    // if (this.player.getPlayingSide() == 1) {
    //   this.playerCamera.position.add(new THREE.Vector3(37, 38, 25));
    //   this.playerCamera.lookAt(new THREE.Vector3(37, 41, 5));
    // } else {
    //   this.playerCamera.up.set(0, 0, 1);
    //   this.playerCamera.position.set(37, 43, 25);
    //   this.playerCamera.lookAt(new THREE.Vector3(37, 38, 5));
    // }

    this.playerCamera.up.set(0, 0, 1);
    this.playerCamera.position.set(37, 43, 25);
    this.playerCamera.lookAt(new THREE.Vector3(37, 44, 2));
    //
    this.playerCamera.setFocalLength(3);
  }

  private render() {
    console.log("render ", !this.renderer || !this.gameZone);
    if (!this.renderer || !this.gameZone) return;

    this.scene.clear();
    this.board.render();
    //  тут был слушатель

    this.renderer.render(this.scene, this.playerCamera);
  }

  protected onClick(event: MouseEvent) {
    // TODO разбить мутанта этого ()
    if (!this.isPlayer()) return;
    let canMoveIt = false;

    const pointer = new THREE.Vector2();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (-event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(pointer, this.playerCamera);
    const intersectionsArray: Figure[] = [];

    for (const figure of this.board.getFigures()) {
      console.log("onCLICK!");
      const intersections = this.raycaster.intersectObjects([figure.mesh]);
      if (
        intersections.length > 0 &&
        intersections[0].object instanceof THREE.Mesh
      ) {
        intersectionsArray.push(figure);
      }
    }
    for (const figure of this.board.getFlatCells()) {
      console.log("onCLICK!");
      const intersections = this.raycaster.intersectObjects([figure.mesh]);
      if (
        intersections.length > 0 &&
        intersections[0].object instanceof THREE.Mesh
      ) {
        intersectionsArray.push(figure);
      }
    }

    if (intersectionsArray.length <= 0) return;

    intersectionsArray.sort((a, b) => {
      const distanceA = a.mesh.position.distanceTo(this.raycaster.ray.origin);
      const distanceB = b.mesh.position.distanceTo(this.raycaster.ray.origin);
      return distanceA - distanceB;
    });

    let firstIntersection = intersectionsArray[0];

    let cellsToSHighlight:
      | { cell: Cell; action: "move" | "attack" }[]
      | null = firstIntersection.onSelect();

    //Зачаток к логике передвижения
    console.log("Готовность двигаться!");
    console.log(this.activeChessFigure);

    // console.log(this.activeCell)
    if (
      firstIntersection instanceof ChessPiece &&
      firstIntersection.getTeamId() == this.player.getPlayingSide()
    ) {
      this.cellColorOf();
      this.activeChessFigure = firstIntersection;
      console.log("Выбрана основная фигура!");
      console.log(firstIntersection);

      canMoveIt =
        this.activeChessFigure?.getTeamId() == this.player.getPlayingSide();

      console.log(
        "могу двигать? :",
        canMoveIt,
        this.activeChessFigure?.getTeamId(),
        this.player.getPlayingSide()
      );
    } else if (
      (firstIntersection instanceof Cell &&
        firstIntersection.getHighlightStatus()) ||
      (firstIntersection instanceof ChessPiece &&
        firstIntersection.getTeamId() != this.player.getPlayingSide())
    ) {
      if (firstIntersection instanceof ChessPiece)
        firstIntersection = firstIntersection.getCell();
      // console.log("Возможен Мув!");
      // console.log(this.activeChessFigure || "а где?");
      // console.log(cellsToSHighlight || "нет выделенных клеток для действий");
      let action: string = "move";
      // console.log("___+!");
      // console.log(cellsToSHighlight);
      canMoveIt =
        this.activeChessFigure?.getTeamId() == this.player.getPlayingSide();

      //если шаг доски синхронизировать то ок:
      canMoveIt =
        canMoveIt &&
        (this.player.getPlayingSide()
          ? this.board.getStep() % 2 != 0
          : this.board.getStep() % 2 == 0);
      console.log(
        "Статус хода ",
        canMoveIt,
        this.player.getPlayingSide(),
        this.board.getStep(),
        this.board.getStep() % 2 != 0,
        this.board.getStep() % 2 == 0
      );

      this.activeChessFigure?.onSelect()?.forEach((el) => {
        console.log(el.cell === firstIntersection);
        if (el.cell === firstIntersection) action = el.action;
      });
      console.log("ОПределяем характер движения", canMoveIt);

      if (action == "attack" && canMoveIt) {
        this.board.getFigures().forEach((chess) => {
          if (
            chess.getCell() == firstIntersection &&
            chess.getTeamId() != this.activeChessFigure?.getTeamId()
          ) {
            console.log(
              "АААA он убит! -> " + JSON.stringify(chess.getPosition())
            );
            //да - как то получилось 2 массива из которых надо удалять ( массив на клики и массив на отрисовку)
            this.board.removeChess(chess);
            this.activeChessFigure?.move(firstIntersection as Cell);
            cellsToSHighlight= null;
          }
        });
      }

      if (action == "move" && canMoveIt) {
        this.activeChessFigure?.move(firstIntersection as Cell);
      }
      if (canMoveIt) this.board.nextStep();

      this.cellColorOf();
    } else if (firstIntersection instanceof Cell) {
      this.cellColorOf();
    }

    // console.log(cellsToSHighlight);
    console.log("ТУТ ПОПЫКТКА ОТПРАВИТЬ");
    const chessArr = this.board.getChessToSend();
    console.log(chessArr);
    //тут надо отправлять доску на сервер
    // this.socket.emit("board update", chessArr);
    this.onBoardUpdateCallback(chessArr);

    console.log("Перед покраской ", canMoveIt);
    cellsToSHighlight?.forEach((el) => {
      el.cell.setHighlight(
        true,
        el.action == "move"
          ? canMoveIt
            ? 0x0066bb
            : 0x117766
          : canMoveIt
          ? 0xaa1177
          : 0x560155
      );
    });

    fetch(`/update-board/${this.boardId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chessArr }),
    });

    this.render();
  }

  private onBoardUpdateCallback: (chessArr: ChessData[]) => void = () => {};

  public onBoardUpdate(callback: (chessArr: ChessData[]) => void) {
    this.onBoardUpdateCallback = callback;
  }

  private getLoop(): void {
    setInterval(() => {
      fetch(`/get-board/${this.boardId}`)
        .then((response) => response.json())
        .then((data) => {
          // console.log("обновление доски ", data);

          this.board.restoreFigures(data.chessArr);
          this.board.setStep(data.stepNumber);
        });

      fetch(`/get-enviroment/${this.boardId}`) //потом на этом сэкономить
        .then((response) => response.json())
        .then((data) => {
          // console.log("обновление доски ", data);

          this.board.restoreEnv(data.chessArr);
        });

      this.onGameStateUpdateCallback({
        step: this.board.getStep(),
        playingSide: this.player.getPlayingSide(),
      });

      this.render();
    }, 1000 / FREQUENCY_UPDATE);
  }

  cellColorOf() {
    this.activeChessFigure = null;

    for (const figure of this.board.getFlatCells()) {
      if (figure instanceof Cell) {
        figure.setHighlight(false);
      }
    }
  }
  isPlayer(): boolean {
    const playerId = this.player.getId();

    if (!this.gamersId.some((gamer) => gamer.hasOwnProperty(playerId))) {
      console.log("Ты не игрок в этой партии!", this.gamersId, playerId);
      return false;
    }

    return true;
  }
}
