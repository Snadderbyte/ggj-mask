export interface Platform {
    x: number;
    y: number;
    width: number;
    height: number;
    breakable: boolean;
    invisible: boolean; 
}

export interface Interactable  {
    x: number;
    y: number;
    width: number;
    height: number;
    onInteract?: () => void;
}

export interface Hazard {
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'spike' | 'laser' | 'gravityBeam' ;
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
}