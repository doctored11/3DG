import React, { useState, useEffect } from "react";
import LobbiesList from "./LobbiesList/LobbiesList";
import Player from "../Player/Player";
import styles from "./mainMune.css";

interface MainMenuProps {
  onButtonClick: (id: string) => void;
  onLobbyItemClick: (data: { id: string; status: string }) => void;
  clientPlayer: Player; //-_-
}
interface LobbyItemClickData {
  id: string;
  status: string;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onButtonClick,
  onLobbyItemClick,
  clientPlayer,
}) => {
  const [name, setName] = useState("");
  const [boardKeys, setBoardKeys] = useState<string[]>([]);
  const player = clientPlayer;
  console.log(player, "MM");

  useEffect(() => {
    fetchBoardKeys();
  }, []);

  const fetchBoardKeys = async () => {
    try {
      const response = await fetch("http://localhost:3000/get-board-keys");
      const data: [] = await response.json();
      console.log("Data с сервера:", data);

      if (data && data.length > 0) {
        setBoardKeys(data);
      }
    } catch (error: any) {
      console.error("Ошибка при получении списка ID досок:", error.message);
    }
  };
  const handleButtonClick = () => {
    const gameId = Math.random() * 1000 + "_" + Date.now() + "cb";
    fetch("/create-board", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ boardId: gameId, playersId: [player.getId()] }),
    }).then((response) => {
      response.json();
      onButtonClick(gameId);
    });
  };
  const handleLobbyItemClick = ({ id, status }: LobbyItemClickData) => {
    console.log(
      `Подключение к лобби из MainMenu с id ${id} и статусом ${status}`
    );
    onLobbyItemClick({ id, status });
  };

  return (
    <div className={styles.mainMenu}>
      <div className={styles.frame}>
        <div className={styles.head}>
          <p className={styles.nickName}>{name}</p>
          
          <button
            className={styles.createGame}
            id="create"
            onClick={() => handleButtonClick()}
          >
            Создать катку
          </button>

          {boardKeys && boardKeys.length > 0 && (
            <LobbiesList
              lobbyIds={boardKeys}
              onLobbyItemClick={handleLobbyItemClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

