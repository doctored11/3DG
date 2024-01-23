class Board {
  private figureArr: ChessData[] = [];
  private players: Record<string, number> = {};
  private availableColors: number[] = [0, 1];

  constructor() {
    this.figureArr = [];
    this.players = {};
  }

  public figureArrUpdate(data: ChessData[]) {
    this.figureArr = data;
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
}

interface ChessData {
  id: number;
  color: number;
  cellId: number;
}

export { Board, ChessData };
