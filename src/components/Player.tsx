import { useCallback, useState, useEffect } from "react";
import { Graphics } from "pixi.js";
import { useRef } from "react";
import { useTick } from "@pixi/react";

interface PlayerProps {
  x: number;
  y: number;
  maxX: number;
  maxY: number;
}

function Player({ x: initialX, y: initialY, maxX, maxY }: PlayerProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const velocityY = useRef(0);
  const velocityX = useRef(0);
  const isGrounded = useRef(true);
  const GRAVITY = 0.5;
  const JUMP_STRENGTH = -15;
  const GROUND = maxY - 50; // -50 for player size

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const speed = 10;

      setPosition((prev) => {
        const newPos = { ...prev };

        switch (e.key) {
          case " ":
            if (isGrounded.current) {
              velocityY.current = JUMP_STRENGTH;
              isGrounded.current = false;
            }
            break;
          case "ArrowLeft":
          case "a":
            velocityX.current = -speed;
            break;
          case "ArrowRight":
          case "d":
            velocityX.current = speed;
            break;
        }

        return newPos;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [maxX, maxY]);

  useTick((ticker) => {
    setPosition((prev) => {
      const newPos = { ...prev };

      // gravity
      velocityY.current += GRAVITY * ticker.deltaTime;
      newPos.y += velocityY.current * ticker.deltaTime;

      // ground collision
      if (newPos.y >= GROUND) {
        newPos.y = GROUND;
        velocityY.current = 0;
        isGrounded.current = true;
      } else {
        isGrounded.current = false;
      }

      // horizontal movement
      newPos.x += velocityX.current * ticker.deltaTime;

      // horizontal boundaries
      newPos.x = Math.max(0, Math.min(maxX - 50, newPos.x));

      // friction or stop horizontal movement when no key is pressed and 
      if (isGrounded.current)
        velocityX.current *= 0.90;

      return newPos;
    });
  });

  // Draw the player
  const drawPlayer = useCallback((graphics: Graphics) => {
    graphics.clear();
    graphics.setFillStyle({ color: 0xe94560 });
    graphics.circle(25, 25, 25);
    graphics.fill();
  }, []);

  return (
    <pixiContainer x={position.x} y={position.y}>
      <pixiGraphics draw={drawPlayer} />
    </pixiContainer>
  );
}

export default Player;
