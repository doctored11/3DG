import React, { useEffect, useRef } from "react";

import * as THREE from "three";

interface ClientPlayer {
  x: number;
  y: number;
  name: string;
  color: string;
  id: string;
  // Добавляем сигнатуру индекса
  [key: string]: any;
}

export class Game {
  private socket: any;
  private key: string;
  private gameZone: HTMLDivElement;
  private scene: THREE.Scene = new THREE.Scene();
  private clientId: string = "_0";

  private renderer!: THREE.WebGLRenderer;

  private playerCamera!: THREE.PerspectiveCamera;

  constructor(socket: any, key: string, gameZone: HTMLDivElement) {
    this.socket = socket;
    this.key = key;
    this.gameZone = gameZone;
    this.initThree();
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.socket.emit("new player");
    this.startPlayerGame()
    this.loopRender();
  }
  private listen(key: string): Promise<any> {
    return new Promise((resolve) => {
      this.socket.on(key, function (data: any) {
        console.log(`получено по ключу ${key}:` + data);
        resolve(data);
      });
    });
  }

  private onNewEvent(result: string, eventKey?: any) {
    console.log(`событие на ${eventKey || "?"} :`, result);
  }
  private initThree() {
    this.playerCamera = new THREE.PerspectiveCamera(
      80,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.gameZone.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color(0x00ff00);

    this.playerCamera.position.z = 10;
  }
  private async startPlayerGame() {
    const myUs = this.listen("generate");
    const { id, color } = await myUs;
    this.clientId = id;
  }

  private createCube(x: number, y: number, color: string): THREE.Object3D {
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: color });

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(x, y, 0);

    const wireframeGeometry = new THREE.WireframeGeometry(cubeGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 2,
    });
    const wireframe = new THREE.Line(wireframeGeometry, wireframeMaterial);
    cube.add(wireframe);

    return cube;
  }

  private loopRender() {
    if (!this.renderer || !this.gameZone) return;
    console.log("loop");
    this.socket.on("state", (players: Record<string, ClientPlayer>) => {
      // console.log(" update:", players);

      this.scene.clear();

      for (const id in players) {
        const player = players[id];

        const cube = this.createCube(player.x, player.y, player.color);
        if (this.clientId == player.id)
          this.playerCamera.position.set(player.x, player.y, 15);

        this.scene.add(cube);
      }

      this.renderer.render(this.scene, this.playerCamera);
    });
  }
}
