import * as THREE from "three";
import { Cell } from "../Cell";
import { Figure } from "./Figure";
import { Board } from "../Board";
import { BishopFigure } from "./BishopFigure";

export class ChessPiece extends Figure {
  protected cell: Cell;
  public mesh: THREE.Mesh;
  protected board: Board;
  protected id: number;
  protected type: string = "chess";
  protected teamId: 0 | 1;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    board: Board,
    cell: Cell,
    color: number,
    id: number | null,
    teamId: 0 | 1
  ) {
    super(scene, camera, color);
    this.cell = cell;
    this.mesh = this.createMesh(1, 1);
    this.board = board;
    this.id = id || Math.round(Math.random() * 8000) + 1;
    this.draw();
    this.teamId = teamId || 0;
    this.mesh.addEventListener("click", this.onClick.bind(this));
  }
  protected createMesh(color: number, size: number): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshBasicMaterial({
      color: this.color,
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
  public getType(): string {
    return this.type;
  }
  public getTeamId(): 0 | 1 {
    return this.teamId;
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

    console.log(this.canMove());
    const targetCells: Cell[] = this.canMove();
    const canAttackCells: Cell[] = this.canAttack();

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
        (chess) =>
          chess.getCell() === attackCell &&
          chess.getTeamId() != this.getTeamId()
      );
      if (attackedChess) {
        arrayOfActions.push({ cell: attackCell, action: "attack" });
      }
    }
    //TODO
    return arrayOfActions;
  }
  public canMove(): Cell[] {
    console.log(this, "CanMove родителя");
    return this.board.getCells()[0];
  }

  public canAttack(): Cell[] {
    return this.board.getCells()[0];
  }
}
