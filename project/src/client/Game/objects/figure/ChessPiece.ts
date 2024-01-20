import * as THREE from "three";
import { Cell } from "../Cell";
import { Figure } from "./Figure";
import { Board } from "../Board";

export class ChessPiece extends Figure {
  protected cell: Cell;
  public mesh: THREE.Mesh;
  private board: Board;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    board: Board,
    cell: Cell,
    color: number
  ) {
    super(scene, camera, color);
    this.cell = cell;
    this.mesh = this.createMesh();
    this.board = board;

    this.draw();
    this.mesh.addEventListener("click", this.onClick.bind(this));
  }
  protected createMesh(): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      // color: this.color, тут нужен рандомный цвет для тестирования
      color: Math.random() * 0xffffff,
    });
    return new THREE.Mesh(geometry, material);
  }
  public draw() {
    const hook = this.cell.getHook();
    this.mesh.position.copy(hook);
    this.scene.add(this.mesh);
  }
  move(newCell: Cell) {
    this.cell = newCell;
    this.draw();
  }
  public getCell(): Cell {
    return this.cell;
  }

  remove() {
    this.scene.remove(this.mesh);
  }
  private onClick(event: THREE.Event) {
    console.log("Фигура была кликнута!", this);
  }
  public onSelect(): { cell: Cell; action: "move" | "attack" }[] {
    //возвращать куда можешь идти
    console.log("Я выбран:");
    console.log(this);
    console.log("________]");
    const allCheses = this.board.getFigures();

    const targetCells: Cell[] = [
      this.cell,
      this.board.getCells()[0][0],
      this.board.getCells()[0][2],
      // получить клетки на которые можно идти для конкретной фигуры
    ];
    const canAttackCells: Cell[] = [
      this.cell,
      this.board.getCells()[0][0],
      this.board.getCells()[0][2],
      // получить клетки на которых можем бить
    ];

    const occupiedCells: Cell[] = [];
    const arrayOfActions: { cell: Cell; action: "move" | "attack" }[] = [];

    for (const targetCell of targetCells) {
      const isOccupied = allCheses.some(
        (chess) => chess.getCell() === targetCell
      );
      if (!isOccupied) {
        arrayOfActions.push({ cell: targetCell, action: "move" });
      }
    }

    for (const attackCell of canAttackCells) {
      const attackedChess = allCheses.find(
        (chess) => chess.getCell() === attackCell
      );
      if (attackedChess) {
        arrayOfActions.push({ cell: attackCell, action: "attack" });
      }
    }

    //TODO
    return arrayOfActions;
  }
}
