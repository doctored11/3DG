class Board {
  private figureArr: ChessData[] = [];
  private enviromentArr: EnvData[] = [];
  private players: Record<string, number> = {};
  private availableColors: number[] = [0, 1];
  private step: number = 0;
  private width: number = 8;
  private height: number = 8;
  private envLvl: number = 0;
  constructor(width: number, height: number, envLvl: number) {
    this.figureArr = [];
    this.players = {};
    this.width = width;
    this.height = height;
    this.envLvl = envLvl;
  }

  public figureArrUpdate(data: ChessData[]) {
    this.figureArr = data;
  }
  public getSize(): number[] {
    return [this.width, this.height];
  }

  public getFigureArr(): ChessData[] {
    return this.figureArr;
  }

  public addPlayer(playerId: string) {
    if (!this.players[playerId]) {
      const availableColorIndex = Math.floor(
        Math.random() * this.availableColors.length
      );
      const selectedColor = this.availableColors.splice(
        availableColorIndex,
        1
      )[0];
      this.players[playerId] = selectedColor;
    } else {
      console.error("Many players!");
    }
  }
  public getPlayers(): Record<string, number> {
    return this.players;
  }
  public getPlayerCount(): number {
    return Object.keys(this.players).length;
  }
  public getStep(): number {
    return this.step;
  }
  public setStep(step: number) {
    this.step = step;
  }
  public nextStep(): void {
    this.step++;
  }

  public getEnviromentArr(): EnvData[] {
    return this.enviromentArr;
  }
  public setEnviromentArr(arr: EnvData[]) {
    console.log("попытка присвоить природу", arr);
    this.enviromentArr = arr;
  }
}

interface ChessData {
  id: number;
  color: number;
  cellId: number;
  [key: string]: number;
}
interface EnvData {
  id: number;

  cellId: number;
  [key: string]: number;
}

export { Board, ChessData };
