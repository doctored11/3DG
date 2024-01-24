import React from "react";
import style from "./hud.css";

interface HUDProps {
  step: number;
  playingSide: number;
}

const HUD: React.FC<HUDProps> = ({ step, playingSide }) => {
  const isYourTurn =
    (playingSide === 1 && step % 2 != 0) ||
    (playingSide === 0 && step % 2 == 0);

  return (
    <div className={style.mainHud}>
      <p>Ход: {step}</p>
      <p>Сторона игрока: {playingSide === 1 ? "Белые" : "Черные"}</p>
      {isYourTurn && <p>Ваш ход</p>}
    </div>
  );
};

export default HUD;
