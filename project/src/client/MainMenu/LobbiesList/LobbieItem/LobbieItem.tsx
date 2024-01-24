import React from 'react';

interface LobbieItemProps {
  id: string;
  onConnectToLobby: (data: { id: string, status: string }) => void;
}

const LobbieItem: React.FC<LobbieItemProps> = ({ id, onConnectToLobby }) => {
  const handleConnect = (status: string) => {
    console.log(`Подключение/просмотр лобби с id ${id} и статусом ${status}`);
    onConnectToLobby({ id, status });
  };

  return (
    <div>
      <p id={id}>{id}</p>
      <button onClick={() => handleConnect('play')}>Подключиться</button>
      <button onClick={() => handleConnect('view')}>Просмотр</button>
    </div>
  );
};

export default LobbieItem;
