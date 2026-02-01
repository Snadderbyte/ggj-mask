import { useState } from "react";
import type { Goal, Platform } from "../types/Level";
import type { Level } from "../types/Level";


export function useLevelManagerHook(levels: Level[]) {
    const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);
    const [isComplete, setIsComplete] = useState<boolean>(false);

    const nextLevel = (goal: Goal) => {
        console.log("Next level:", goal.nextLevelId);
        setCurrentLevel(levels.find(level => level.id === goal.nextLevelId) || currentLevel);
    }

    const restartLevel = (resetPlayer: () => void) => {
        const originalLevel = levels.find(level => level.id === currentLevel.id);
        if (originalLevel) {
            setCurrentLevel({
                ...originalLevel,
                platforms: originalLevel.platforms.map(p => ({ ...p })),
                hazards: originalLevel.hazards ? originalLevel.hazards.map(h => ({ ...h })) : [],
                interactables: originalLevel.interactables ? originalLevel.interactables.map(i => ({
                    ...i,
                    boxes: i.boxes.map(b => ({ ...b }))
                })) : [],
            });
        }
        setIsComplete(false);
        resetPlayer();
    }


    const completeLevel = () => {
        setIsComplete(true);
    }

    function destroyPlatform(platform: Platform) {
        setCurrentLevel((prev) => ({
            ...prev,
            platforms: prev.platforms.filter((p) => p !== platform),
        }));
    }

    return {
        currentLevel,
        isComplete,
        setCurrentLevel,
        destroyPlatform,
        nextLevel,
        restartLevel,
        completeLevel
    }
}