import type { Level } from "../types/Level"

const level3Green: Level = {
  id: 3,
  name: "Red & Blue",
  playerStart: { x: 10, y: 10 },
  platforms: [
    // Boundry platforms
    // Top, Left, Right, Bottom
    { x: -50, y: -200, width: 2550, height: 200, breakable: false, invisible: false },
    { x: -50, y: 0, width: 70, height: 1500, breakable: false, invisible: false },
    { x: 2440, y: 0, width: 70, height: 1500, breakable: false, invisible: false },

    { x: 20, y: 1000, width: 380, height: 400, breakable: false, invisible: false },
    { x: 600, y: 1000, width: 800, height: 100, breakable: false, invisible: false },

    { x: 600, y: 1000, width: 100, height: 400, breakable: false, invisible: false },
    { x: 700, y: 1380, width: 100, height: 20, breakable: false, invisible: false },
    { x: 1500, y: 1380, width: 940, height: 200, breakable: false, invisible: false },


    { x: 1500, y: 700, width: 100, height: 660, breakable: false, invisible: false },
    { x: 1760, y: 700, width: 100, height: 630, breakable: false, invisible: false },

    { x: 20, y: 500, width: 380, height: 100, breakable: false, invisible: false },
    { x: 600, y: 450, width: 600, height: 70, breakable: false, invisible: false },
    { x: 800, y: 280, width: 300, height: 70, breakable: false, invisible: false },
    { x: 1200, y: 0, width: 1240, height: 520, breakable: false, invisible: false },
    { x: 800, y: 600, width: 100, height: 400, breakable: false, invisible: false },
    { x: 600, y: 450, width: 100, height: 300, breakable: false, invisible: false },

    // Breakable platforms in order of progression
    { x: 400, y: 500, width: 200, height: 20, breakable: true, invisible: false },

    { x: 800, y: 350, width: 20, height: 100, breakable: true, invisible: false },

    { x: 1100, y: 280, width: 100, height: 20, breakable: true, invisible: false },

    { x: 400, y: 1000, width: 200, height: 20, breakable: true, invisible: false },

    { x: 1530, y: 520, width: 40, height: 180, breakable: true, invisible: false },
  ],
  interactables: [
    {
      boxes: [
        { x: 830, y: 350, width: 100, height: 100 }
      ]
    },
    {
      boxes: [
        { x: 1400, y: 1360, width: 600, height: 20 }
      ]
    }
  ],
  goals: [
    {
      x: 450,
      y: 80,
      width: 30,
      height: 30,
      color1: 'yellow',
      color2: 'blue',
      nextLevelId: 4
    }
  ],
  hazards: []
}

export default level3Green;