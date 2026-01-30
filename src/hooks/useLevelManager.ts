import { useState } from "react";
import type { Platform } from "../types/Level";
import type { Level } from "../types/Level";


export function useLevelManagerHook(levels: Level[]) {
    const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function destroyPlatform(platform: Platform) {
        setCurrentLevel((prev) => ({
            ...prev,
            platforms: prev.platforms.filter((p) => p !== platform),
        }));
    }
    
    return {
        currentLevel,
        setCurrentLevel,
        isLoading,
        setIsLoading,
        destroyPlatform
    }
}