import * as THREE from "three"
import { Board } from "../Board";
import { Cell } from "../Cell";
import { ChessPiece } from "./ChessPiece";

export class KingFigure extends ChessPiece{

    private actionMoves = [
        {deltaX : 0, deltaY : 1},
        {deltaX : 1,deltaY : 0},
        {deltaX : -1,deltaY : 0},
        {deltaX : 0, deltaY : -1},
        {deltaX : 1, deltaY : 1},
        {deltaX : -1,deltaY : -1},
        {deltaX : -1,deltaY : 1},
        {deltaX : 1, deltaY : -1}
    ]
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
        this.isBigMove = false;

        this.mesh = this.createMesh(this.type, 2.5,2.5);//ну это жесткий прикол -_-
        this.draw()

    }

    public getActionMoves() : any{
        return this.actionMoves
    }
}