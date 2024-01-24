import React, { useEffect, useRef } from "react";

import * as THREE from "three";
import { Board } from "./objects/Board";
import { ChessPiece } from "./objects/figure/ChessPiece";
import { Figure } from "./objects/figure/Figure";
import { Cell } from "./objects/Cell";
import { ChessData } from "./objects/Board";

interface ClientPlayer {
  x: number;
  y: number;
  name: string;
  color: string;
  id: string;
  // Добавляем сигнатуру индекса
  [key: string]: any;
}

export class Game {
  private socket: any;
  private key: string;
  private gameZone: HTMLDivElement;
  private scene: THREE.Scene = new THREE.Scene();
  private clientId: string = "_0";

  protected raycaster!: THREE.Raycaster;
  private renderer!: THREE.WebGLRenderer;
  private playerCamera!: THREE.PerspectiveCamera;
  private board!: Board;

  private activeChessFigure: ChessPiece | null = null;
  // private activeCell: Cell | null = null;

  constructor(socket: any, key: string, gameZone: HTMLDivElement) {
    this.socket = socket;
    this.key = key;
    this.gameZone = gameZone;
    this.initThree();
    this.setupEventHandlers();
    this.raycaster = new THREE.Raycaster();

    window.addEventListener("click", (event) => this.onClick(event));
  }

  private setupEventHandlers() {
    this.socket.emit("new player");
    this.startPlayerGame();

    const chessArr = this.board.getChessToSend();
    console.log(chessArr);
    this.socket.emit("board update", chessArr);

    this.render();
  }
  private listen(key: string): Promise<any> {
    return new Promise((resolve) => {
      this.socket.on(key, function (data: any) {
        console.log(`получено по ключу ${key}:` + data);
        resolve(data);
      });
    });
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

    // this.figures=boardCells

    this.playerCamera.position.z = 10;
  }
  private async startPlayerGame() {
    const myUs = this.listen("generate");
    const { id, color } = await myUs;
    this.clientId = id;
  }

  private createCube(x: number, y: number, color: string): THREE.Object3D {
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: color });

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(x, y, 3);

    const wireframeGeometry = new THREE.WireframeGeometry(cubeGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 2,
    });
    const wireframe = new THREE.Line(wireframeGeometry, wireframeMaterial);
    cube.add(wireframe);

    return cube;
  }

  private render() {
    if (!this.renderer || !this.gameZone) return;
    this.socket.on("state", (players: Record<string, ClientPlayer>) => {
      // console.log(" update:", players); //вывод игроков получаемых с сервера с их позицией
      this.scene.clear();
      this.board.render();

      // console.log(boardCells[0][1]);
      //перемещение игрока(причем максималььно затратное) убрать
      for (const id in players) {
        const player = players[id];
        //этот ад временный - обязательно будет убрано (тест)
        const cube = this.createCube(player.x, player.y, player.color);
        if (this.clientId == player.id) {
          this.playerCamera.position.set(player.x - 1, player.y - 10, 15);
          this.playerCamera.lookAt(new THREE.Vector3(player.x, player.y, 0));
        }
        this.scene.add(cube);
      }

      this.renderer.render(this.scene, this.playerCamera);
    });
    this.socket.on("board update", (data: ChessData[]) => {
      // console.log("обновление доски");
      // console.log(data)
      this.board.restoreFigures(data);
      this.board.render();
      this.renderer.render(this.scene, this.playerCamera);
    });
  }

  protected onClick(event: MouseEvent) {
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

    const firstIntersection = intersectionsArray[0];

    const cellsToSHighlight:
      | { cell: Cell; action: "move" | "attack" }[]
      | null = firstIntersection.onSelect();

    //Зачаток к логике передвижения
    console.log("Готовность двигаться!");
    console.log(this.activeChessFigure);
    // console.log(this.activeCell)
    if (firstIntersection instanceof ChessPiece) {
      this.cellColorOf();
      this.activeChessFigure = firstIntersection;
      console.log("Выбрана основная фигура!");
      console.log(firstIntersection);
    } else if (
      firstIntersection instanceof Cell &&
      firstIntersection.getHighlightStatus()
    ) {
      // console.log("Возможен Мув!");
      // console.log(this.activeChessFigure || "а где?");
      // console.log(cellsToSHighlight || "нет выделенных клеток для действий");
      let action: string = "move";
      // console.log("___+!");
      // console.log(cellsToSHighlight);

      this.activeChessFigure?.onSelect()?.forEach((el) => {
        console.log(el.cell === firstIntersection);
        if (el.cell === firstIntersection) action = el.action;
      });
      console.log(action);

      if (action == "attack") {
        this.board.getFigures().forEach((chess) => {
          if (
            chess.getCell() == firstIntersection &&
            chess.getTeamId() != this.activeChessFigure?.getTeamId()
          ) {
            console.log(
              "ААА он убит! -> " + JSON.stringify(chess.getPosition())
            );
            //да - как то получилось 2 массива из которых надо удалять ( массив на клики и массив на отрисовку)
            this.board.removeChess(chess);
            this.activeChessFigure?.move(firstIntersection);
          }
        });
      }
      if (action == "move") {
        this.activeChessFigure?.move(firstIntersection);
      }

      this.cellColorOf();
    } else if (firstIntersection instanceof Cell) {
      this.cellColorOf();
    }

    // console.log(cellsToSHighlight);
    console.log("ТУТ ПОПЫКТКА ОТПРАВИТЬ");
    const chessArr = this.board.getChessToSend();
    console.log(chessArr);
    this.socket.emit("board update", chessArr);
    cellsToSHighlight?.forEach((el) => {
      el.cell.setHighlight(true, el.action == "move" ? 0x0066bb : 0xaa1177);
    });
  }

  cellColorOf() {
    this.activeChessFigure = null;

    for (const figure of this.board.getFlatCells()) {
      if (figure instanceof Cell) {
        figure.setHighlight(false);
      }
    }
  }
}
