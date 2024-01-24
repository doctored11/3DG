
import { Board } from "../../Board";
import { Cell } from "../../Cell";
import { SpecialObject } from "./SpecialObject";

export class Rock extends SpecialObject{
    constructor(
        scene: THREE.Scene,
        camera: THREE.Camera,
        board: Board,
        cell: Cell,
        color: number,
        id?:number|null
        ) {

            super(scene, camera, board, cell, color, id || 0 );
    
        this.cell = cell;
        this.scene = scene;
        this.board = board;

        this.mesh = this.createMesh(this.type);//ну это жесткий прикол -_-
        this.draw()
    }

}