import React from "react";
import ReactDOM from "react-dom";

interface AwaiterProps {
  onPlayersReady: () => void;
}

class Awaiter {
  private container: HTMLDivElement;
  private count: number;

  constructor(count: number) {
    this.count = count;
    this.container = document.createElement("div");
    this.container.id = "awaiter-container";
    this.container.style.position = "fixed";
    this.container.style.top = "0";
    this.container.style.left = "0";
    this.container.style.width = "100%";
    this.container.style.height = "100%";
    this.container.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    this.container.style.display = "flex";
    this.container.style.justifyContent = "center";
    this.container.style.alignItems = "center";
    this.container.style.color = "#fff";
  }

  private render() {
    document.body.appendChild(this.container);
    ReactDOM.render(
      <div>
        <h2>Ожидание игроков...</h2>
        <p>{`Игроков в игре: ${this.count}`}</p>
      </div>,
      this.container
    );
  }

  public unmount() {
    const existingContainer = document.getElementById("awaiter-container");
    if (existingContainer) {
      ReactDOM.unmountComponentAtNode(this.container);
      document.body.removeChild(this.container);
    }
  }

  public mount() {
    const existingContainer = document.getElementById("awaiter-container");
    if (!existingContainer) {
      this.render();
    }
  }
}

export default Awaiter;
