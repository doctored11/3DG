// В LobbiesList
import React, { useEffect, useState } from "react";
import LobbieItem from "./LobbieItem/LobbieItem";
import style from "./lobbiesList.css";

interface LobbyItem {
  boardId: string;
  players: Record<string, number>;
}

interface Player {
  playerId: string;
  playerName: string;
}

interface LobbiesListProps {
  lobbies: LobbyItem[];
  onLobbyItemClick: (data: { id: string; status: string }) => void;
}

const LobbiesList: React.FC<LobbiesListProps> = ({
  lobbies,
  onLobbyItemClick,
}) => {
  console.log("LIST");
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      console.log("просим игроков");
      try {
        const response = await fetch("/get-all-players");
        const players: Player[] = await response.json();
        setAllPlayers(players);
      } catch (error) {
        console.error("Ошибка при получении игроков:", error);
      }
    };

    fetchPlayers();
  }, []);
  // useEffect(() => {
  //   fetchPlayers();
  // }, []);

  const getPlayerNicknames = (playerIds: string[]): string[] => {
    return playerIds.map((playerId) => {
      // console.log("перебор", playerId);
      // console.log("перебор", allPlayers);
      const player = allPlayers.find((pl) => pl.playerId == playerId);

      return player ? player.playerName : `Супер шахматист (${playerId})`;
    });
  };

  return (
    <div className={style.list}>
      {lobbies.map((data) => {
        const playerNicknames: string[] = getPlayerNicknames(
          Object.keys(data.players)
        );

        return (
          <LobbieItem
            key={Math.random() + "_" + Date.now() + "_!"}
            board={data}
            playerNicknames={playerNicknames}
            onConnectToLobby={onLobbyItemClick}
          />
        );
      })}
    </div>
  );
};

export default LobbiesList;
