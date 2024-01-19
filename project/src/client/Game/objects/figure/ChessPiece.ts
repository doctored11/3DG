import * as THREE from "three";
import { Cell } from "../Cell";
import { Figure } from "./Figure";

export class ChessPiece extends Figure {
  protected cell: Cell;
  public mesh: THREE.Mesh;
 


  constructor( scene: THREE.Scene,camera: THREE.Camera,cell: Cell, color: number) {
    super(scene, camera, color); 
    this.cell = cell;
    this.mesh = this.createMesh();
   
    this.draw();
    this.mesh.addEventListener("click", this.onClick.bind(this));

  }
  protected createMesh(): THREE.Mesh {
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
