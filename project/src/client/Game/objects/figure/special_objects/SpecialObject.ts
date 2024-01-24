import * as THREE from "three";
import { Board } from "../../Board";
import { Figure } from "../Figure";
import { Cell } from "../../Cell";

export class SpecialObject extends Figure {
  protected cell: Cell;
  public mesh: THREE.Mesh;
  protected board: Board;
  protected id: number;
  protected type = this.constructor.name;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    board: Board,
    cell: Cell,
    color: number,
    id: number | null
  ) {
    super(scene, camera, color);

    this.cell = cell;
    this.mesh = this.createMesh("");
    this.board = board;
    this.id = id || Math.round(Math.random() * 8000) + 1;

    this.draw();
    this.mesh.addEventListener("click", this.onClick.bind(this));
  }

  public onClick(event: THREE.Event) {
    console.log("Я был кликнут!!!", this.type);
  }

  protected createMesh(type: string): THREE.Mesh {
    const objectTypes: any = {
      Rock: new THREE.DodecahedronGeometry(2),
    };
    const geometry = objectTypes[type];
    const material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    return new THREE.Mesh(geometry, material);
  }
  public draw() {
    const hook = this.cell.getHook();
    this.mesh.position.copy(hook);
    this.scene.add(this.mesh);
  }
  public getCell(): Cell {
    return this.cell;
  }
  public getType(): string {
    return this.type;
  }
}
