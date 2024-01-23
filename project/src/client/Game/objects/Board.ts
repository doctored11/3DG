import { Cell } from "./Cell";
import { BishopFigure } from "./figure/BishopFigure";
import { ChessPiece } from "./figure/ChessPiece";
import { PawnFigure } from "./figure/PawnFigure";
import { RootFigure } from "./figure/RootFigure";
import { QueenFigure } from "./figure/QueenFigure";
import { KingFigure } from "./figure/KingFigure";
import { KnightFigure } from "./figure/KnightFigure";
import { ChessFigureFactory } from "./figure/FigureFactory";

export class Board {
  private cells: Cell[][] = [];
  private sizeX;
  private sizeY;
  protected scene: THREE.Scene;
  protected camera: THREE.Camera;
  protected chesses: ChessPiece[] = [];

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    sizeI: number,
    sizeJ: number
  ) {
    this.sizeX = sizeI;
    this.sizeY = sizeJ;
    this.scene = scene;
    this.camera = camera;
    this.createBoard(sizeI, sizeJ);
  }

  private createBoard(sizeI: number, sizeJ: number): void {
    for (let i = 0; i < sizeI; ++i) {
      this.cells[i] = [];
      for (let j = 0; j < sizeJ; ++j) {
        const cell = new Cell(
          this.scene,
          this.camera,
          i,
          j,
          Number.parseInt("" + (i + 1) + (j + 1))
        );
        this.cells[i][j] = cell;
      }
    }

    this.figuresInit();
  }
  private figuresInit(): void {
    // тут будет начальная расстановка фигур
    for (let i = 0; i < this.sizeX; i++) {
      const pawn = new PawnFigure(
        this.scene,
        this.camera,
        this,
        this.cells[i][1],
        Math.round(Math.random() * 0xffffff * 0.4) + 0xffffff * 0.6, //простите если сломал (но мне нужен цвет на этом этапе)
        1
      );
      this.chesses.push(pawn);
    }
    for (let j = 2; j < this.sizeX - 1; j += 3) {
      const bishop = new BishopFigure(
        this.scene,
        this.camera,
        this,
        this.cells[j][0],
        Math.round(Math.random() * 0xffffff * 0.4) + 0xffffff * 0.6, //простите если сломал (но мне нужен цвет на этом этапе)
        1
      );
      this.chesses.push(bishop);
    }
    for (let i = 0; i < this.sizeX; i++) {
      const pawn = new PawnFigure(
        this.scene,
        this.camera,
        this,
        this.cells[i][this.sizeY - 1],
        Math.round((Math.random() * 0xffffff) / 8), //простите если сломал (но мне нужен цвет на этом этапе)
        0
      );
      this.chesses.push(pawn);
    }
    for (let j = 2; j < this.sizeX - 1; j += 3) {
      const bishop = new BishopFigure(
        this.scene,
        this.camera,
        this,
        this.cells[j][this.sizeY - 1],
        Math.round(Math.random() * 0xffffff * 0.4) + 0xffffff * 0.6, //простите если сломал (но мне нужен цвет на этом этапе)
        0
      );
      this.chesses.push(bishop);
    }
    for (let z = 0; z < this.sizeX; z += 7) {
      const root = new RootFigure(
        this.scene,
        this.camera,
        this,
        this.cells[z][0],
        Math.round(Math.random() * 0xffffff * 0.4) + 0xffffff * 0.6, //простите если сломал (но мне нужен цвет на этом этапе)
        1
      );
      this.chesses.push(root);
    }
    for (let z = 0; z < this.sizeX; z += 7) {
      const root = new RootFigure(
        this.scene,
        this.camera,
        this,
        this.cells[z][this.sizeY - 1],
        Math.round(Math.random() * 0xffffff * 0.4) + 0xffffff * 0.6, //простите если сломал (но мне нужен цвет на этом этапе)
        0
      );
      this.chesses.push(root);
    }
    for (let v = 1; v < this.sizeX; v += 5) {
      const knight = new KnightFigure(
        this.scene,
        this.camera,
        this,
        this.cells[v][0],
        Math.round(Math.random() * 0xffffff * 0.4) + 0xffffff * 0.6, //простите если сломал (но мне нужен цвет на этом этапе)
        1
      );
      this.chesses.push(knight);
    }
    const queen = new QueenFigure(
      this.scene,
      this.camera,
      this,
      this.cells[3][0],
      Math.round(Math.random() * 0xffffff * 0.4) + 0xffffff * 0.6, //простите если сломал (но мне нужен цвет на этом этапе)
      1
    );
    this.chesses.push(queen);

    const king = new KingFigure(
      this.scene,
      this.camera,
      this,
      this.cells[4][0],
      Math.round(Math.random() * 0xffffff * 0.4) + 0xffffff * 0.6, //простите если сломал (но мне нужен цвет на этом этапе)
      1
    );
    this.chesses.push(king);
  }
  public render(): void {
    for (let i = 0; i < this.cells.length; ++i) {
      for (let j = 0; j < this.cells[i].length; ++j) {
        this.cells[i][j].draw();
      }
    }
    this.chesses.forEach((el) => {
      el.draw();
    });
  }
  public removeChess(chess: ChessPiece) {
    const index = this.chesses.indexOf(chess);
    if (index !== -1) {
      this.chesses.splice(index, 1);
    }
  }

  private getAllCellsMeshes(): THREE.Mesh[] {
    const meshes: THREE.Mesh[] = [];
    for (const row of this.cells) {
      for (const cell of row) {
        meshes.push(cell.getMesh());
      }
    }
    return meshes;
  }
  public getCells(): Cell[][] {
    return this.cells;
  }
  public getFlatCells(): Cell[] {
    return this.cells.flat();
  }
  public getFigures(): ChessPiece[] {
    return this.chesses;
  }
  public restoreFigures(arr: ChessData[]): void {
    // console.log(arr);
    // нагруженно но пока так
    const currentFigures = [...this.getFigures()];
    // console.log(currentFigures)

    if (arr.length < 1) return;

    const removedFigures = currentFigures.filter(
      (chess) => !arr.some((el) => el.id === chess.getId())
    );
    if (removedFigures.length > 0) {
      removedFigures.forEach((removedChess) => {
        this.removeChess(removedChess);
      });
    }

    arr.forEach((el) => {
      const existingChess = currentFigures.find(
        (chess) => chess.getId() === el.id
      );

      if (existingChess) {
        const cell = this.getCellById(el.cellId);
        if (cell) {
          existingChess.move(cell);
        }
      } else {
        const cell = this.getCellById(el.cellId);
        if (!cell) return;
        const type = el.type;
        let newChess: ChessPiece | null = null;
        console.log("типок: ", type);
        // switch (type) {
        //   case "PawnFigure":
        //     newChess = new PawnFigure(
        //       this.scene,
        //       this.camera,
        //       this,
        //       cell,
        //       el.color,
        //       el.teamId,
        //       el.id
        //     );
        //     console.log(newChess);
        //     break;
        //   case "BishopFigure":
        //     newChess = new BishopFigure(
        //       this.scene,
        //       this.camera,
        //       this,
        //       cell,
        //       el.color,
        //       el.teamId,
        //       el.id
        //     );
        //     console.log(newChess);
        //     break;
        //   case "KnightFigure":
        //     newChess = new KnightFigure(
        //       this.scene,
        //       this.camera,
        //       this,
        //       cell,
        //       el.color,
        //       el.teamId,
        //       el.id
        //     );
        //     console.log(newChess);
        //     break;
        //   case "KingFigure":
        //     newChess = new KingFigure(
        //       this.scene,
        //       this.camera,
        //       this,
        //       cell,
        //       el.color,
        //       el.teamId,
        //       el.id
        //     );
        //     console.log(newChess);
        //     break;
        //   case "QueenFigure":
        //     newChess = new QueenFigure(
        //       this.scene,
        //       this.camera,
        //       this,
        //       cell,
        //       el.color,
        //       el.teamId,
        //       el.id
        //     );
        //     console.log(newChess);
        //     break;
        //   case "RootFigure":
        //     newChess = new RootFigure(
        //       this.scene,
        //       this.camera,
        //       this,
        //       cell,
        //       el.color,
        //       el.teamId,
        //       el.id
        //     );
        //     console.log(newChess);
        //     break;
        // }
        const chessFigureFactory = new ChessFigureFactory(
          this.scene,
          this.camera,
          this,
          cell,
          el.color,
          el.teamId,
          el.id
        );
        newChess = chessFigureFactory.createFigure(type);
        if (!newChess) return;

        this.chesses.push(newChess);
        console.log(this.chesses);
      }
    });

    this.render();
  }
  private setChesses(chessArr: ChessPiece[]) {
    this.chesses = chessArr;
  }

  getChessToSend(): ChessData[] {
    const figuresData = this.getFigures().map((chess) => {
      const position = chess.getCell().getId();
      const id = chess.getId();
      const color = chess.getColor();
      const type = chess.getType();
      const teamId = chess.getTeamId();
      return {
        id: id,
        type: type,
        color: color,
        teamId: teamId,
        cellId: position,
      };
    });
    return figuresData;
  }
  public getCellById(id: number): Cell | undefined {
    for (const row of this.cells) {
      const foundCell = row.find((cell) => cell.getId() == id);
      if (foundCell) {
        return foundCell;
      }
    }

    return undefined;
  }
}

export interface ChessData {
  id: number;
  type: string;
  color: number;
  cellId: number;
  teamId: 0 | 1;
}
