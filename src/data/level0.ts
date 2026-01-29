import type { Level } from "../types/Level";
const level0Start: Level = {
  id: 0,
  name: "Red Tutorial",
  playerStart: { x: 10, y: 10 },
  platforms: [
    { x: -400, y: 300, width: 1200, height: 40, breakable: false, invisible: false },
    { x: 200, y: 220, width: 140, height: 20, breakable: false, invisible: false },
    { x: -150, y: 180, width: 120, height: 20, breakable: false, invisible: false },
    { x: 420, y: 140, width: 120, height: 20, breakable: false, invisible: false },
    { x: 400, y: 100, width: 20, height: 240, breakable: false, invisible: false },
  ],
  goals: [
    {
      x: 450,
      y: 80,
      width: 30,
      height: 30,
      color1: 'red',
      nextLevelId: 1
    }
  ],
  hazards: []
};

export default level0Start;