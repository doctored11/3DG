import * as THREE from "three";
import { Cell } from "../Cell";

export class Figure {
  public mesh: THREE.Mesh;
  protected scene: THREE.Scene;
  protected color: number;
  protected camera: THREE.Camera;
  protected id?: number;

  constructor(scene: THREE.Scene, camera: THREE.Camera, color: number, id?:number|null) {
    this.mesh = new THREE.Mesh();
    this.camera = camera;

    this.scene = scene;
    this.color = color;
    this.id = id||Math.round(Math.random() * 5000)-200;

    //
    // window.addEventListener("click", (event) => this.onClick(event));
  }

  protected createMesh(
    geometry: THREE.BufferGeometry,
    material: THREE.Material
  ): THREE.Mesh {
    return new THREE.Mesh(geometry, material);
  }

  public draw() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: this.color });
    this.mesh = this.createMesh(geometry, material);
    this.scene.add(this.mesh);
  }
  public getPosition(): THREE.Vector3 {
    return this.mesh.position.clone();
  }

  public onSelect(): { cell: Cell; action: "move" | "attack" }[] | null {
    console.log("Я выбран:");
    console.log(this);
    console.log("________]");

    return null;
  }
  public getColor(): number {
    return this.color;
  }
  public getId(): number {
    return this.id||-1;
  }
}
