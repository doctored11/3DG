import * as THREE from "three";
import { Board } from "../Board";
import { Cell } from "../Cell";
import { ChessPiece } from "./ChessPiece";

export class BishopFigure extends ChessPiece{
    
    comment : string="-_-";
    protected type: string='bishop'
    constructor(
        scene: THREE.Scene,
        camera: THREE.Camera,
        board: Board,
        cell: Cell,
        color: number,
        teamId:0|1,
        id?:number|null
        ) {

            super(scene, camera, board, cell, color, id || null,teamId);

    
        this.cell = cell;
        this.scene = scene;
        this.teamId = teamId;
        this.board = board;

        this.mesh = this.createMesh('BishopFigure', 1,1);//ну это жесткий прикол -_-
        
        this.draw()

    }
    
    public draw() {
        const hook = this.cell.getHook();
        this.mesh.position.copy(hook);
        this.scene.add(this.mesh);
    }

    public getFigureAction(): Cell[][] {
        const cellArr = this.board.getCells();
        const [indexX, indexY] = this.cell.getIndex();
        const allfigures = this.board.getFigures();
        const canAttackCells: Cell[] = [];
        const canMoveCells : Cell[] = [];
        console.log(cellArr)

        const actionMoves = [
            {deltaX : 1, deltaY : 1},
            {deltaX : -1,deltaY : -1},
            {deltaX : -1,deltaY : 1},
            {deltaX : 1, deltaY : -1}
        ]

        for (const move of actionMoves){
            for (let n = 1; n < cellArr.length -1 ; n++){
                const newIndexX = indexX + move.deltaX*n
                const newIndexY = indexY + move.deltaY*n
                
                if (
                    newIndexX >= 0 &&
                    newIndexX < cellArr.length &&
                    newIndexY >= 0 &&
                    newIndexY < cellArr[0].length
                  ){
                    // canMoveCells.push(forwardCell)
                    const forwardCell = cellArr[newIndexX][newIndexY];
                    let isOccupied = null;
                    let occupiedTeamId = null;

                    for(const figure of allfigures){
                        if (figure.getCell() == forwardCell){
                            isOccupied = true;
                            occupiedTeamId = figure.getTeamId();
                        }
                    }

                    if (isOccupied){
                        if(this.teamId != occupiedTeamId )
                            canAttackCells.push(forwardCell)
                        break
                    }
                    canMoveCells.push(forwardCell)
                  }
                else{
                    break;
                }
            }
        }

        return [canMoveCells,canAttackCells]
    }

}