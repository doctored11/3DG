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
  // private socket: any;
  private key: string;
  private gameZone: HTMLDivElement;
  private scene: THREE.Scene = new THREE.Scene();
  private clientId: string = "_0";

  protected raycaster!: THREE.Raycaster;
  private renderer!: THREE.WebGLRenderer;
  private playerCamera!: THREE.PerspectiveCamera;
  private board!: Board;

  private boardId: number | null = -1;

  public player: { x: number; y: number; color: string };

  private activeChessFigure: ChessPiece | null = null;

  constructor(key: string, gameZone: HTMLDivElement) {
    // this.socket = socket;
    this.key = key;
    this.gameZone = gameZone;
    this.initThree();
    this.setupEventHandlers();
    this.raycaster = new THREE.Raycaster();

    this.player = { x: 0, y: 0, color: "pink" };

    window.addEventListener("click", (event) => this.onClick(event));
  }

  private setupEventHandlers() {
    const chessArr = this.board.getChessToSend();
    console.log("ВХОД");
    console.log(chessArr);
    //тут надо отправлять доску на сервер

    // this.socket.emit("board update", chessArr);

    fetch("/create-board", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ boardId: -1 }), // Здесь передается -1 как значение id (вы можете изменить это на нужное вам значение)
    })
      .then((response) => response.json())
      .then((data) => {
        const newBoardId = data.boardId;
        // Используйте newBoardId по своему усмотрению
      });

    this.render();
    this.getLoop()
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

    this.board = new Board(this.scene, this.playerCamera, 9, 9);
    this.board.render();

    const boardCells = this.board.getCells();

    this.playerCamera.position.add(new THREE.Vector3(37, 25, 30));
    this.playerCamera.lookAt(new THREE.Vector3(37, 30, 5));
    this.playerCamera.setFocalLength(5);
  }

  private render() {
    console.log("render ", !this.renderer || !this.gameZone);
    if (!this.renderer || !this.gameZone) return;

    this.scene.clear();
    this.board.render()
    //  тут был слушатель
   
    this.renderer.render(this.scene, this.playerCamera);
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
    //тут надо отправлять доску на сервер
    // this.socket.emit("board update", chessArr);
    this.onBoardUpdateCallback(chessArr);

    cellsToSHighlight?.forEach((el) => {
      el.cell.setHighlight(true, el.action == "move" ? 0x0066bb : 0xaa1177);
    });

    fetch(`/update-board/${this.boardId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chessArr }), 
    })

    this.render()
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
        console.log("обновление доски ", data);
        this.board.restoreFigures(data);
        this.render()
      });
    }, 1000 / 5);
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
