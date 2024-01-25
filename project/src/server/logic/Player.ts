class Player {
  private id: string;
  private name: string;
  private x: number;
  private y: number;
  private color: string;

  constructor({ id, name, x, y, color }: playerProp) {
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
}
interface playerProp {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
}

export { Player, playerProp };
