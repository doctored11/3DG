// CreateGameForm.tsx
import React, { useState } from "react";
import styles from "./createGameForm.css";

interface CreateGameFormProps {
  onCreateGame: (settings: {
    boardWidth: number;
    boardHeight: number;
    environmentCount: number;
  }) => void;
}

const CreateGameForm: React.FC<CreateGameFormProps> = ({ onCreateGame }) => {
  const [sliderWidthValue, setSliderWidthValue] = useState(8);
  const [sliderHeightValue, setSliderHeightValue] = useState(8);
  const [sliderEnvironmentValue, setSliderEnvironmentValue] = useState(0);

  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderWidthValue(Number(event.target.value));
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderHeightValue(Number(event.target.value));
  };

  const handleEnvironmentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSliderEnvironmentValue(Number(event.target.value));
  };

  const handleCreateGame = () => {
    const playersId = Array.from(
      { length: 2 },
      (_, index) => `Player${index + 1}`
    );
    onCreateGame({
      boardWidth: sliderWidthValue,
      boardHeight: sliderHeightValue,
      environmentCount: sliderEnvironmentValue,
    });
  };

  return (
    <div className={styles.createGameForm}>
      <form action="" className={styles.form}>
        <p className={styles.txt}>
          Ширина доски (четное число): {sliderWidthValue}
        </p>
        <input
          type="range"
          min="8"
          max="64"
          step="2"
          value={sliderWidthValue}
          onChange={handleWidthChange}
          className={styles.input}
        />

        <p className={styles.txt}>
          Длина доски (четное число): {sliderHeightValue}
        </p>
        <input
          type="range"
          min="8"
          max="64"
          step="2"
          value={sliderHeightValue}
          className={styles.input}
          onChange={handleHeightChange}
        />

        <p className={styles.txt}>
          Количество окружения: {sliderEnvironmentValue}
        </p>
        <input
          type="range"
          min="0"
          max="5"
          value={sliderEnvironmentValue}
          className={styles.input}
          onChange={handleEnvironmentChange}
        />
      </form>
      <button className={styles.btn} onClick={handleCreateGame}>
        Создать
      </button>
    </div>
  );
};

export default CreateGameForm;
