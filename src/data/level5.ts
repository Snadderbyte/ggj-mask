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
    { x: -50, y: 1000, width: 2550, height: 500, breakable: false, invisible: false },
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