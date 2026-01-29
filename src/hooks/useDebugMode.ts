import { useEffect, useState } from "react";

/// Debug hook - toggle with 'P' key
export function useDebugMode() {
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code == 'KeyP') setDebugMode((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return debugMode;
}