import type { Level } from "../types/Level";
const level1Red: Level = {
  id: 1,
  name: "Red Tutorial",
  playerStart: { x: 700, y: 1400 },
  platforms: [
    // Boundry platforms
    // Top, Left, Right, Bottom
    { x: -50, y: -200, width: 4100, height: 200, breakable: false, invisible: false },
    { x: -50, y: 0, width: 70, height: 1500, breakable: false, invisible: false },
    { x: 2440, y: 0, width: 70, height: 1200, breakable: false, invisible: false },
    { x: -50, y: 1370, width: 3050, height: 100, breakable: false, invisible: false },

    
    { x: 3200, y: 1370, width: 700, height: 100, breakable: false, invisible: false },
    { x: 3830, y: 0, width: 70, height: 1400, breakable: false, invisible: false },

    // Level platforms
    { x: 0, y: 0, width: 500, height: 1190, breakable: false, invisible: false },

    { x: 1100, y: 770, width: 100, height: 500, breakable: false, invisible: false },
    { x: 1700, y: 770, width: 100, height: 600, breakable: false, invisible: false },


    // Jumps
    { x: 900, y: 1250, width: 200, height: 20, breakable: false, invisible: false },
    { x: 500, y: 1170, width: 200, height: 20, breakable: false, invisible: false },
    { x: 900, y: 1090, width: 200, height: 20, breakable: false, invisible: false },
    { x: 500, y: 1010, width: 200, height: 20, breakable: false, invisible: false },
    { x: 900, y: 930, width: 200, height: 20, breakable: false, invisible: false },
    { x: 500, y: 850, width: 200, height: 20, breakable: false, invisible: false },
    { x: 900, y: 770, width: 500, height: 20, breakable: false, invisible: false },

    
    { x: 2000, y: 770, width: 440, height: 20, breakable: false, invisible: false },

    // Breakable platforms
    { x: 1100, y: 570, width: 100, height: 200, breakable: true, invisible: false },
    { x: 1800, y: 770, width: 200, height: 20, breakable: true, invisible: false },
    { x: 3090, y: 1000, width: 20, height: 400, breakable: true, invisible: false },
  ],
  hazards: [

  ],
  goal:
    {
      x: 450,
      y: 80,
      width: 30,
      height: 30,
      color1: 'blue',
      nextLevelId: 2
    },
};

export default level1Red;