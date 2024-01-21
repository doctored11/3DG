import React, { useState } from "react";

interface MainMenuProps {
    onButtonClick: (id: string) => void;
}

export const MainMenu = ({ onButtonClick }: MainMenuProps) => {
    
  const [name, setName] = useState("");

  const handleButtonClick = (id: string) => {
    onButtonClick(id);
  };

  return (
    <div className="main-menu">
      <div className="frame">
        <div className="head">
          <p className="nick-name">{name}</p>
          <button
            className="createGame"
            id="create"
            onClick={() => handleButtonClick('create')}
          >
            Создать катку
          </button>
        </div>
      </div>
    </div>
  );
};
