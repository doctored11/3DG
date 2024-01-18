class Player {
  private id: string;
  private name: string;
  private x: number;
  private y: number;
  private color: string;

  constructor({ id, name, x, y,color }: playerProp) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getPos(): [number, number] {
    return [this.x, this.y];
  }

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
  //временный пример
  updatePosition(movement: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  }): void {

    if (movement.up) {
      this.setPosition(this.getPos()[0], this.getPos()[1] + 0.2);
    }
    if (movement.down) {
      this.setPosition(this.getPos()[0], this.getPos()[1] - 0.2);
    }
    if (movement.left) {
      this.setPosition(this.getPos()[0] - 0.2, this.getPos()[1]);
    }
    if (movement.right) {
      this.setPosition(this.getPos()[0] + 0.2, this.getPos()[1]);
    }
  }
}
interface playerProp {
  id: string;
  name: string;
  x: number;
  y: number;
  color:string;
}

export { Player, playerProp };

