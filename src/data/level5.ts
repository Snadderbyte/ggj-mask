import type { Level } from "../types/Level"

const level5Green: Level = {
  id: 5,
  name: "Green",
  playerStart: { x: 10, y: 10 },
  platforms: [
    // Boundry platforms
    // Top, Left, Right, Bottom
    { x: -50, y: -480, width: 2550, height: 500, breakable: false, invisible: false },
    { x: -50, y: 0, width: 70, height: 1500, breakable: false, invisible: false },
    { x: 2440, y: 0, width: 70, height: 1500, breakable: false, invisible: false },
    { x: -50, y: 1000, width: 400, height: 500, breakable: false, invisible: false },

    // Level platforms
    { x: 500, y: 850, width: 1500, height: 150, breakable: false, invisible: false },
    
    { x: 1000, y: 700, width: 500, height: 150, breakable: false, invisible: false },

    // Invisible platforms
    { x: 100, y: 400, width: 200, height: 20, breakable: false, invisible: true },
    { x: 350, y: 1200, width: 800, height: 20, breakable: false, invisible: true },
  ],
  goals: [
    {
      x: 450,
      y: 80,
      width: 30,
      height: 30,
      color1: 'green',
      color2: 'yellow',
      nextLevelId: 6
    }
  ],
  hazards: []
}

export default level5Green;