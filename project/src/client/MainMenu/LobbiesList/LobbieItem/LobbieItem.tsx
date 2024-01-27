// В LobbieItem
import React from "react";
import style from "./lobbieItem.css";
import { blob } from "stream/consumers";

interface LobbieItemProps {
  board: { boardId: string; players: Record<string, number> };
  playerNicknames: String[];
  onConnectToLobby: (data: { id: string; status: string }) => void;
}
let playersNicks = "";
const LobbieItem: React.FC<LobbieItemProps> = ({
  board,
  playerNicknames,
  onConnectToLobby,
}) => {
  const id = board.boardId;

  const handleConnect = (status: string) => {
    console.log(
      `Подключение/просмотр лобби со статусом ${status}: доска ${JSON.stringify(
        board.boardId
      )}`
    );
    // console.log(playerNicknames,"НИКИ")

    const id = board.boardId;
    onConnectToLobby({ id, status });
  };

  return (
    <div className={style.card}>
      {/* <p>ID: {id}</p> */}
      {playerNicknames.length > 0 && (
        <div className={style.textBlock}>
          {playerNicknames.map((nickname, index) => (
            <span key={`${index}-${nickname}`} className={style.text}>
              {nickname}
              {index < playerNicknames.length - 1 && (
                <span key={`${index}-separator`} className={style.separator}>
                  <span key={`${index}-v`} className={style.v}>
                    V
                  </span>
                  <span key={`${index}-s`} className={style.s}>
                    s
                  </span>
                </span>
              )}
            </span>
          ))}
        </div>
      )}
      {playerNicknames.length < 2 && (
        <button
          className={`${style.btn} ${style.play}`}
          onClick={() => handleConnect("play")}
        >
          Подключиться
        </button>
      )}

      <button
        className={`${style.btn} ${style.view}`}
        onClick={() => handleConnect("view")}
      >
        Просмотр
      </button>
    </div>
  );
};

export default LobbieItem;
