import { useState } from "react";
import type { Level } from "../types/Level";


export function useLevelManagerHook(levels: Level[]) {
    const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    return {
        currentLevel,
        setCurrentLevel,
        isLoading,
        setIsLoading
    }
}