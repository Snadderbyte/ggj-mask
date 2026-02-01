import type { Level } from "../types/Level"

const level6All: Level = {
  id: 6,
  name: "All",
  playerStart: { x: 10, y: 10 },
  platforms: [
    // Boundry platforms
    // Top, Left, Right, Bottom
    { x: -50, y: -480, width: 2550, height: 500, breakable: false, invisible: false },
    { x: -50, y: 0, width: 70, height: 1500, breakable: false, invisible: false },
    { x: 2440, y: 0, width: 70, height: 1500, breakable: false, invisible: false },
    { x: -50, y: 1000, width: 2550, height: 500, breakable: false, invisible: false },
  ],
  goal: {
    x: 450,
    y: 80,
    width: 30,
    height: 30,
    color1: 'orange',
    nextLevelId: 7
  },
  hazards: []
}

export default level6All;