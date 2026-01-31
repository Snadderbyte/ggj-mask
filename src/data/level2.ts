import type { Level } from "../types/Level"

const level2Yellow: Level = {
  id: 2,
  name: "Blue",
  playerStart: { x: 150, y: 1300 },
  platforms: [
    // Boundry platforms
    // Top, Left, Right, Bottom
    { x: -50, y: -200, width: 2550, height: 200, breakable: false, invisible: false },
    { x: -50, y: 0, width: 70, height: 1500, breakable: false, invisible: false },
    { x: 2440, y: 0, width: 70, height: 1500, breakable: false, invisible: false },
    { x: -50, y: 1370, width: 2550, height: 100, breakable: false, invisible: false },
    // Level platforms
    { x: 900, y: 970, width: 200, height: 400, breakable: false, invisible: false },
    { x: 950, y: 770, width: 150, height: 20, breakable: false, invisible: false },
    { x: 1400, y: 770, width: 200, height: 20, breakable: false, invisible: false },
    { x: 1490, y: 680, width: 1000, height: 200, breakable: false, invisible: false },
    { x: 2290, y: 0, width: 200, height: 870, breakable: false, invisible: false },


    { x: 1800, y: 970, width: 200, height: 400, breakable: false, invisible: false },
    { x: 1800, y: 400, width: 200, height: 20, breakable: false, invisible: false },
    { x: 1400, y: 300, width: 20, height: 200, breakable: false, invisible: false },

    // Interacble platforms
    { x: 900, y: 400, width: 300, height: 20, breakable: false, invisible: false },
    { x: 1000, y: 380, width: 20, height: 20, breakable: false, invisible: false },
  ],
  interactables: [
    {
      boxes: [
        { x: 600, y: 1270, width: 100, height: 100 }
      ]
    },
    {
      boxes: [
        { x: 1020, y: 300, width: 100, height: 100, }
      ]
    },
  ],
  goals: [
    {
      x: 450,
      y: 80,
      width: 30,
      height: 30,
      color1: 'red',
      color2: 'blue',
      nextLevelId: 3
    }
  ],
  hazards: []
}

export default level2Yellow;