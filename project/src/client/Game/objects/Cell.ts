import * as THREE from "three";
import { Figure } from "./figure/Figure";

const CELL_SIZE = 10;
const CELL_HEIGHT = 5;
const COLOR_WHITE = 0xffffff;
const COLOR_BLACK = 0x000000;

export class Cell extends Figure {
  protected mesh: THREE.Mesh;
  private position: THREE.Vector3;

  constructor(scene: THREE.Scene,camera:THREE.Camera, indexI: number, indexJ: number) {
    const color = (indexI + indexJ) % 2 === 0 ? COLOR_WHITE : COLOR_BLACK;

    super(scene,camera ,color);
    this.position = new THREE.Vector3(
      indexI * CELL_SIZE,
      indexJ * CELL_SIZE,
      0
    );

    const geometry = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_HEIGHT);
    const material = new THREE.MeshBasicMaterial({ color: color });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
  }

  getMesh(): THREE.Mesh {
    return this.mesh;
  }
  getHook(): THREE.Vector3 {
    return this.position
      .clone()
      .add(new THREE.Vector3(0, 0, CELL_HEIGHT*0.65));
  }
}
