import type { Level } from "../types/Level";

const level0: Level = {
  id: 0,
  name: "Starting Level",
  playerStart: { x: 100, y: 1000 },
  platforms: [
    // Boundry platforms
    // Top, Left, Right, Bottom
    { x: -50, y: -480, width: 2550, height: 500, breakable: false, invisible: false },
    { x: -50, y: 0, width: 70, height: 1500, breakable: false, invisible: false },
    { x: 2440, y: 0, width: 70, height: 1500, breakable: false, invisible: false },
    { x: -50, y: 1000, width: 2550, height: 500, breakable: false, invisible: false },

    // Level platforms

    { x: 1000, y: 900, width: 200, height: 20, breakable: false, invisible: false },
    { x: 1200, y: 800, width: 20, height: 200, breakable: false, invisible: false },
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

export default level0;