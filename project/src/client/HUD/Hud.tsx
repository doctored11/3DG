import React from "react";
import style from "./hud.css";

interface HUDProps {
  step: number;
  playingSide: number;
}

const HUD: React.FC<HUDProps> = ({ step, playingSide }) => {
  const isYourTurn =
    (playingSide == 1 && step % 2 != 0) ||
    (playingSide == 0 && step % 2 == 0);
  console.log(isYourTurn,playingSide,step )
  return (
    <div className={style.mainHud}>
      <div
        className={`${style.stepBlock} ${
          isYourTurn ? style.yourStep : style.notYourStep
        }`}
      >
        <p className={style.txt}>Ход: {step}</p>
        {isYourTurn && <p className={style.ternLabel}>Ваш ход</p>}
      </div>
      <div className={style.playerSideBlock}>
        <p className={style.txt}>
          Сторона игрока: {playingSide === 1 ? "Белые" : "Черные"}
        </p>
      </div>
    </div>
  );
};

export default HUD;
