import React, { useEffect, useRef } from "react";

import * as THREE from "three";
import { Board } from "./objects/Board";
import { ChessPiece } from "./objects/figure/ChessPiece";
import { Figure } from "./objects/figure/Figure";
import { Cell } from "./objects/Cell";

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
  protected figures: Figure[] = [];

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
    this.board = new Board(this.scene, this.playerCamera, 9, 9);
    this.board.render();
    const boardCells = this.board.getCells();

    // this.figures=boardCells

    //фигуры по которым может быть клик надо хранить в this.figures
    this.figures = boardCells.reduce((acc, row) => acc.concat(row), []);
    this.figures.push(...this.board.getFigures());

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
  }

  protected onClick(event: MouseEvent) {
    const pointer = new THREE.Vector2();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (-event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(pointer, this.playerCamera);
    const intersectionsArray: Figure[] = [];

    for (const figure of this.figures) {
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

    //Зачаток к логике передвижения
    console.log("Готовность двигаться!");
    console.log(this.activeChessFigure);
    // console.log(this.activeCell)
    if (firstIntersection instanceof ChessPiece) {
      this.cellColorOf();
      this.activeChessFigure = firstIntersection;
      console.log("Выбрана основная фигура!");
    } else if (
      firstIntersection instanceof Cell &&
      firstIntersection.getHighlightStatus()
    ) {
      console.log("Возможен Мув!");
      console.log(this.activeChessFigure || "а где?");

      this.activeChessFigure?.move(firstIntersection);
      this.cellColorOf();
    } else if (firstIntersection instanceof Cell) {

      this.cellColorOf();
    }

    const cellsToSHighlight:
      | { cell: Cell; action: "move" | "attack" }[]
      | null = firstIntersection.onSelect();

    console.log(cellsToSHighlight);
    cellsToSHighlight?.forEach((el) => {
      el.cell.setHighlight(true, el.action == "move" ? 0x0066bb : 0xaa1177);
    });
  }

  cellColorOf() {
    this.activeChessFigure = null;

    for (const figure of this.figures) {
      if (figure instanceof Cell) {
        figure.setHighlight(false);
      }
    }
  }
}
