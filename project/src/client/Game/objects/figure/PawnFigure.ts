import * as THREE from "three";
import { Board } from "../Board";
import { Cell } from "../Cell";
import { ChessPiece } from "./ChessPiece";

export class PawnFigure extends ChessPiece{

    constructor(
        scene: THREE.Scene,
        camera: THREE.Camera,
        board: Board,
        cell: Cell,
        color: number
        ) {

        super(scene,camera,board,cell,color);
        this.color = 0.7;
        this.cell = cell;
        this.scene = scene;

        this.mesh = this.createMesh(this.color, 1);
        
        this.draw()

        }
        
        public draw() {
            const hook = this.cell.getHook();
            this.mesh.position.copy(hook);
            this.scene.add(this.mesh);
        }

        public canMove(): Cell[]{
            let pos = this.cell.getPosition()
            let cellArr = this.board.getCells();
            let canMoveCell: Cell[] = [];
    
            let indexX = 0;
            let indexY = 0;
    
            for (let i = 0; i < cellArr.length; i++){
                for (let j = 0; j < cellArr[i].length; j++){
                    if (this.cell === cellArr[i][j]){
                        indexX = i;
                        indexY = j;
                        break;
                    }
                }
            }
            
            return [cellArr[indexX][indexY+1], cellArr[indexX][indexY+2]]
        }
}