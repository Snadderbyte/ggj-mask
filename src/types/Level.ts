import type { Graphics } from "pixi.js";



export interface Platform {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Level {
    id: number;
    name: string;
    width: number;
    height: number;
    backgroundColor: Graphics;
    playerStart: { x: number; y: number };
    platforms: Platform[];
}