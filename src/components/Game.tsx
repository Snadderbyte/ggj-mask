import { Application, extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { useState, useEffect } from "react";
import GameScene from "./GameScene";

// Extend @pixi/react with Pixi components
extend({
  Container,
  Graphics,
  Text,
});

const VIEWPORT_ASPECT_RATIO = 16 / 9;
const BORDER = 20;

function calcViewport(): { width: number; height: number } {
  const w = window.innerWidth - BORDER * 2;
  const h = window.innerHeight - BORDER * 2;

  const wt = h * VIEWPORT_ASPECT_RATIO;
  const ht = w / VIEWPORT_ASPECT_RATIO;

  if (h < ht) return { width: wt, height: h };
  else return { width: w, height: ht };
}

function Game() {
  const [viewport, setViewport] = useState(calcViewport());

  useEffect(() => {
    const handleResize = () => setViewport(calcViewport());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      padding: `${BORDER}px`,
      boxSizing: "border-box"
    }}>
      <Application
        width={viewport.width}
        height={viewport.height}
        backgroundColor={0x1a1a2e}
      >
        <GameScene viewportWidth={viewport.width} viewportHeight={viewport.height} />
      </Application>
    </div>
  );
}

export default Game;
