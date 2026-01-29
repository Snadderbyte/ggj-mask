import { useCallback, useEffect, useState } from "react";
import { Graphics, FillGradient } from "pixi.js";
import Player from "./Player";
import { useTick } from "@pixi/react";
import type { Platform } from "../types/Level";
import { useDebugMode } from "../hooks/useDebugMode";

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

  const [mouseWorldPos, setMouseWorldPos] = useState({ x: 0, y: 0 });
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [score, setScore] = useState(0);
  const debugMode = useDebugMode();

  const [debugText, setDebugText] = useState(""); // For whatever

  const platforms: Platform[] = [
    { x: -400, y: 300, width: 1200, height: 40 },
    { x: 200, y: 220, width: 140, height: 20 },
    { x: -150, y: 180, width: 120, height: 20 },
    { x: 420, y: 140, width: 120, height: 20 },
    { x: 400, y: 100, width: 20, height: 240 },
  ];

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

  const drawPlatforms = useCallback((graphics: Graphics) => {
    graphics.clear();
    graphics.setFillStyle({ color: 0x3b3b3b });
    platforms.forEach((platform) => {
      graphics.rect(platform.x, platform.y, platform.width, platform.height);
      graphics.fill();
    });
  }, [platforms]);

  const drawDebugPlatforms = useCallback((graphics: Graphics) => {
    if (!debugMode) {
      graphics.clear();
      return;
    }
    graphics.clear();
    graphics.setStrokeStyle({ width: 2, color: 0x00ff00, alpha: 0.6 });
    graphics.setFillStyle({ color: 0x00ff00, alpha: 0.1 });
    platforms.forEach((platform) => {
      graphics.rect(platform.x, platform.y, platform.width, platform.height);
      graphics.stroke();
      graphics.fill();
    });
  }, [debugMode, platforms]);

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
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = (e.target as HTMLElement)?.closest('canvas');
      if (!canvas) return;
      const mouse = canvasMouseCoords(e, canvas as HTMLCanvasElement);
      const worldX = (mouse.x - camera.x) / camera.zoom;
      const worldY = (mouse.y - camera.y) / camera.zoom;
      setMouseWorldPos({ x: worldX, y: worldY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [camera]);

  useTick(() => {
    setScore((prev) => prev + 1);
    let text = `Score: ${score}\n`;
    text += 'Press "P" to toggle debug mode\n';
    if (debugMode) {
      text += `Camera: (${camera.x.toFixed(2)}, ${camera.y.toFixed(2)}) @ ${camera.zoom.toFixed(2)}x\n`;
      text += `Mouse World: (${mouseWorldPos.x.toFixed(2)}, ${mouseWorldPos.y.toFixed(2)})\n`;
    }
    setDebugText(text);
  });

  return (
    <>
    <pixiContainer x={camera.x} y={camera.y} scale={camera.zoom}>
      <pixiGraphics draw={drawBackground} />
      <pixiGraphics draw={drawPlatforms} />
      <pixiGraphics draw={drawDebugPlatforms} />
      <Player initialPos={{ x: 10, y: 10 }} mouseWorldPos={mouseWorldPos} platforms={platforms} />
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
