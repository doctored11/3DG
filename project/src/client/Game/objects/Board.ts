import { Cell } from "./Cell";
export class Board {
  private cells: Cell[][] = [];
  private sizeX;
  private sizeY;
  protected scene: THREE.Scene;
  protected camera: THREE.Camera;

  constructor(scene: THREE.Scene,camera:THREE.Camera,sizeI: number, sizeJ: number) {
    this.sizeX = sizeI;
    this.sizeY = sizeJ;
    this.scene=scene;
    this.camera = camera
    this.createBoard(sizeI, sizeJ);
  }

  private createBoard(sizeI: number, sizeJ: number): void {
    for (let i = 0; i < sizeI; ++i) {
      this.cells[i] = [];
      for (let j = 0; j < sizeJ; ++j) {
        const cell = new Cell(this.scene, this.camera,i, j);
        this.cells[i][j] = cell;
      }
    }
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
}
