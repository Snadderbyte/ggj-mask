---
title: ggj-mask
---

# ggj-mask

Pixi.js: https://pixijs.com/8.x/guides/concepts/architecture
Pixi.js api: https://pixijs.download/release/docs/index.html
PixiReact: https://github.com/pixijs/pixi-react/blob/main/README.md#--pixireact

## About

This repo is a submission for GGJ 2026; Mask.

## Tree
```c
src/
  components/
    Game.tsx              // Top-level, manages current level
    GameScene.tsx         // Renders active level
    Player.tsx            // Existing player
    Platform.tsx          // NEW: Reusable platform component
    Goal.tsx              // NEW: Level completion trigger
    Hazard/               // Hazards: Laser, spikes, m.m.
      Laser.tsx           // NEW: Laser
    Box.tsx               // NEW: Movable object
  data/
    level1.ts
    level2.ts
    ...                   // Level configurations
  types/
    Level.ts              // Level interfaces
  hooks/
    useLevelManager.ts    // Level state management    
```

## Core Concept

### If we have enough time?

- Main menu
- Score system

### Ideas

Later in levels you can fuse masks. When you fuse for the last time the mask is destroyed.

Player have different _masks_ available. A _mask_ changes how the player interacts with the world, but the masks never give the player extra power.

> A mask changes how the world treats you, not who you are.

_For example a mask can reduce gravity and let the player character float longer._

Graphics is simple and geometry based with random color palette. No texture-packs.

Masks are different shapes. 

Player can choose what mask to start with, and they have one extra mask slot. They can pick up other masks into the extra mask slot and switch between the two masks.

Or? 

Player have 3 different masks. They need to traverse the map with these masks. Add AI that will stop the player unless they "fit" the same masks/pattern. Better for procedural map generation. 

### Level Ideas

- Level 1 Red
- Level 2 Blue
- Level 3 Red + Blue
- Level 4 Yellow (small)
- Level 5 Green (small)
- Level 6 Red + Blue + Green + Yellow
- Level 7/9 Fuse one (...Orange?)
- Level 8A Orange + Green + Blue (2 are fused to one mask)
- Level 8B Cyan + Red + Yellow
- Level 9/7 Fuse Remaining (...Cyan?)
- Level 10 SUPREME ULTIMATE CHALLENGE !!!!!!!
- Level 11 ULTRA SUPREME ULTIMATE CHALLENGE !!!!!!!
- Level 12 White (all masks are destroyed revealing a white face. _The eyes were not eyes all along_)

### Level Development Requirements
- Collidable box that triggers mask pickup
- Lasers (Fixed, laser points in a direction, stops at first wall)
- Invisible platforms (For green mask)
- Breakable platform/wall (For red mask)
- Pits of death (spikes, etc, fall in you die (or die off-screen))
- Level end trigger (Collide with it to progress to the next level; useLevelManager hook)

### Mask ideas

Masks are accosiated with with feelings

Red -> Anger: Destroy wall

Yellow -> Shy: Disable hazards continously while in its range. When placed on ground, it maintains its aura.

Blue -> Sadness, Cleanlyness, Wisdom: Allows moving selective objects.

Green -> Stability, other feeling : Allow the player to collide with invisible platforms.

Red + Yellow = Orange -> Destroy walls, and remove hazards

Blue + Green = Cyan -> Move objects and Collide with invisible platform. Move invisible objects?

### Styling

Masks are a single color

start with mono

Randomize primary use contrast-color for secondary?

### Gameplay Loop?

1. Enter a self-contained puzzle room
2. Observe geometry and hazards
3. Select starting mask
4. Find other masks
5. Reach the exit as fast as possible

### Maps/rooms

_Procedural generation?_

### Multiplayer

Could be multiplayer with players competing to finish the game faster?

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
