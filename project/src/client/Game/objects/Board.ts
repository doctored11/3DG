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
        const cell = new Cell(this.scene, this.camera, i, j);
        this.cells[i][j] = cell;
      }
    }

    this.figuresInit();
  }
  private figuresInit() {
    // тут будет начальная расстановка фигур
    for (let i = 0; i < this.sizeX; ++i) {
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
  public render() {
    for (let i = 0; i < this.cells.length; ++i) {
      for (let j = 0; j < this.cells[i].length; ++j) {
        this.cells[i][j].draw();
      }
    }
    this.chesses.forEach((el) => {
      el.draw();
    });
  }

  getAllCellsMeshes(): THREE.Mesh[] {
    const meshes: THREE.Mesh[] = [];
    for (const row of this.cells) {
      for (const cell of row) {
        meshes.push(cell.getMesh());
      }
    }
    return meshes;
  }
  getCells(): Cell[][] {
    return this.cells;
  }
  getFigures(): ChessPiece[] {
    return this.chesses;
  }
}
