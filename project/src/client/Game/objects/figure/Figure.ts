import * as THREE from "three";

export class Figure {
  protected mesh: THREE.Mesh;
  protected scene: THREE.Scene;
  protected raycaster: THREE.Raycaster;
  protected mouse: THREE.Vector2;
  protected color: number;
  protected camera: THREE.Camera;

  constructor(scene: THREE.Scene, camera: THREE.Camera, color: number) {
    this.mesh = new THREE.Mesh();
    this.camera = camera;

    this.scene = scene;
    this.color = color;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.draw();

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

  protected onMouseDown(event: MouseEvent) {
    console.log("Нажатие по фигуре ", this);
  }

  public checkIntersection(raycaster: THREE.Raycaster): THREE.Intersection[] {
    return raycaster.intersectObject(this.mesh);
  }

//   protected onClick(event: MouseEvent) {
//     console.log("click");

//     const pointer = new THREE.Vector2();
//     pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
//     pointer.y = (-event.clientY / window.innerHeight) * 2 + 1;

//     this.raycaster.setFromCamera(pointer, this.camera);
//     const intersections = this.raycaster.intersectObjects([this.mesh]);

//     if (intersections.length > 0) {
//       const firstIntersection = intersections[0];
//       console.log("click_1");
//       console.log(intersections);
//       console.log("click_2");
//       // console.log(pointer.x, pointer.y);
//       console.log("Клик по фигуре", firstIntersection);
//       const blueMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
//       this.mesh.material = blueMaterial;
//     }
//   }
}
