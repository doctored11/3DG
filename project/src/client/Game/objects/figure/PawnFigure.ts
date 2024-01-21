import * as THREE from "three";
import { Board } from "../Board";
import { Cell } from "../Cell";
import { ChessPiece } from "./ChessPiece";

export class PawnFigure extends ChessPiece {
  protected type: string = "pawn";

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    board: Board,
    cell: Cell,
    color: number,
    id?: number | null
  ) {
    super(scene, camera, board, cell, color, id || null);

    this.cell = cell;
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
    let cellArr = this.board.getCells();
    let indexX = this.cell.getIndex()[0];
    let indexY = this.cell.getIndex()[1];
    if (indexY == 1){
        return [cellArr[indexX][indexY + 1], cellArr[indexX][indexY + 2]];
    }
    return [cellArr[indexX][indexY+1]] 
    
  }
  public canAttack(): Cell[]{
    const cellArr = this.board.getCells();
    const [ indexX, indexY ]= this.cell.getIndex();
    let canAttackCells: Cell[] = []; 

    const attackMoves = [
        { deltaX: -1, deltaY: 1 }, 
        { deltaX: 1, deltaY: 1 }, 
      ];
    
    for (const move of attackMoves){
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
