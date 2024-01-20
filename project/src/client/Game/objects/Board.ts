import { Cell } from "./Cell";
import { ChessPiece } from "./figure/ChessPiece";

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
    for (let i = 0; i < this.sizeX; i = i + 2) {
      const buffPice = new ChessPiece(
        this.scene,
        this.camera,
        this,
        this.cells[i][3],
        0xff0000
      );
      this.chesses.push(buffPice);
    }
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
        if (cell) {
          const newChess = new ChessPiece(
            this.scene,
            this.camera,
            this,
            cell,
            el.color,
            el.id
          );
          this.chesses.push(newChess);
        }
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
      return {
        id: id,
        color: color,
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
  color: number;
  cellId: number;
}
