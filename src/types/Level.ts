export interface Platform {
    x: number;
    y: number;
    width: number;
    height: number;
    breakable: boolean;
    invisible: boolean; 
}

export interface InteractableBox  {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Interactable {
    boxes: InteractableBox[];
}

export interface Hazard {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Goal {
  x: number;
  y: number;
  width: number;
  height: number;
  requiredMasks?: string[];
  nextLevelId?: number; 
  color1?: string;
  color2?: string;
}

export interface Level {
    id: number;
    name: string;
    playerStart: { x: number; y: number };
    platforms: Platform[];
    goals: Goal[];
    hazards?: Hazard[];
    interactables?: Interactable[];
}