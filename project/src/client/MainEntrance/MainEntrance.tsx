import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./mainEntrance.css";
import skyTexture from "../res/vectorBack.png"; 


interface MainEntranceProps {
  onConfirm: (nickname: string) => void;
}

export const MainEntrance = ({ onConfirm }: MainEntranceProps) => {
  const [nickname, setNickname] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const lightRef = useRef<THREE.PointLight | null>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    const textureLoader = new THREE.TextureLoader ();
    const texture = textureLoader.load(skyTexture); 
    

    const materialSky = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,

     
    });

    const geometrySky = new THREE.SphereGeometry(10);

    const skybox = new THREE.Mesh(geometrySky, materialSky);

    scene.add(skybox);
    // scene.background = new THREE.Color(0x086972);

    const geometry = new THREE.BoxGeometry(2,2,2);
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const cube = new THREE.Mesh(geometry, material);
    cube.rotation.x = 10;

    scene.add(cube);

    const light = new THREE.PointLight(0xffffff);
    light.position.set(3, 3, 5);
    light.intensity = 15;
    scene.add(light);


    const light3 = new THREE.PointLight(0xa7ff83);
    light3.position.set(-2, 2, 3);
    light3.intensity = 20;
    scene.add(light3);

    const light2 = new THREE.PointLight(0x086972);
    light2.position.set(1, -2, 2);
    light2.intensity = 5;
    scene.add(light2);

    camera.position.z = 5;

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    cubeRef.current = cube;
    lightRef.current = light;

    const handleResize = () => {
      const renderer = rendererRef.current;
      const container = containerRef.current;
      if (renderer && container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const container = containerRef.current;
    if (container && renderer) {
      container.appendChild(renderer.domElement);
    }

    const animate = () => {
      const cube = cubeRef.current;
      if (cube) {
        cube.rotation.y += 0.01;
      }

      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const handleConfirmClick = () => {
    onConfirm(nickname);
  };

  return (
    <div className={styles.mainEntranceBlock}>
      <div className={styles.frame}>
        <div className={styles.form}>
          <label htmlFor="nickname" className={styles.txt}>Вводи ник:</label>
          <div className={styles.inputBlock}>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={handleNicknameChange}
            className={styles.input}
          />
          <button onClick={handleConfirmClick} className={styles.btn}>Подтвердить</button>
          </div>
        </div>
      </div>
      <div ref={containerRef} className={styles.threeСontainer} />
    </div>
  );
};
