interface ChessData {
  id: number | string;
  type: string;
  color: number;
  cellId: number | string;
  teamId: 0 | 1;
}

interface EnvData {
  id: number | string;
  type: string;

  cellId: number | string;
}

export class ApiUtils {
  static async updateBoard(
    boardId: string,
    chessArr: ChessData[],
    playerId?: string
  ) {
    await fetch(`/update-board/${boardId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chessArr, playerId }),
    });
  }

  static async updateEnvironment(boardId: string, envArr: EnvData[]) {
    await fetch(`/update-env/${boardId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ envArr }),
    });
  }

  static async getEnvironment(
    boardId: string
  ): Promise<{ chessArr: ChessData[] }> {
    const response = await fetch(`/get-enviroment/${boardId}`);
    return response.json();
  }

  static async getBoard(boardId: string): Promise<{
    boardSize: [number, number];
    chessArr: ChessData[];
    players: Record<string, 0 | 1 | null>;
    stepNumber: number;
  }> {
    const response = await fetch(`/get-board/${boardId}`);
    console.log("получена доска");
    return response.json();
  }
}
