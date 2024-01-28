import * as THREE from "three";
import { Cell } from "../Cell";
import { Figure } from "./Figure";
import { Board } from "../Board";

export class ChessPiece extends Figure {
  protected cell: Cell;
  public mesh: THREE.Mesh;
  protected board: Board;
  protected id: number | string;
  protected type = this.constructor.name;
  protected teamId: 0 | 1;
  protected isBigMove: boolean;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    board: Board,
    cell: Cell,
    color: number,
    id: number | null | string,
    teamId: 0 | 1
  ) {
    super(scene, camera, color);
    this.cell = cell;
    this.mesh = this.createMesh("PawnFigure", 2.5, 2.5);
    this.board = board;
    this.id =
      id ||
      "Chess-" +
        Math.round(Math.random() * 8000) +
        1 +
        "-" +
        Math.round(Math.random() * 100) +
        1 +
        "-" +
        Date.now();
    this.draw();
    this.teamId = teamId || 0;
    this.mesh.addEventListener("click", this.onClick.bind(this));
    this.isBigMove = false;
  }

  protected createMesh(type: string, size: number, color: number): THREE.Mesh {
    const figureTypes: any = {
      BishopFigure: new THREE.SphereGeometry(size),
      QueenFigure: new THREE.SphereGeometry(size * 1.5),
      PawnFigure: new THREE.BoxGeometry(size, size, size),
      KnightFigure: new THREE.BoxGeometry(size, size, size * 2),
      KingFigure: new THREE.BoxGeometry(size * 2, size * 2, size * 3),
      RootFigure: new THREE.BoxGeometry(size * 1.5, size * 1.5, size * 1.5),
    };
    const geometry = figureTypes[type];
    const material = new THREE.MeshBasicMaterial({ color: this.color });
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
    console.log("____+board у фигуры", this);
    const allCheses = this.board.getFigures();

    const [targetCells, canAttackCells] = this.getFigureAction();
    console.log(targetCells, canAttackCells);
    console.log("получены действия \n\n\n");

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

  public getFigureAction(): Cell[][] {
    const cellArr = this.board.getCells();
    const [indexX, indexY] = this.cell.getIndex();

    const allfigures = this.board.getFigures();
    const allEnv = this.board.getEnviroment();
    console.log("___Получаем действие__\n\n");
    console.log(allEnv);
    console.log(allfigures);
    console.log("_____________\n\n\n");

    const actionMoves = this.getActionMoves();
    const moveRad = this.isBigMove ? cellArr.length : 2;

    const canAttackCells: Cell[] = [];
    const canMoveCells: Cell[] = [];

    for (const move of actionMoves) {
      for (let n = 1; n < moveRad; n++) {
        const newIndexX = indexX + move.deltaX * n;
        const newIndexY = indexY + move.deltaY * n;

        if (
          newIndexX >= 0 &&
          newIndexX < cellArr.length &&
          newIndexY >= 0 &&
          newIndexY < cellArr[0].length
        ) {
          // canMoveCells.push(forwardCell) метод определен снизу
          const forwardCell = cellArr[newIndexX][newIndexY];
          let isOccupied = null;
          let occupiedTeamId = null;

          for (const figure of allfigures) {
            if (figure.getCell().getId() == forwardCell.getId()) {
              isOccupied = true;
              occupiedTeamId = figure.getTeamId();
            }
          }

          for (const env of allEnv) {
            if (env.getCell().getId() == forwardCell.getId()) {
              isOccupied = true;
              occupiedTeamId = -1;
            }
          }

          if (isOccupied) {
            if (this.teamId != occupiedTeamId) canAttackCells.push(forwardCell);
            break;
          }
          canMoveCells.push(forwardCell);
        } else {
          break;
        }
      }
    }

    return [canMoveCells, canAttackCells];
  }

  public getActionMoves(): any {
    return [
      { deltaX: 1, deltaY: 1 },
      { deltaX: -1, deltaY: -1 },
    ];
  }
  public getFigureType() {
    return this.type;
  }
}
