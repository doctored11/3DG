import * as THREE from "three";
import { Cell } from "../Cell";

export class ChessPiece {
  protected cell: Cell;
  protected color: string;
  protected mesh: THREE.Mesh;
  protected scene: THREE.Scene;


  constructor( scene: THREE.Scene,cell: Cell, color: string) {
    this.cell = cell;
    this.color = color;
    this.mesh = this.createMesh();
    this.scene = scene;

    this.draw();
    this.mesh.addEventListener("click", this.onClick.bind(this));

  }
  private createMesh(): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: this.color,
    });
    return new THREE.Mesh(geometry, material);
  }
  public draw() {
    const hook = this.cell.getHook();
    this.mesh.position.copy(hook);
    this.scene.add(this.mesh);

  }
  move(newCell: Cell) {
    this.cell = newCell;
    this.draw();
    
  }

  remove() {
    this.scene.remove(this.mesh);

  }
  private onClick(event: THREE.Event) {
    console.log("Фигура была кликнута!", this);
  }
}
