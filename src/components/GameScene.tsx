import { useCallback, useState } from "react";
import { Graphics, FillGradient } from "pixi.js";
import Player from "./Player";
import { useTick } from "@pixi/react";

interface GameSceneProps {
  width: number;
  height: number;
}

function GameScene({ width, height }: GameSceneProps) {
  const [score, setScore] = useState(0);

  // Background graphics
  const drawBackground = useCallback(
    (graphics: Graphics) => {
      const gradient = new FillGradient({
        type: "linear",
        start: { x: 0, y: 1 }, // Start at top
        end: { x: 0, y: 0 }, // End at bottom
        colorStops: [
          { offset: 0, color: "white" }, // Red at start
          { offset: 1, color: "black" }, // Blue at end
        ],
        // Use normalized coordinate system where (0,0) is the top-left and (1,1) is the bottom-right of the shape
        textureSpace: "local",
      });
      graphics.clear();
      graphics.setFillStyle(gradient);
      graphics.rect(0, 0, width, height);
      graphics.fill();
    },
    [width, height],
  );

  useTick(() => {
    setScore((prev) => prev + 1);
  });

  return (
    <pixiContainer>
      {/* Background */}
      <pixiGraphics draw={drawBackground} />

      {/* Player */}
      <Player x={width / 2} y={height / 2} maxX={width} maxY={height} />

      {/* UI - Score display */}
      <pixiText
        text={`Score: ${score}`}
        x={10}
        y={10}
        style={{
          fontFamily: "Arial",
          fontSize: 24,
          fill: 0xffffff,
        }}
      />
    </pixiContainer>
  );
}

export default GameScene;
