import React, { useState, useEffect } from "react";

import Player from "../Player/Player";
import styles from "./mainMune.css";
import LobbiesList from "./LobbiesList/LobbiesList";
import CreateGameForm from "./CreateGameForm/CreateGameForm";

interface MainMenuProps {
  onButtonClick: (id: string) => void;
  onLobbyItemClick: (data: { id: string; status: string }) => void;
  clientPlayer: Player; //-_-
}
interface LobbyItemClickData {
  id: string;
  status: string;
}

interface LobbyData {
  boardId: string;
  players: Record<string, number>;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onButtonClick,
  onLobbyItemClick,
  clientPlayer,
}) => {
  console.log("MainMenu");
  // const [name, setName] = useState("");
  const [boards, setBoards] = useState<LobbyData[]>([]);
  const [showCreateGameForm, setShowCreateGameForm] = useState(false);

  const player = clientPlayer;
  // setName(player.getNickname());// почему просто не присвоил - вспомнить зачем заготовка!(или удалить)
  // console.log(player, "MM");

  const name = player.getNickname();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch("http://localhost:3000/get-all-boards");
        const data: [] = await response.json();

        if (data && data.length > 0) {
          setBoards(data);
        }
      } catch (error) {
        console.error("Ошибка при получении списка ID досок:", error);
      }
    };

    fetchBoards();

    const intervalId = setInterval(fetchBoards, 3000);
    return () => clearInterval(intervalId);
  }, []);
  const handleCreateGame = (settings: {
    boardWidth: number;
    boardHeight: number;
    environmentCount: number;
  }) => {
    console.log("настройки доски:", settings);
    console.log("____________________________ \n\n");

    const gameId = Math.random() * 1000 + "_" + Date.now() + "cb";
    
    
    fetch("/create-board", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ boardId: gameId, playersId: [player.getId()], height:settings.boardHeight, width:settings.boardWidth, environmentCount:settings.environmentCount }),
    }).then(async (response) => {
      console.log(gameId);
      await response.json();
      onButtonClick(gameId);
    });
  };

  const handleButtonClick = () => {
    
      setShowCreateGameForm(!showCreateGameForm);
    
  };
  const handleLobbyItemClick = ({ id, status }: LobbyItemClickData) => {
    console.log(
      `Подключение к лобби из MainMenu с id ${id} и статусом ${status}`
    );
    onLobbyItemClick({ id, status });
  };

  return (
    <div className={styles.mainMenu}>
      <div className={styles.head}>
        <div className={styles.playerBlock}>
          <div className={styles.playerLogoBlock}>
            <img src="" alt="" />
          </div>
          <p className={styles.nickName}>{name}</p>
        </div>
        <button
          className={styles.createGame}
          id="create"
          onClick={() => handleButtonClick()}
        >
          {showCreateGameForm ? "Отменить" : "Создать игру"}
        </button>
      </div>
      <div className={styles.frame}>
        {showCreateGameForm && (
          <CreateGameForm onCreateGame={handleCreateGame} />
        )}

        {boards && boards.length > 0 && (
          <LobbiesList
            key={`lobbies-list-${Math.random() * 1555 + 2 + "_" + Date.now()}`}
            lobbies={boards}
            onLobbyItemClick={handleLobbyItemClick}
          />
        )}
      </div>
    </div>
  );
};
