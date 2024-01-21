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
        id?:number|null
        ) {

        super(scene,camera,board,cell,color,id||null);

    
        this.cell = cell;
        this.scene = scene;
        
        this.board = board;

        this.mesh = this.createMesh(this.color, 3);//ну это жесткий прикол -_-
        
        this.draw()

    }
    
    public draw() {
        const hook = this.cell.getHook();
        this.mesh.position.copy(hook);
        this.scene.add(this.mesh);
    }

    // public canMove(){
    //     let pos = this.cell.getPosition()
    //     let cellArr = this.board.getCells();
    //     let canMoveCell: Cell[] = [];

    //     let indexX;
    //     let indexY;

    //     for (let i = 0; i < cellArr.length; i++){
    //         for (let j = 0; j < cellArr[i].length; j++){
    //             if (this.cell === cellArr[i][j]){
    //                 indexX = i;
    //                 indexY = j;
    //                 break;
    //             }
    //         }
    //     }
        

    // }

}