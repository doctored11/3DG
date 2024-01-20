class Board {
  private figureArr: ChessData[] = [];
  constructor() {
    this.figureArr = [];
  }
  public figureArrUpdate(data: ChessData[]) {
    //тут еще проверку на возможность бы (сравнение положений)
    this.figureArr = data;
  }
  public getFigureArr(): ChessData[] {
    return this.figureArr;
  }
}
interface ChessData {
  id: number;
  color: number;
  cellId: number;
}

export { Board, ChessData };
