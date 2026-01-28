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

function clamp(x: number, min: number, max: number): number {
  if (min > max) [min, max] = [max, min];
  return Math.min(Math.max(x, min), max);
}

function Player({ x: initialX, y: initialY, maxX, maxY }: PlayerProps) {
  const controlState = useRef(new Set());
  const [kinematics, setKinematics] = useState({ posX: initialX, posY: initialY, velX: 0, velY: 0, accX: 0, accY: 0 });
  //const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [legAnimation, setLegAnimation] = useState(0);
  const velocityY = useRef(0);
  const velocityX = useRef(0);
  const isGrounded = useRef(true);
  const GRAVITY_ACC = 0.008;
  //const JUMP_STRENGTH = -15;
  const GROUND = maxY - 40; // -40 for player size
  const PLAYER_SPEED = 1;
  const MAX_VELOCITY_X = 1;
  const MAX_VELOCITY_Y = 1;
  const JUMP_IMPULSE_STRENGTH = 10;

  const GROUND_FRICTION_MU = 0.72;


  useEffect(() => {
    const down = (e: KeyboardEvent) => controlState.current.add(e.code);
    const up = (e: KeyboardEvent) => controlState.current.delete(e.code);

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    }
  }, []);

  /*
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
  }, [maxX, maxY]);*/

  useTick((ticker) => {
    // kinematics
    setKinematics((prev) => {
      const newKinematics = { ...prev };

      newKinematics.accX = 0;
      newKinematics.accY = GRAVITY_ACC;
      if (controlState.current.has('ArrowLeft') || controlState.current.has('KeyA')) newKinematics.accX -= PLAYER_SPEED;
      if (controlState.current.has('ArrowRight') || controlState.current.has('KeyD')) newKinematics.accX += PLAYER_SPEED;
      if (controlState.current.has('Space') && isGrounded.current) newKinematics.velY = -JUMP_IMPULSE_STRENGTH; 

      newKinematics.posX += newKinematics.velX * ticker.deltaMS;
      newKinematics.posY += newKinematics.velY * ticker.deltaMS;

      newKinematics.velX += newKinematics.accX * ticker.deltaMS;
      newKinematics.velY += newKinematics.accY * ticker.deltaMS;
      newKinematics.velX = clamp(newKinematics.velX, -MAX_VELOCITY_X, MAX_VELOCITY_X);
      newKinematics.velY = clamp(newKinematics.velY, -MAX_VELOCITY_Y, MAX_VELOCITY_Y);

      if (isGrounded.current) {
        const frictionAcc = GROUND_FRICTION_MU * GRAVITY_ACC * 1; // Mass is 1
        const frictionDelta = frictionAcc * ticker.deltaMS;
        if (Math.abs(newKinematics.velX) < frictionDelta) newKinematics.velX = 0;
        else newKinematics.velX -= Math.sign(newKinematics.velX) * frictionDelta;
      }

      isGrounded.current = newKinematics.posY >= GROUND;
      newKinematics.posY = Math.min(newKinematics.posY, GROUND);

      return newKinematics;
    });

    // Update leg animation when moving
    if (Math.abs(velocityX.current) > 0.5 && isGrounded.current) {
      setLegAnimation((prev) => prev + ticker.deltaTime * 0.2);
    }
/*
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
*/  });

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
    <pixiContainer x={kinematics.posX} y={kinematics.posY}>
      <pixiGraphics draw={rightLeg} />
      <pixiGraphics draw={drawBody} />
      <pixiGraphics draw={leftLeg} />


      <pixiGraphics draw={drawFace} />
    </pixiContainer>
  );
}

export default Player;
