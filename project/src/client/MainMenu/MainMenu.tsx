import React, { useState, useEffect } from "react";
import LobbiesList from "./LobbiesList/LobbiesList";

interface MainMenuProps {
  onButtonClick: (id: string) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onButtonClick }) => {
  const [name, setName] = useState("");
  const [boardKeys, setBoardKeys] = useState<string[]>([]);

  useEffect(() => {
    fetchBoardKeys();
  }, []);
  const fetchBoardKeys = async () => {
    try {
      const response = await fetch("http://localhost:3000/get-board-keys");
      const data: [] = await response.json();
      console.log("Data с сервера:", data);

      if (data  && data.length > 0) {
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
      body: JSON.stringify({ boardId: gameId }),
    }).then((response) => {
      response.json();
      onButtonClick(gameId);
    });
  };
  const handleLobbyItemClick = (id: string) => {
    console.log(`Подключение к лобби из MainMenu с id ${id}`);
  };

  return (
    <div className="main-menu">
      <div className="frame">
        <div className="head">
          <p className="nick-name">{name}</p>
          <span>00</span>
          {/* {boardKeys && boardKeys.length > 0 ? (
            <p>{boardKeys.join(", ")}</p>
          ) : (
            <p>No board keys available</p>
          )} */}
          <span>11</span>
          <button
            className="createGame"
            id="create"
            onClick={() => handleButtonClick()}
          >
            Создать катку
          </button>

          {boardKeys && boardKeys.length > 0 && (
            <LobbiesList lobbyIds={boardKeys} onLobbyItemClick={handleLobbyItemClick} />
          )}
        </div>
      </div>
    </div>
  );
};

interface BoardKeysResponse {
  keys: string[] | null;
}
