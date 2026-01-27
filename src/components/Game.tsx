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

const ASPECT_RATIO = 16 / 10;
const BORDER = 20;

function Game() {
  const [dimensions, setDimensions] = useState(() => {
    const availableWidth = window.innerWidth - BORDER * 2;
    const availableHeight = window.innerHeight - BORDER * 2;
    
    let width = availableWidth;
    let height = width / ASPECT_RATIO;
    
    if (height > availableHeight) {
      height = availableHeight;
      width = height * ASPECT_RATIO;
    }
    
    return { width, height };
  });

  useEffect(() => {
    const handleResize = () => {
      const availableWidth = window.innerWidth - BORDER * 2;
      const availableHeight = window.innerHeight - BORDER * 2;
      
      let width = availableWidth;
      let height = width / ASPECT_RATIO;
      
      if (height > availableHeight) {
        height = availableHeight;
        width = height * ASPECT_RATIO;
      }
      
      setDimensions({ width, height });
    };

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
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor={0x1a1a2e}
      >
        <GameScene width={dimensions.width} height={dimensions.height} />
      </Application>
    </div>
  );
}

export default Game;
