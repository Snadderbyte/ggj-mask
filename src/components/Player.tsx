import { useCallback, useState, useEffect } from "react";
import { Graphics } from "pixi.js";
import { useRef } from "react";
import { useTick } from "@pixi/react";

interface PlayerProps {
  initialPos: { x: number; y: number };
  mouseWorldPos: { x: number; y: number };
}

function clamp(x: number, min: number, max: number): number {
  if (min > max) [min, max] = [max, min];
  return Math.min(Math.max(x, min), max);
}

function Player({ initialPos, mouseWorldPos }: PlayerProps) {
  const GROUND = 500; // temporary ground level
  const SPEED = 1;
  const MAX_VELOCITY_X = 1;
  const MAX_VELOCITY_Y = 3;
  const LEG_ANIMATION_SPEED = 0.03;
  const LEG_ANIMATION_STRIDE = 4;
  const JUMP_IMPULSE_STRENGTH = 2;
  const GRAVITY_ACC = 0.008;
  const GROUND_FRICTION_MU = 0.72;

  const controlState = useRef(new Set());
  const [kinematics, setKinematics] = useState({ posX: initialPos.x, posY: initialPos.y, velX: 0, velY: 0, accX: 0, accY: 0 });
  const [eyeVector, setEyeVector] = useState({ x: 0, y: 0 }); // normalized vector of eye direction

  const isGrounded = useRef(true);
  const [legAnimation, setLegAnimation] = useState(0);


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

  useTick((ticker) => {
    setKinematics((prev) => {
      const newKinematics = { ...prev };

      newKinematics.accX = 0;
      newKinematics.accY = GRAVITY_ACC;
      if (controlState.current.has('ArrowLeft') || controlState.current.has('KeyA')) newKinematics.accX -= SPEED;
      if (controlState.current.has('ArrowRight') || controlState.current.has('KeyD')) newKinematics.accX += SPEED;
      if (controlState.current.has('Space') && isGrounded.current) newKinematics.velY -= JUMP_IMPULSE_STRENGTH;

      if (isGrounded.current) {
        const frictionAcc = GROUND_FRICTION_MU * GRAVITY_ACC * 1; // Mass is 1
        const frictionDelta = frictionAcc * ticker.deltaMS;
        if (Math.abs(newKinematics.velX) < frictionDelta) newKinematics.velX = 0;
        else newKinematics.velX -= Math.sign(newKinematics.velX) * frictionDelta;
      }

      newKinematics.posX += newKinematics.velX * ticker.deltaMS;
      newKinematics.posY += newKinematics.velY * ticker.deltaMS;

      newKinematics.velX += newKinematics.accX * ticker.deltaMS;
      newKinematics.velY += newKinematics.accY * ticker.deltaMS;
      newKinematics.velX = clamp(newKinematics.velX, -MAX_VELOCITY_X, MAX_VELOCITY_X);
      newKinematics.velY = clamp(newKinematics.velY, -MAX_VELOCITY_Y, MAX_VELOCITY_Y);

      if (isGrounded.current && newKinematics.velY > 0) newKinematics.velY = 0;

      isGrounded.current = newKinematics.posY >= GROUND;
      newKinematics.posY = Math.min(newKinematics.posY, GROUND);

      return newKinematics;
    });

    setEyeVector(() => {
      const vector = { x: 0, y: 0 };
      const target = { x: mouseWorldPos.x, y: mouseWorldPos.y };

      const dx = target.x - kinematics.posX;
      const dy = target.y - kinematics.posY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 0) {
        vector.x = dx / distance;
        vector.y = dy / distance;
      }
      return vector;
    });

    if (Math.abs(kinematics.velX) > 0 && isGrounded.current) {
      setLegAnimation((prev) => prev + ticker.deltaMS * LEG_ANIMATION_SPEED);
    }
  });

  const drawPlayer = useCallback((graphics: Graphics) => {
    const legOffset = Math.sin(legAnimation) * LEG_ANIMATION_STRIDE;

    graphics.clear();

    // Right leg (back)
    graphics.setFillStyle({ color: 0x000000 });
    graphics.rect(4 - legOffset, 10, 6, 20);
    graphics.fill();

    // Body
    graphics.setFillStyle({ color: 0x202020 });
    graphics.roundPoly(0,0,20,6,3)
    graphics.fill();

    // Left leg (front)
    graphics.setFillStyle({ color: 0x000000 });
    graphics.rect(-10 + legOffset, 10, 6, 20);
    graphics.fill();

    // Mask
    // TODO

    // Eyes
    const EYE_VECTOR_SCALE = 4;
    graphics.setFillStyle({ color: 0xffffff });
    graphics.circle(-5 + eyeVector.x * EYE_VECTOR_SCALE, -4 + eyeVector.y * EYE_VECTOR_SCALE, 3);
    graphics.fill();
    graphics.circle(5 + eyeVector.x * EYE_VECTOR_SCALE, -4 + eyeVector.y * EYE_VECTOR_SCALE, 3);
    graphics.fill();

    // Debug center
    graphics.setFillStyle({ color: 0xff0000 });
    graphics.circle(0, 0, 2);
    graphics.fill();

  }, [legAnimation, eyeVector]);

  return (
    <pixiContainer x={kinematics.posX} y={kinematics.posY}>
      <pixiGraphics draw={drawPlayer} />
    </pixiContainer>
  );
}

export default Player;
