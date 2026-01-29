import { useCallback, useState, useEffect } from "react";
import { Graphics } from "pixi.js";
import { useRef } from "react";
import { useTick } from "@pixi/react";
import { useDebugMode } from "../hooks/useDebugMode";
import type { Platform } from "../types/Level";
import { Mask } from "../types/Mask";

interface PlayerProps {
  initialPos: { x: number; y: number };
  mouseWorldPos: { x: number; y: number };
  platforms: Platform[];
  onPositionChange?: (pos: { x: number; y: number }) => void;
}

function clamp(x: number, min: number, max: number): number {
  if (min > max) [min, max] = [max, min];
  return Math.min(Math.max(x, min), max);
}

function intersects(bounds: ReturnType<typeof getCollisionBounds>, platform: Platform) {
  return (
    bounds.left < platform.x + platform.width &&
    bounds.right > platform.x &&
    bounds.top < platform.y + platform.height &&
    bounds.bottom > platform.y
  );
}

const PLAYER_COLLIDER = { width: 20, height: 45, offsetX: 0, offsetY: 6 };
const SPEED = 1;
const MAX_VELOCITY_X = 0.8;
const MAX_VELOCITY_Y = 3;
const LEG_ANIMATION_SPEED = 0.03;
const LEG_ANIMATION_STRIDE = 4;
const JUMP_IMPULSE_STRENGTH = 1.6;
const GRAVITY_ACC = 0.008;
const GROUND_FRICTION_MU = 0.72;
const DRAG_COEFFFICIENT = 0.02; // Air resistance

function getCollisionBounds(posX: number, posY: number) {
  const left = posX + PLAYER_COLLIDER.offsetX - PLAYER_COLLIDER.width / 2;
  const top = posY + PLAYER_COLLIDER.offsetY - PLAYER_COLLIDER.height / 2;
  return {
    left,
    right: left + PLAYER_COLLIDER.width,
    top,
    bottom: top + PLAYER_COLLIDER.height,
  };
}

function collisionResolveX(posX: number, posY: number, velX: number, platforms: Platform[]) {
  let resolvedX = posX;
  let resolvedVelX = velX;

  platforms.forEach((platform) => {
    const bounds = getCollisionBounds(resolvedX, posY);
    if (intersects(bounds, platform)) {
      if (velX > 0) {
        resolvedX = platform.x - PLAYER_COLLIDER.offsetX - PLAYER_COLLIDER.width / 2;
      } else if (velX < 0) {
        resolvedX = platform.x + platform.width - PLAYER_COLLIDER.offsetX + PLAYER_COLLIDER.width / 2;
      }
      resolvedVelX = 0;
    }
  });

  return { posX: resolvedX, velX: resolvedVelX };
}

function collisionResolveY(posX: number, posY: number, velY: number, platforms: Platform[]) {
  let resolvedY = posY;
  let resolvedVelY = velY;
  let grounded = false;

  platforms.forEach((platform) => {
    const bounds = getCollisionBounds(posX, resolvedY);
    if (intersects(bounds, platform)) {
      if (velY > 0) {
        resolvedY = platform.y - PLAYER_COLLIDER.offsetY - PLAYER_COLLIDER.height / 2;
        grounded = true;
      } else if (velY < 0) {
        resolvedY = platform.y + platform.height - PLAYER_COLLIDER.offsetY + PLAYER_COLLIDER.height / 2;
      }
      resolvedVelY = 0;
    }
  });

  return { posY: resolvedY, velY: resolvedVelY, grounded };
}

function Player({ initialPos, mouseWorldPos, platforms, onPositionChange }: PlayerProps) {
  const controlState = useRef(new Set());
  const controlSpent = useRef(new Set()); // Actions "consumed" per press cycle
  const [kinematics, setKinematics] = useState({ posX: initialPos.x, posY: initialPos.y, velX: 0, velY: 0, accX: 0, accY: 0 });
  const [eyeVector, setEyeVector] = useState({ x: 0, y: 0 }); // normalized vector of eye direction

  const [maskInventory, setMaskInventory] = useState([Mask.RED, Mask.BLUE, Mask.GREEN, Mask.YELLOW]);
  const [wornMaskIndex, setWornMaskIndex] = useState(0);

  const isGrounded = useRef(true);
  const [legAnimation, setLegAnimation] = useState(0);

  const debugMode = useDebugMode();

  useEffect(() => {
    const down = (e: KeyboardEvent) => controlState.current.add(e.code);
    const up = (e: KeyboardEvent) => { controlState.current.delete(e.code); controlSpent.current.delete(e.code); }

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
      if (controlState.current.has('Space') && !controlSpent.current.has('Space') && isGrounded.current) {
        newKinematics.velY -= JUMP_IMPULSE_STRENGTH;
        controlSpent.current.add('Space')
      }

      // Ground friction
      if (isGrounded.current) {
        const frictionAcc = GROUND_FRICTION_MU * GRAVITY_ACC * 1; // Mass is 1
        const frictionDelta = frictionAcc * ticker.deltaMS;
        if (Math.abs(newKinematics.velX) < frictionDelta) newKinematics.velX = 0;
        else newKinematics.velX -= Math.sign(newKinematics.velX) * frictionDelta;
      }

      // Air drag (horizontal only)
      newKinematics.accX += -newKinematics.velX * DRAG_COEFFFICIENT;

      const nextX = newKinematics.posX + newKinematics.velX * ticker.deltaMS;
      const nextY = newKinematics.posY + newKinematics.velY * ticker.deltaMS;

      const resolvedX = collisionResolveX(nextX, newKinematics.posY, newKinematics.velX, platforms);
      const resolvedY = collisionResolveY(newKinematics.posX, nextY, newKinematics.velY, platforms);
      newKinematics.posX = resolvedX.posX;
      newKinematics.velX = resolvedX.velX;
      newKinematics.posY = resolvedY.posY;
      newKinematics.velY = resolvedY.velY;
      isGrounded.current = resolvedY.grounded;

      newKinematics.velX += newKinematics.accX * ticker.deltaMS;
      newKinematics.velY += newKinematics.accY * ticker.deltaMS;
      newKinematics.velX = clamp(newKinematics.velX, -MAX_VELOCITY_X, MAX_VELOCITY_X);
      newKinematics.velY = clamp(newKinematics.velY, -MAX_VELOCITY_Y, MAX_VELOCITY_Y);

      onPositionChange?.({ x: newKinematics.posX, y: newKinematics.posY });

      return newKinematics;
    });

    setWornMaskIndex((prev) => {
      let index = prev;
      if (controlState.current.has('KeyQ') && !controlSpent.current.has('KeyQ')) { index--; controlSpent.current.add('KeyQ'); }
      if (controlState.current.has('KeyE') && !controlSpent.current.has('KeyE')) { index++; controlSpent.current.add('KeyE'); }
      index += maskInventory.length;
      index %= maskInventory.length;
      return index;
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
    const mask = maskInventory[wornMaskIndex];
    if (mask != Mask.NONE) {
      graphics.setFillStyle({ color: mask.color });
      graphics.roundPoly(0,0,16,6,3);
      graphics.fill();
    }

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

  }, [legAnimation, eyeVector, wornMaskIndex, maskInventory]);

  const drawDebugCollider = useCallback((graphics: Graphics) => {
    if (!debugMode) {
      graphics.clear();
      return;
    }
    graphics.clear();
    const left = PLAYER_COLLIDER.offsetX - PLAYER_COLLIDER.width / 2;
    const top = PLAYER_COLLIDER.offsetY - PLAYER_COLLIDER.height / 2;
    graphics.setStrokeStyle({ width: 2, color: 0xff00ff, alpha: 0.8 });
    graphics.setFillStyle({ color: 0xff00ff, alpha: 0.1 });
    graphics.rect(left, top, PLAYER_COLLIDER.width, PLAYER_COLLIDER.height);
    graphics.stroke();
    graphics.fill();
  }, [debugMode]);

  return (
    <pixiContainer x={kinematics.posX} y={kinematics.posY}>
      <pixiGraphics draw={drawPlayer} />
      <pixiGraphics draw={drawDebugCollider} />
    </pixiContainer>
  );
}

export default Player;
