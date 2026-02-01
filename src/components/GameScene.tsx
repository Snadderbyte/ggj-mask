import { use, useCallback, useEffect, useMemo, useState } from "react";
import { Graphics, FillGradient } from "pixi.js";
import Player from "./Player";
import { useTick } from "@pixi/react";
import { useDebugMode } from "../hooks/useDebugMode";
import { useLevelManagerHook } from "../hooks/useLevelManager";
import ILevel from "./Level";
import levels from "../data/levels";

interface GameSceneProps {
  viewportWidth: number;
  viewportHeight: number;
}

function canvasMouseCoords(e: MouseEvent, canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function GameScene({ viewportWidth, viewportHeight }: GameSceneProps) {
  const CAMERA_ZOOM_MIN = 0.5;
  const CAMERA_ZOOM_MAX = 3;
  const CAMERA_ZOOM_SENSITIVITY = 0.001;

  const CONTROLS_LOCK_CAMERA = useMemo(() => ["KeyL"], []);
  const CONTROLS_RESTART_LEVEL = useMemo(() => ["KeyH"], []);
  const CONTROLS_FORCE_NEXT_LEVEL = useMemo(() => ["KeyN"], []);

  const { currentLevel, destroyPlatform, nextLevel, restartLevel } = useLevelManagerHook(levels);

  const [startedOn, setStartedOn] = useState(() => new Date());
  const [viewMousePos, setViewMousePos] = useState({ x: 0, y: 0 });
  const [mouseWorldPos, setMouseWorldPos] = useState({ x: 0, y: 0 });
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [score, setScore] = useState(0);
  const [playerPos, setPlayerPos] = useState(() => currentLevel.playerStart);
  const [cameraLocked, setCameraLocked] = useState(false);

  const debugMode = useDebugMode();

  const [debugText, setDebugText] = useState(""); // For whatever

  const resetPlayer = useCallback(() => {
    setPlayerPos(currentLevel.playerStart);
  }, [currentLevel]);

  // Normalized coordinate system, (0,0) is top-left, (1,1) is bottom-right
  const drawBackground = useCallback((graphics: Graphics) => {
    const gradient = new FillGradient({
      type: "linear",
      start: { x: 0, y: 1 },
      end: { x: 0, y: 0 },
      colorStops: [
        { offset: 0, color: "white" },
        { offset: 1, color: "black" },
      ],
      textureSpace: "local",
    });
    graphics.clear();
    graphics.setFillStyle(gradient);
    graphics.rect(0, 0, viewportWidth, viewportHeight);
    graphics.fill();
  }, [viewportWidth, viewportHeight]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const canvas = (e.target as HTMLElement)?.closest('canvas');
      if (!canvas) return;
      const mouse = canvasMouseCoords(e, canvas as HTMLCanvasElement);

      setCamera((prev) => {
        const newZoom = Math.min(Math.max(prev.zoom - e.deltaY * CAMERA_ZOOM_SENSITIVITY, CAMERA_ZOOM_MIN), CAMERA_ZOOM_MAX);

        const worldX = (mouse.x - prev.x) / prev.zoom;
        const worldY = (mouse.y - prev.y) / prev.zoom;

        const newX = mouse.x - (worldX * newZoom);
        const newY = mouse.y - (worldY * newZoom);

        return { x: newX, y: newY, zoom: newZoom };
      });
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (CONTROLS_RESTART_LEVEL.includes(e.code)) {
        restartLevel(resetPlayer);
        setStartedOn(new Date());
      };
      console.log("Key pressed:", e.code);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [restartLevel, CONTROLS_RESTART_LEVEL]);

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (CONTROLS_FORCE_NEXT_LEVEL.includes(e.code)) nextLevel(currentLevel.goal);
      console.log("Key pressed:", e.code);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextLevel, CONTROLS_FORCE_NEXT_LEVEL, currentLevel]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = (e.target as HTMLElement)?.closest('canvas');
      if (!canvas) return;
      const mouse = canvasMouseCoords(e, canvas as HTMLCanvasElement);
      setViewMousePos({ x: mouse.x, y: mouse.y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const worldX = (viewMousePos.x - camera.x) / camera.zoom;
    const worldY = (viewMousePos.y - camera.y) / camera.zoom;
    setMouseWorldPos({ x: worldX, y: worldY });
  }, [viewMousePos, camera]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (CONTROLS_LOCK_CAMERA.includes(e.code)) setCameraLocked((prev) => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [CONTROLS_LOCK_CAMERA]);

  useTick(() => {
    setScore((prev) => prev + 1);

    if (cameraLocked) {
      setCamera((prev) => ({
        ...prev,
        x: viewportWidth / 2 - playerPos.x * prev.zoom,
        y: viewportHeight / 2 - playerPos.y * prev.zoom,
      }));
    }

    let text = `Score: ${score}\n`;
    text += `Started On: ${startedOn.toLocaleString()}\n`;
    text += 'Press "P" to toggle debug mode\n';
    text += `Press "L" to toggle camera lock (${cameraLocked ? 'LOCKED' : 'FREE'})\n`;
    if (debugMode) {
      text += `Camera: (${camera.x.toFixed(2)}, ${camera.y.toFixed(2)}) @ ${camera.zoom.toFixed(2)}x\n`;
      text += `Mouse World: (${mouseWorldPos.x.toFixed(2)}, ${mouseWorldPos.y.toFixed(2)})\n`;
      text += `Player: (${playerPos.x.toFixed(2)}, ${playerPos.y.toFixed(2)})\n`;
      text += `Level: ${currentLevel.name} (ID: ${currentLevel.id})\n`;
    }
    setDebugText(text);
  });

  return (
    <>
      <pixiContainer x={camera.x} y={camera.y} scale={camera.zoom}>
        <pixiGraphics draw={drawBackground} />
        <ILevel level={currentLevel} />
        <Player
          initialPos={currentLevel.playerStart}
          mouseWorldPos={mouseWorldPos}
          platforms={currentLevel.platforms}
          onPositionChange={setPlayerPos}
          destroyPlatform={destroyPlatform}
          debugMode={debugMode}
          startedOn={startedOn}
        />
      </pixiContainer>
      <pixiText
        text={debugText}
        style={{
          fontFamily: "Arial",
          fontSize: 16,
          fill: 0xffffff,
        }}
      />
    </>
  );
}

export default GameScene;
