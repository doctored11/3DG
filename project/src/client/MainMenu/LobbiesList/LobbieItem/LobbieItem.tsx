// В LobbieItem
import React from "react";

interface LobbieItemProps {
  board: { boardId: string; players: Record<string, number> };
  playerNicknames: String[];
  onConnectToLobby: (data: { id: string; status: string }) => void;
}

const LobbieItem: React.FC<LobbieItemProps> = ({ board, playerNicknames,onConnectToLobby }) => {
  const id = board.boardId;

  const handleConnect = (status: string) => {
    console.log(
      `Подключение/просмотр лобби со статусом ${status}: доска ${JSON.stringify(
        board.boardId,
      )}`
    );
    // console.log(playerNicknames,"НИКИ")
    const id = board.boardId;
    onConnectToLobby({ id, status });
  };

  

  return (
    <div>
      <p>ID: {id}</p>
      <p>Players: {playerNicknames}</p>
      <button onClick={() => handleConnect("play")}>Подключиться</button>
      <button onClick={() => handleConnect("view")}>Просмотр</button>
    </div>
  );
};

export default LobbieItem;
