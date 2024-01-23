import React from 'react';

interface LobbieItemProps {
  id: string;
  onConnectToLobby: (id: string) => void;
}

const LobbieItem: React.FC<LobbieItemProps> = ({ id, onConnectToLobby }) => {
  const connectToLobby = () => {
    console.log(`Подключение к лобби с id ${id}`);
    onConnectToLobby(id); // Вызываем функцию обратного вызова и передаем id
  };

  return (
    <div>
      <p id={id}>{id}</p>
      <button onClick={connectToLobby}>Подключиться</button>
    </div>
  );
};

export default LobbieItem;
