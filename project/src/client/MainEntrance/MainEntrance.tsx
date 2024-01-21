import React, { useState } from "react";

interface MainEntranceProps {
  onConfirm: (nickname: string) => void;
}

export const MainEntrance = ({ onConfirm }: MainEntranceProps) => {
  const [nickname, setNickname] = useState("");

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const handleConfirmClick = () => {
    onConfirm(nickname);
  };

  return (
    <div className="mainEntrance">
      <div className="frame">
        <div className="form">
          <label htmlFor="nickname">-_-Ваш ник:</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={handleNicknameChange}
          />
          <button onClick={handleConfirmClick}>Подтвердить</button>
        </div>
      </div>
    </div>
  );
};
