import { Graphics } from "pixi.js";

import type { Level  } from '../types/Level';
import { useCallback } from "react";
import { useDebugMode } from "../hooks/useDebugMode";


type Props = {
    level: Level;
};

function ILevel({ level }: Props) {

    const { platforms } = level;

    const debugMode = useDebugMode();

    const drawInvisiblePlatform = useCallback((graphics: Graphics, platform: typeof platforms[0]) => {
        graphics.setFillStyle({ color: 0x3b8b3b });
        graphics.setStrokeStyle({ color: 0x3b8b3b, width: 3, alignment: 0.8 });
        graphics.rect(platform.x, platform.y, platform.width, platform.height);
        const DIST = 20;
        const segments = Math.floor(platform.width / DIST);
        for (let s = 1; s < segments; s++) {
            graphics.moveTo(platform.x + s * DIST + DIST / 2, platform.y);
            graphics.lineTo(platform.x + s * DIST - DIST / 2, platform.y + platform.height);
        }
        graphics.stroke();
    }, []);

    const drawBreakablePlatform = useCallback((graphics: Graphics, platform: typeof platforms[0]) => {
        graphics.setFillStyle({ color: 0x8b3b3b });
        graphics.rect(platform.x, platform.y, platform.width, platform.height);
        graphics.fill();
    }, []);

    const drawRegularPlatform = useCallback((graphics: Graphics, platform: typeof platforms[0]) => {
        graphics.setFillStyle({ color: 0x3b3b3b });
        graphics.rect(platform.x, platform.y, platform.width, platform.height);
        graphics.fill();
    }, []);

    const drawPlatforms = useCallback((graphics: Graphics) => {
        graphics.clear();
        graphics.setFillStyle({ color: 0x3b3b3b });
        platforms.forEach((platform) => {
            if (platform.breakable) {
                drawBreakablePlatform(graphics, platform);
            } else if (platform.invisible) {
                drawInvisiblePlatform(graphics, platform);
            } else {
                drawRegularPlatform(graphics, platform);
            }
        });
    }, [platforms, drawBreakablePlatform, drawInvisiblePlatform, drawRegularPlatform]);

    const drawDebugPlatforms = useCallback((graphics: Graphics) => {
        if (!debugMode) {
          graphics.clear();
          return;
        }
        graphics.clear();
        graphics.setStrokeStyle({ width: 2, color: 0x00ff00, alpha: 0.6 });
        graphics.setFillStyle({ color: 0x00ff00, alpha: 0.1 });
        platforms.forEach((platform) => {
          graphics.rect(platform.x, platform.y, platform.width, platform.height);
          graphics.stroke();
          graphics.fill();
        });
      }, [debugMode, platforms]);

    return (
        <pixiContainer>
            <pixiGraphics draw={drawPlatforms} />
            <pixiGraphics draw={drawDebugPlatforms} />
        </pixiContainer>
    )
}

export default ILevel;