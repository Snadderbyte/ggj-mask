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
  const [legAnimation, setLegAnimation] = useState(0);
  const velocityY = useRef(0);
  const velocityX = useRef(0);
  const isGrounded = useRef(true);
  const GRAVITY = 0.5;
  const JUMP_STRENGTH = -15;
  const GROUND = maxY - 40; // -50 for player size

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
    // Update leg animation when moving
    if (Math.abs(velocityX.current) > 0.5 && isGrounded.current) {
      setLegAnimation((prev) => prev + ticker.deltaTime * 0.2);
    }

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
      newPos.x = Math.max(-10, Math.min(maxX - 40, newPos.x));

      // friction or stop horizontal movement when no key is pressed and
      if (isGrounded.current) velocityX.current *= 0.6;

      return newPos;
    });
  });

  // Draw the player
  const drawFace = useCallback((graphics: Graphics) => {
    graphics.clear();
    graphics.setFillStyle({ color: 0xffffff });

    graphics.circle(20, 6, 3);
    graphics.fill();

    graphics.circle(30, 6, 3);
    graphics.fill();
  }, []);

  const drawBody = useCallback((graphics: Graphics) => {
    graphics.clear();
    graphics.setFillStyle({ color: 0x202020 });
    graphics.roundPoly(25,10,20,6,3)
    graphics.fill();
  }, []);

  const leftLeg = useCallback((graphics: Graphics) => {
    const legOffset = Math.sin(legAnimation) * 4;
    graphics.clear();
    graphics.setFillStyle({ color: 0x000000 });
    graphics.rect(15 + legOffset, 20, 6, 20);
    graphics.fill();
  }, [legAnimation]);

  const rightLeg = useCallback((graphics: Graphics) => {
    const legOffset = Math.sin(legAnimation) * 4;
    graphics.clear();
    graphics.setFillStyle({ color: 0x000000 });
    graphics.rect(29 - legOffset, 20, 6, 20);
    graphics.fill();
  }, [legAnimation]);

  /**
   * mask goes in between face and leg in order so that eyes are allways on top
   */
  return (
    <pixiContainer x={position.x} y={position.y}>
      <pixiGraphics draw={rightLeg} />
      <pixiGraphics draw={drawBody} />
      <pixiGraphics draw={leftLeg} />


      <pixiGraphics draw={drawFace} />
    </pixiContainer>
  );
}

export default Player;
