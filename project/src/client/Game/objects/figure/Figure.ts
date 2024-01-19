import * as THREE from "three";

export class Figure {
  public mesh: THREE.Mesh;
  protected scene: THREE.Scene;
  protected color: number;
  protected camera: THREE.Camera;

  constructor(scene: THREE.Scene, camera: THREE.Camera, color: number) {
    this.mesh = new THREE.Mesh();
    this.camera = camera;

    this.scene = scene;
    this.color = color;

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

  public onSelect() {
    console.log("Я выбран:");
    console.log(this);
    console.log("________]");
  }
}
