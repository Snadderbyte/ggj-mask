import { useState } from "react";
import type { Level } from "../types/Level";
import levels from "../data/levels";


export function useLevelManagerHook() {
    const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return {
        currentLevel,
        setCurrentLevel,
        isLoading,
        setIsLoading
    }
}