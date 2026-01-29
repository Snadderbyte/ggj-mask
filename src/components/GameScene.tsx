import { useCallback, useEffect, useState } from "react";
import { Graphics, FillGradient } from "pixi.js";
import Player from "./Player";
import { useTick } from "@pixi/react";

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

  const [debugText, setDebugText] = useState(""); // For whatever

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
    setDebugText(`Score: ${score}\nCamera: (${camera.x.toFixed(2)}, ${camera.y.toFixed(2)}) @ ${camera.zoom.toFixed(2)}x\nMouse World: (${mouseWorldPos.x.toFixed(2)}, ${mouseWorldPos.y.toFixed(2)})`);
  });

  return (
    <>
    <pixiContainer x={camera.x} y={camera.y} scale={camera.zoom}>
      <pixiGraphics draw={drawBackground} />
      <Player initialPos={{ x: 10, y: 10 }} mouseWorldPos={mouseWorldPos} />
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
