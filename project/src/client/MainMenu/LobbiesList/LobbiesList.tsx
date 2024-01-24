import React from 'react';
import LobbieItem from './LobbieItem/LobbieItem';

interface LobbiesListProps {
  lobbyIds: string[];
  onLobbyItemClick: (data: { id: string, status: string }) => void;
}

const LobbiesList: React.FC<LobbiesListProps> = ({ lobbyIds, onLobbyItemClick }) => {
  return (
    <div>
      {lobbyIds.map((id) => (
        <LobbieItem key={id} id={id} onConnectToLobby={onLobbyItemClick} />
      ))}
    </div>
  );
};

export default LobbiesList;
