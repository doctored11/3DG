import { hot } from "react-hot-loader/root";
import React, { useState } from 'react';
import styles from "./header.css";

interface HeaderComponentProps {
  onNicknameChange: (nickname: string) => void;
  onNicknameConfirm: () => void;
}

export const HeaderComponent: React.FC<HeaderComponentProps> = ({ onNicknameChange, onNicknameConfirm }) => {
  const [nickname, setNickname] = useState('');
  const [isConfirmed, setConfirmed] = useState(false);

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
    onNicknameChange(event.target.value);
  };

  const handleConfirmClick = () => {
    if (nickname.trim() !== '') {
      setConfirmed(true);
      onNicknameConfirm();
    }
  };

  return (
    <header>
      <h1 className={styles.example}> Hello Drug(friend tipo) =)</h1>
      <div>
        {!isConfirmed && (
          <>
            <label htmlFor="nickname">Ваш ник:</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={handleNicknameChange}
            />
            <button onClick={handleConfirmClick}>Подтвердить</button>
          </>
        )}{
          isConfirmed &&(
            <p>{`ТЫ 👉${nickname} `}</p>
          )
        }
      </div>
    </header>
  );
}

export const Header = hot(HeaderComponent);
