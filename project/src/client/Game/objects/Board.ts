import { Cell } from "./Cell";
import { BishopFigure } from "./figure/BishopFigure";
import { ChessPiece } from "./figure/ChessPiece";
import { PawnFigure } from "./figure/PawnFigure";
import { RootFigure } from "./figure/RootFigure";
import { QueenFigure } from "./figure/QueenFigure";
import { KingFigure } from "./figure/KingFigure";
import { KnightFigure } from "./figure/KnightFigure";
import { ChessFigureFactory } from "./figure/FigureFactory";
import { Rock } from "./figure/special_objects/Rock";
import { SpecialObject } from "./figure/special_objects/SpecialObject";

export class Board {
  private cells: Cell[][] = [];
  private sizeX;
  private sizeY;
  protected scene: THREE.Scene;
  protected camera: THREE.Camera;
  protected chesses: ChessPiece[] = [];
  protected environment: SpecialObject[] = [];
  private step: number = 1;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    sizeI: number,
    sizeJ: number
  ) {
    this.sizeX = sizeI;
    this.sizeY = sizeJ;
    this.scene = scene;
    this.camera = camera;
    this.createBoard(sizeI, sizeJ);
  }

  private createBoard(sizeI: number, sizeJ: number): void {
    for (let i = 0; i < sizeI; ++i) {
      this.cells[i] = [];
      for (let j = 0; j < sizeJ; ++j) {
        const cell = new Cell(
          this.scene,
          this.camera,
          i,
          j,
          Number.parseInt("" + (i + 1) + (j + 1))
        );
        this.cells[i][j] = cell;
      }
    }

    this.ObjectsInit();
  }
  private ObjectsInit(): void {
    // тут будет начальная расстановка фигур
    for (let i = 0; i < this.sizeX; i++) {
      const pawn = new PawnFigure(
        this.scene,
        this.camera,
        this,
        this.cells[i][1],
        Math.round(Math.random() * 0xffffff * 0.4) + 0xffffff * 0.6, //простите если сломал (но мне нужен цвет на этом этапе)
        1
      );
      this.chesses.push(pawn);
    }
    for (let j = 2; j < this.sizeX - 1; j += 3) {
      const bishop = new BishopFigure(
        this.scene,
        this.camera,
        this,
        this.cells[j][0],
        Math.round(Math.random() * 0xffffff * 0.4) + 0xffffff * 0.6, //простите если сломал (но мне нужен цвет на этом этапе)
        1
      );
      this.chesses.push(bishop);
    }
    for (let i = 0; i < this.sizeX; i++) {
      const pawn = new PawnFigure(
        this.scene,
        this.camera,
        this,
        this.cells[i][this.sizeY - 1],
        Math.round((Math.random() * 0xffffff) / 8), //простите если сломал (но мне нужен цвет на этом этапе)
        0
      );
      this.chesses.push(pawn);
    }
    for (let j = 2; j < this.sizeX - 1; j += 3) {
      const bishop = new BishopFigure(
        this.scene,
        this.camera,
        this,
        this.cells[j][this.sizeY - 1],
        Math.round(Math.random() * 0xffffff * 0.4) + 0xffffff * 0.6, //простите если сломал (но мне нужен цвет на этом этапе)
        0
      );
      this.chesses.push(bishop);
    }
    for (let z = 0; z < this.sizeX; z += 7) {
      const root = new RootFigure(
        this.scene,
        this.camera,
        this,
        this.cells[z][0],
        Math.round(Math.random() * 0xffffff * 0.4) + 0xffffff * 0.6, //простите если сломал (но мне нужен цвет на этом этапе)
        1
      );
      this.chesses.push(root);
    }
    for (let z = 0; z < this.sizeX; z += 7) {
      const root = new RootFigure(
        this.scene,
        this.camera,
        this,
        this.cells[z][this.sizeY - 1],
        Math.round(Math.random() * 0xffffff * 0.4) + 0xffffff * 0.6, //простите если сломал (но мне нужен цвет на этом этапе)
        0
      );
      this.chesses.push(root);
    }
    for (let v = 1; v < this.sizeX; v += 5) {
      const knight = new KnightFigure(
        this.scene,
        this.camera,
        this,
        this.cells[v][0],
        Math.round(Math.random() * 0xffffff * 0.4) + 0xffffff * 0.6, //простите если сломал (но мне нужен цвет на этом этапе)
        1
      );
      this.chesses.push(knight);
    }
    const queen = new QueenFigure(
      this.scene,
      this.camera,
      this,
      this.cells[3][0],
      Math.round(Math.random() * 0xffffff * 0.4) + 0xffffff * 0.6, //простите если сломал (но мне нужен цвет на этом этапе)
      1
    );
    this.chesses.push(queen);

    const king = new KingFigure(
      this.scene,
      this.camera,
      this,
      this.cells[4][0],
      Math.round(Math.random() * 0xffffff * 0.4) + 0xffffff * 0.6, //простите если сломал (но мне нужен цвет на этом этапе)
      1
    );
    this.chesses.push(king);

    const rock = new Rock(
      this.scene,
      this.camera,
      this,
      this.cells[ Math.round(Math.random() * 5)][3],
      0xaaaaa
    );
    this.environment.push(rock);
  }
  public render(): void {
    for (let i = 0; i < this.cells.length; ++i) {
      for (let j = 0; j < this.cells[i].length; ++j) {
        this.cells[i][j].draw();
      }
    }

    this.chesses.forEach((el) => {
      el.draw();
    });

    this.environment.forEach((el) => {
      el.draw();
    });
  }
  public removeChess(chess: ChessPiece) {
    const index = this.chesses.indexOf(chess);
    if (index !== -1) {
      this.chesses.splice(index, 1);
    }
  }
  public removeEnv(env: SpecialObject) {
    const index = this.environment.indexOf(env);
    if (index !== -1) {
      this.environment.splice(index, 1);
    }
  }
  private getAllCellsMeshes(): THREE.Mesh[] {
    const meshes: THREE.Mesh[] = [];
    for (const row of this.cells) {
      for (const cell of row) {
        meshes.push(cell.getMesh());
      }
    }
    return meshes;
  }
  public getCells(): Cell[][] {
    return this.cells;
  }
  public getFlatCells(): Cell[] {
    return this.cells.flat();
  }
  public getFigures(): ChessPiece[] {
    return this.chesses;
  }
  public getEnviroment(): SpecialObject[] {
    return this.environment;
  }
  public restoreFigures(arr: ChessData[]): void {
    // console.log(arr);
    // нагруженно но пока так
    const currentFigures = [...this.getFigures()];
    // console.log(currentFigures)

    if (arr.length < 1) return;

    const removedFigures = currentFigures.filter(
      (chess) => !arr.some((el) => el.id === chess.getId())
    );
    if (removedFigures.length > 0) {
      removedFigures.forEach((removedChess) => {
        this.removeChess(removedChess);
      });
    }

    arr.forEach((el) => {
      const existingChess = currentFigures.find(
        (chess) => chess.getId() === el.id
      );

      if (existingChess) {
        const cell = this.getCellById(el.cellId);
        if (cell) {
          existingChess.move(cell);
        }
      } else {
        const cell = this.getCellById(el.cellId);
        if (!cell) return;
        const type = el.type;
        let newChess: ChessPiece | null = null;
        console.log("типок: ", type);

        const chessFigureFactory = new ChessFigureFactory(
          this.scene,
          this.camera,
          this,
          cell,
          el.color,
          el.teamId,
          el.id
        );
        newChess = chessFigureFactory.createFigure(type);
        if (!newChess) return;

        this.chesses.push(newChess);
        console.log(this.chesses);
      }
    });

    this.render();
  }

  public restoreEnv(arr: EnvData[]): void {
    const currentEnv = [...this.getEnviroment()];
    console.log("Восстанавливаем ПРИРОДУ ", arr)

    if (arr.length < 1) return;

    const removedFigures = currentEnv.filter(
      (env) => !arr.some((el) => el.id === env.getId())
    );
    if (removedFigures.length > 0) {
      removedFigures.forEach((renENV) => {
        this.removeEnv(renENV);
      });
    }

    arr.forEach((el) => {
      const existingEnv = currentEnv.find((env) => env.getId() === el.id);

      if (!existingEnv) {
        const cell = this.getCellById(el.cellId);
        if (!cell) return;
        const type = el.type;
        let newEnvEl: SpecialObject | null = null;
        console.log("Природа типа: ", type);

        switch (type) {
          case "Rock":
            newEnvEl = new Rock(
              this.scene,
              this.camera,
              this,
              cell,
              0xff00ff,
              el.id
            );
            break;
          // еще куст
        }

        if (!newEnvEl) return;

        this.environment.push(newEnvEl);
        console.log(this.environment);
      }
    });

    this.render();
  }
  private setChesses(chessArr: ChessPiece[]) {
    this.chesses = chessArr;
  }

  getChessToSend(): ChessData[] {
    const figuresData = this.getFigures().map((chess) => {
      const position = chess.getCell().getId();
      const id = chess.getId();
      const color = chess.getColor();
      const type = chess.getType();
      const teamId = chess.getTeamId();
      return {
        id: id,
        type: type,
        color: color,
        teamId: teamId,
        cellId: position,
      };
    });
    return figuresData;
  }

  getEnvToSend(): EnvData[] {
    const envData = this.getEnviroment().map((el) => {
      const position = el.getCell().getId();
      const id = el.getId();
      const type = el.getType();

      return {
        id: id,
        type: type,
        cellId: position,
      };
    });
    return envData;
  }

  public nextStep(): void {
    console.log("++++ХОДД :", this.step + 1);
    this.step++;
  }
  public getStep(): number {
    return this.step;
  }
  public setStep(newStep: number) {
    this.step = newStep;
  }
  public getCellById(id: number): Cell | undefined {
    for (const row of this.cells) {
      const foundCell = row.find((cell) => cell.getId() == id);
      if (foundCell) {
        return foundCell;
      }
    }

    return undefined;
  }
}

export interface ChessData {
  id: number;
  type: string;
  color: number;
  cellId: number;
  teamId: 0 | 1;
}
export interface EnvData {
  id: number;
  type: string;

  cellId: number;
}
