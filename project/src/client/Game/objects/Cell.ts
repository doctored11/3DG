import * as THREE from "three";

import { Figure } from "./figure/Figure";

const CELL_SIZE = 10;
const CELL_HEIGHT = 5;
const COLOR_WHITE = 0xffffff;
const COLOR_BLACK = 0x000000;

export class Cell extends Figure {
  public mesh: THREE.Mesh;
  private position: THREE.Vector3;
  private isHighlight: boolean;
  private basicColor: number;
  private indexX : number;
  private indexY : number;


  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    indexI: number,
    indexJ: number,
    id?:number
  ) {
    const color = (indexI + indexJ) % 2 === 0 ? COLOR_WHITE : COLOR_BLACK;

    super(scene, camera, color);
    this.basicColor = color;
    this.id =id
    this.indexX = indexI;
    this.indexY = indexJ;

    this.position = new THREE.Vector3(
      indexI * CELL_SIZE,
      indexJ * CELL_SIZE,
      0
    );

    const geometry = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_HEIGHT);
    const material = new THREE.MeshBasicMaterial({ color: color });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.isHighlight = false;
  }
  changeMesh(color?: number) {
    console.log("меняем материал", color, this)
    const geometry = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_HEIGHT);
    let material = new THREE.MeshBasicMaterial({ color: this.basicColor });
    if (this.isHighlight) {
      material = new THREE.MeshBasicMaterial({
        color: color ? color : 0xbb0566,
      });
    }
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
  }

  getMesh(): THREE.Mesh {
    return this.mesh;
  }
  getHook(): THREE.Vector3 {
    return this.position
      .clone()
      .add(new THREE.Vector3(0, 0, CELL_HEIGHT * 0.65));
  }
  toggleHighlight() {
    this.isHighlight = !this.isHighlight;
    this.changeMesh();
  }
  setHighlight(status: boolean, color?:number) {
    this.isHighlight = status;
    this.changeMesh(color);
    this.draw();
  }
  getHighlightStatus():boolean{
    return this.isHighlight 
  }
  public draw() {
    this.scene.add(this.getMesh());
  }
  public getIndex(){
    return [this.indexX, this.indexY];
  }
}
