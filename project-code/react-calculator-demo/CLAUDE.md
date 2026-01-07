# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modern React calculator application built with Vite, featuring glassmorphism UI design, smooth animations with Framer Motion, and keyboard support. The calculator supports basic arithmetic operations with a visually appealing interface.

## Build & Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code with Biome
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Code Quality Tools

This project uses **Biome** (not ESLint) as the primary linter and formatter. Configuration is in `biome.json`:
- Indent: 2 spaces
- Line width: 100 characters
- Quote style: single quotes
- Semicolons: always
- Trailing commas: ES5 style

ESLint is configured but Biome takes precedence for formatting and most linting rules.

## Architecture

### Component Structure

The application has a simple, flat component hierarchy:
- `main.jsx` - Entry point, renders App in StrictMode
- `App.jsx` - Root component, renders Calculator
- `components/Calculator.jsx` - Main calculator component with all logic

### Calculator Component Design

The `Calculator` component is a self-contained component that manages all calculator state and logic:
- **State Management**: Uses React hooks (useState) for operands, operation, and completion state
- **Core Logic Functions**:
  - `appendNumber()` - Handles digit and decimal input
  - `chooseOperation()` - Sets operation and chains calculations
  - `compute()` - Performs arithmetic computation
  - `deleteNumber()` - Backspace functionality
  - `clear()` - Reset calculator state
- **Keyboard Support**: Global keyboard listener in useEffect handles number keys, operators, Enter, Backspace, and Escape
- **Display Formatting**: `getDisplayNumber()` formats numbers with thousands separators while preserving decimals

### Styling Approach

- **Global Styles**: `index.css` defines CSS custom properties (CSS variables) for theming and uses Google Fonts (Inter and Outfit)
- **Component Styles**: `Calculator.css` contains all calculator-specific styles
- **Design System**: Glassmorphism effect using backdrop-filter, gradient backgrounds, and rgba colors
- **No CSS-in-JS**: All styles are in separate CSS files, not inline or styled-components

### Animation Implementation

Framer Motion is used for:
- Initial component mount animation (fade-in with slide-up)
- Display value transitions when numbers change (AnimatePresence with slide effect)
- No animation libraries other than Framer Motion are used

### Key Libraries

- **framer-motion**: Animation library (v12.x) for smooth transitions
- **lucide-react**: Icon library for calculator buttons (Delete, RotateCcw, Equal, Plus, Minus, X, Divide)
- **React 19.x**: Using latest React features
- **Vite**: Build tool with HMR (Hot Module Replacement)

## Development Guidelines

### When Adding Features

- Keep Calculator component self-contained unless the feature requires breaking it apart
- Use existing patterns: callbacks with useCallback, state with useState
- Match existing animation style using Framer Motion
- Use lucide-react icons for any new UI elements

### Styling Conventions

- Define colors and theme values in `:root` CSS variables in `index.css`
- Follow the glassmorphism design pattern (backdrop-filter, transparent backgrounds with borders)
- Use consistent border-radius values (1rem for buttons, 1.5-2rem for containers)
- Maintain spacing using rem units

### State Management

Currently uses only React hooks. There is no Redux, Context API, or other state management library. Keep this pattern unless the app grows significantly more complex.
