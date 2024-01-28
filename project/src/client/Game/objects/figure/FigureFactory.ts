import { Board } from "../Board";
import { Cell } from "../Cell";
import { BishopFigure } from "./BishopFigure";
import { ChessPiece } from "./ChessPiece";
import { KingFigure } from "./KingFigure";
import { KnightFigure } from "./KnightFigure";
import { PawnFigure } from "./PawnFigure";
import { QueenFigure } from "./QueenFigure";
import { RootFigure } from "./RootFigure";

export class ChessFigureFactory {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private board: Board;
  private cell: Cell;
  private color: number;
  private teamId: 0 | 1;
  private id?: number | null|string;
  // тут перечислить все
  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    board: Board,
    cell: Cell,
    color: number,
    teamId: 0 | 1,
    id?: number | null|string
  ) {
    this.scene = scene;
    this.camera = camera;
    this.board = board;
    this.cell = cell;
    this.color = color;
    this.teamId = teamId;
    this.id = id;
  }

  createFigure(type: string): ChessPiece | null {
    const figureClasses: Record<string, any> = {
      PawnFigure: PawnFigure,
      BishopFigure: BishopFigure,
      KnightFigure: KnightFigure,
      KingFigure: KingFigure,
      QueenFigure: QueenFigure,
      RootFigure: RootFigure,
    };

    const FigureClass = figureClasses[type];

    if (FigureClass) {
      return new FigureClass(
        this.scene,
        this.camera,
        this.board,
        this.cell,
        this.color,
        this.teamId,
        this.id
      );
    } else {
      console.error(`Unknown figure type: ${type}`);
      return null;
    }
  }
}
