import type { Level } from "../types/Level"

const level4Yellow: Level = {
  id: 4,
  name: "Yellow",
  playerStart: { x: 10, y: 10 },
  platforms: [
    // Boundry platforms
    // Top, Left, Right, Bottom
    { x: -50, y: -200, width: 2550, height: 200, breakable: false, invisible: false },
    { x: -50, y: 0, width: 70, height: 200, breakable: false, invisible: false },
    { x: 2440, y: 0, width: 70, height: 1500, breakable: false, invisible: false },

    { x: -50, y: 200, width: 200, height: 1500, breakable: false, invisible: false },
    { x: 750, y: 200, width: 400, height: 50, breakable: false, invisible: false },

    { x: 400, y: 500, width: 1200, height: 50, breakable: false, invisible: false },
    { x: 150, y: 850, width: 1200, height: 50, breakable: false, invisible: false },
    { x: 150, y: 1200, width: 1400, height: 150, breakable: false, invisible: false },


    { x: 1600, y: 200, width: 840, height: 350, breakable: false, invisible: false },

    { x: 1800, y: 550, width: 640, height: 800, breakable: false, invisible: false },
    { x: 1550, y: 850, width: 250, height: 500, breakable: false, invisible: false },

    // Pedestal for yellow mask
    { x: 280, y: 1150, width: 200, height: 50, breakable: false, invisible: false },

    // Breakable platforms in order of progression
    { x: 1350, y: 850, width: 200, height: 20, breakable: true, invisible: false },
  ],
  interactables: [
    {
      boxes: [
        { x: 400, y: 550, width: 200, height: 50 },
        { x: 550, y: 600, width: 50, height: 250 }
      ]
    }
  ],
  goal: {
    x: 450,
    y: 80,
    width: 50,
    height: 70,
    color1: 'green',
    nextLevelId: 5
  },
  hazards: [
    { x: 150, y: 200, width: 600, height: 50 },
    { x: 600, y: 550, width: 50, height: 300 },
    { x: 800, y: 550, width: 50, height: 300 },
    { x: 1000, y: 550, width: 50, height: 300 },

    { x: 600, y: 900, width: 50, height: 300 },

    { x: 1800, y: 0, width: 50, height: 200 },
  ]
}

export default level4Yellow;