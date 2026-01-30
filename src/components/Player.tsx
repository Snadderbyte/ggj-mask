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
  destroyPlatform: (platform: Platform) => void;
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

function collides(wornMask: Mask, bounds: ReturnType<typeof getCollisionBounds>, platform: Platform) {
  if (wornMask != Mask.GREEN && platform.invisible) return false;
  return intersects(bounds, platform);
}

const PLAYER_COLLIDER = { width: 20, height: 45, offsetX: 0, offsetY: 6 };
const PLAYER_RAGE_BOUNDS = { width: 240, height: 150, offsetX: 0, offsetY: 6 };
const SPEED = 1;
const MAX_VELOCITY_X = 0.8;
const MAX_VELOCITY_Y = 3;
const LEG_ANIMATION_SPEED = 0.03;
const LEG_ANIMATION_STRIDE = 4;
const JUMP_IMPULSE_STRENGTH = 1.6;
const GROUNDED_EXTRA_TIME_MS = 50.0; // Extra time the player remains grounded after no longer touching a platform
const DASH_IMPULSE_STRENGTH = 4.0;
const DASH_COOLDOWN_MS = 500.0;
const GRAVITY_ACC = 0.008;
const GROUND_FRICTION_MU = 0.72;
const DRAG_COEFFFICIENT = 0.01; // Air resistance

const CONTROLS_JUMP = ["Space", "ArrowUp", "KeyW"];
const CONTROLS_LEFT = ["ArrowLeft", "KeyA"];
const CONTROLS_RIGHT = ["ArrowRight", "KeyD"];
const CONTROLS_MASK_LEFT = ["KeyQ"];
const CONTROLS_MASK_RIGHT = ["KeyE"];
const CONTROLS_MASK_USE = ["KeyF"];
const CONTROLS_DASH = ["KeyR"];

function controlCheck(control: string[], controlState: Set<string>) {
  for (const key of control) { if (controlState.has(key)) return true; }
  return false;
}

function controlCheckSpend(control: string[], controlState: Set<string>, controlSpent: Set<string>) {
  for (const key of control) {
    if (controlState.has(key) && !controlSpent.has(key)) {
      controlSpent.add(key);
      return true;
    }
  }
  return false;
}

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

function getRageBounds(posX: number, posY: number) {
  const left = posX + PLAYER_RAGE_BOUNDS.offsetX - PLAYER_RAGE_BOUNDS.width / 2;
  const top = posY + PLAYER_RAGE_BOUNDS.offsetY - PLAYER_RAGE_BOUNDS.height / 2;
  return {
    left,
    right: left + PLAYER_RAGE_BOUNDS.width,
    top,
    bottom: top + PLAYER_RAGE_BOUNDS.height,
  };
}

function collisionResolveX(posX: number, posY: number, velX: number, wornMask: Mask, platforms: Platform[]) {
  let resolvedX = posX;
  let resolvedVelX = velX;

  platforms.forEach((platform) => {
    const bounds = getCollisionBounds(resolvedX, posY);
    if (collides(wornMask, bounds, platform)) {
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

function collisionResolveY(posX: number, posY: number, velY: number, wornMask: Mask, platforms: Platform[]) {
  let resolvedY = posY;
  let resolvedVelY = velY;
  let grounded = false;

  platforms.forEach((platform) => {
    const bounds = getCollisionBounds(posX, resolvedY);
    if (collides(wornMask, bounds, platform)) {
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

function Player({ initialPos, mouseWorldPos, platforms, onPositionChange, destroyPlatform }: PlayerProps) {
  const controlState = useRef<Set<string>>(new Set());
  const controlSpent = useRef<Set<string>>(new Set()); // Actions "consumed" per press cycle
  const [kinematics, setKinematics] = useState({ posX: initialPos.x, posY: initialPos.y, velX: 0, velY: 0, accX: 0, accY: 0 });
  const [eyeVector, setEyeVector] = useState({ x: 0, y: 0 }); // normalized vector of eye direction

  const [maskInventory, setMaskInventory] = useState([Mask.RED, Mask.BLUE, Mask.GREEN, Mask.YELLOW]);
  const [wornMaskIndex, setWornMaskIndex] = useState(0);

  const [timeSinceDash, setTimeSinceDash] = useState(0);
  const timeSinceLastGrounded = useRef(0);
  const charge = useRef(1);
  const isGrounded = useRef(false); // Body against floor
  const isSliding = useRef(false); // Body against wall
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
      if (controlCheck(CONTROLS_LEFT, controlState.current)) newKinematics.accX -= SPEED;
      if (controlCheck(CONTROLS_RIGHT, controlState.current)) newKinematics.accX += SPEED;
      if (controlCheckSpend(CONTROLS_JUMP, controlState.current, controlSpent.current) && timeSinceLastGrounded.current < GROUNDED_EXTRA_TIME_MS) {
        newKinematics.velY -= JUMP_IMPULSE_STRENGTH;
        timeSinceLastGrounded.current = GROUNDED_EXTRA_TIME_MS;
      }
      if (controlCheckSpend(CONTROLS_DASH, controlState.current, controlSpent.current) && timeSinceDash >= DASH_COOLDOWN_MS && charge.current > 0) {
        newKinematics.velX += DASH_IMPULSE_STRENGTH; // TODO: directional
        charge.current--;
        setTimeSinceDash(0);
      }

      // Ground friction
      if (isGrounded.current) {
        const frictionAcc = GROUND_FRICTION_MU * GRAVITY_ACC;
        const frictionDelta = frictionAcc * ticker.deltaMS;
        if (Math.abs(newKinematics.velX) < frictionDelta) newKinematics.velX = 0;
        else newKinematics.velX -= Math.sign(newKinematics.velX) * frictionDelta;
      }

      // Air drag (horizontal only)
      newKinematics.accX += -newKinematics.velX * DRAG_COEFFFICIENT;

      const nextX = newKinematics.posX + newKinematics.velX * ticker.deltaMS;
      const nextY = newKinematics.posY + newKinematics.velY * ticker.deltaMS;

      const resolvedX = collisionResolveX(nextX, newKinematics.posY, newKinematics.velX, maskInventory[wornMaskIndex], platforms);
      const resolvedY = collisionResolveY(newKinematics.posX, nextY, newKinematics.velY, maskInventory[wornMaskIndex], platforms);
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

    timeSinceLastGrounded.current += ticker.deltaMS;
    if (isGrounded.current) timeSinceLastGrounded.current = 0;

    setTimeSinceDash((prev) => prev + ticker.deltaMS);

    if (isGrounded) charge.current = 1;

    setWornMaskIndex((prev) => {
      let index = prev;
      if (controlCheckSpend(CONTROLS_MASK_LEFT, controlState.current, controlSpent.current)) index--;
      if (controlCheckSpend(CONTROLS_MASK_RIGHT, controlState.current, controlSpent.current)) index++;
      index += maskInventory.length;
      index %= maskInventory.length;
      return index;
    });

    if (maskInventory[wornMaskIndex] === Mask.RED && controlCheckSpend(CONTROLS_MASK_USE, controlState.current, controlSpent.current)) {
      for (const platform of platforms) {
        if (!platform.breakable) continue;
        const bounds = getRageBounds(kinematics.posX, kinematics.posY);
        if (intersects(bounds, platform)) destroyPlatform(platform);
      }
    }

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
  }, [legAnimation, eyeVector, wornMaskIndex, maskInventory]);

  const drawDebugCollider = useCallback((graphics: Graphics) => {
    graphics.clear();
    if (!debugMode) return;

    // Collider
    const left = PLAYER_COLLIDER.offsetX - PLAYER_COLLIDER.width / 2;
    const top = PLAYER_COLLIDER.offsetY - PLAYER_COLLIDER.height / 2;
    graphics.setStrokeStyle({ width: 2, color: 0xff00ff, alpha: 0.8 });
    graphics.setFillStyle({ color: 0xff00ff, alpha: 0.1 });
    graphics.rect(left, top, PLAYER_COLLIDER.width, PLAYER_COLLIDER.height);
    graphics.stroke();
    graphics.fill();

    // Rage Bounds
    const rageLeft = PLAYER_RAGE_BOUNDS.offsetX - PLAYER_RAGE_BOUNDS.width / 2;
    const rageTop = PLAYER_RAGE_BOUNDS.offsetY - PLAYER_RAGE_BOUNDS.height / 2;
    graphics.setStrokeStyle({ width: 2, color: 0xffff00, alpha: 0.8 });
    graphics.setFillStyle({ color: 0xffff00, alpha: 0.1 });
    graphics.rect(rageLeft, rageTop, PLAYER_RAGE_BOUNDS.width, PLAYER_RAGE_BOUNDS.height);
    graphics.stroke();

    // Debug Center
    graphics.setFillStyle({ color: 0xff0000 });
    graphics.circle(0, 0, 2);
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
