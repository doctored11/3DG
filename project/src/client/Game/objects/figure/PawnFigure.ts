import * as THREE from "three";
import { Board } from "../Board";
import { Cell } from "../Cell";
import { ChessPiece } from "./ChessPiece";

export class PawnFigure extends ChessPiece {
  protected type: string = "pawn";
  private startLineModule: number = 2;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    board: Board,
    cell: Cell,
    color: number,
    teamId: 0 | 1,
    id?: number | null
  ) {
    super(scene, camera, board, cell, color, id || null, teamId);

    this.cell = cell;
    const [x, y] = cell.getIndex();
    const cellsArr = this.board.getCells();
    if (
      (teamId && y != this.startLineModule) ||
      (!teamId && y != cellsArr[0].length - this.startLineModule)
    ) {
      this.cell =
        cellsArr[x][
          teamId
            ? this.startLineModule
            : cellsArr[0].length - this.startLineModule
        ];
    }

    this.scene = scene;

    this.mesh = this.createMesh(this.color, 1);

    this.draw();
  }

  public draw() {
    const hook = this.cell.getHook();
    this.mesh.position.copy(hook);
    this.scene.add(this.mesh);
  }

  public canMove(): Cell[] {
    const cellArr = this.board.getCells();
    const [indexX, indexY] = this.cell.getIndex();
    const possibleMoves: Cell[] = [];

    const allfigures = this.board.getFigures();

    const forwardCell = cellArr[indexX][indexY + 1];
    const isOccupied = allfigures.some(
      //если есть идеи - лучше реализовать иначе
      (chess) => chess.getCell() == forwardCell
    );

    if (forwardCell && !isOccupied) {
      possibleMoves.push(forwardCell);

      const startLine = this.getTeamId()
        ? this.startLineModule
        : cellArr[0].length - this.startLineModule;

      if (indexY == startLine) {
        const secondForwardCell = cellArr[indexX][indexY + 2];
        const isSecondOccupied = allfigures.some(
          (chess) => chess.getCell() == secondForwardCell
        );

        if (secondForwardCell && !isSecondOccupied) {
          possibleMoves.push(secondForwardCell);
        }
      }
    }

    return possibleMoves;
  }

  public canAttack(): Cell[] {
    const cellArr = this.board.getCells();
    const [indexX, indexY] = this.cell.getIndex();
    let canAttackCells: Cell[] = [];

    const attackMoves = [
      { deltaX: -1, deltaY: 1 },
      { deltaX: 1, deltaY: 1 },
    ];

    for (const move of attackMoves) {
      const newIndexX = indexX + move.deltaX;
      const newIndexY = indexY + move.deltaY;

      if (
        newIndexX >= 0 &&
        newIndexX < cellArr.length &&
        newIndexY >= 0 &&
        newIndexY < cellArr[0].length
      ) {
        const targetCell = cellArr[newIndexX][newIndexY];

        canAttackCells.push(targetCell);
      }
    }

    return canAttackCells;
  }
}
