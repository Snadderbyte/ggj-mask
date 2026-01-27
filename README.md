---
title: ggj-mask
---

# ggj-mask

## Roles

## About

This repo is a submission for GGJ 2026; Mask.

## Core Concept

Player have different _masks_ available. A _mask_ changes how the player interacts with the world, but the masks never give the player extra power.

> Masks do not change the world, just how it is perceived. A mask changes how the world treats you, not who you are.

_For example a mask can reduce gravity and let the player character float longer._

Graphics is simple and geometry based with random color palette. No texture-packs.

Masks are different shapes. 




Player can choose what mask to start with, and they have one extra mask slot. They can pick up other masks into the extra mask slot and switch between the two masks.

Or? 

Player have 3 different masks. They need to traverse the map with these masks. Add AI that will stop the player unless they "fit" the same masks/pattern. Better for procedural map generation. 

### Mask ideas

- Mask that allows dashing
- Mask that changes gravity
- Double jump
- Destroy terrain
- Reflects projectiles
- 

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
