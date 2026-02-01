import { Graphics } from "pixi.js";

import type { Goal, Hazard, Interactable, Level  } from '../types/Level';
import { useCallback } from "react";
import { useDebugMode } from "../hooks/useDebugMode";


type Props = {
    level: Level;
};

function ILevel({ level }: Props) {

    const { platforms, interactables, hazards, goal } = level;

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

    const drawInteractable = useCallback((graphics: Graphics, interactable: Interactable) => {
        graphics.setFillStyle({ color: 0x3b3b8b });
        interactable.boxes.forEach(box => {
            graphics.rect(box.x, box.y, box.width, box.height);
            graphics.fill();
        });
        graphics.fill();
    }, []);

    const drawHazard = useCallback((graphics: Graphics, hazard: Hazard) => {
        graphics.setFillStyle({ color: 0xffff00 });
        graphics.rect(hazard.x, hazard.y, hazard.width, hazard.height);
        graphics.fill();
    }, []);

    const drawGoal = useCallback((graphics: Graphics, goal: Goal) => {
        graphics.setFillStyle({ color: 'darkRed' })
        graphics.ellipse((goal.x + goal.width / 2) + 2, (goal.y + goal.height / 2), (goal.width / 2) + 2, goal.height);
        graphics.fill();

        graphics.setFillStyle({ color: goal.color1})
        graphics.ellipse(goal.x + goal.width / 2, goal.y + goal.height / 2, goal.width / 2, goal.height);
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
        interactables?.forEach((interactable) => {
            drawInteractable(graphics, interactable);
        });
        hazards?.forEach((hazard) => {
            drawHazard(graphics, hazard);
        });
        drawGoal(graphics, goal);
        
    }, [platforms, interactables, hazards, drawBreakablePlatform, drawInvisiblePlatform, drawRegularPlatform, drawInteractable, drawHazard, drawGoal, goal]);


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
        
        interactables?.forEach((interactable) => {
            interactable.boxes.forEach((box) => {
                graphics.rect(box.x, box.y, box.width, box.height);
            graphics.stroke();
            graphics.fill();
            });
        });
        hazards?.forEach((hazard) => {
            graphics.rect(hazard.x, hazard.y, hazard.width, hazard.height);
            graphics.stroke();
            graphics.fill();
        });
        graphics.rect(goal.x, goal.y, goal.width, goal.height);
        graphics.stroke();
        graphics.fill();
      }, [debugMode, platforms, interactables, hazards, goal]);
    return (
        <pixiContainer>
            <pixiGraphics draw={drawPlatforms} />
            <pixiGraphics draw={drawDebugPlatforms} />
        </pixiContainer>
    )
}

export default ILevel;