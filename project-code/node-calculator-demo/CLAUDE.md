# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A simple calculator web application built with Node.js and Express. The application serves a single-page calculator interface with client-side JavaScript handling all calculation logic.

## Development Commands

```bash
# Install dependencies
npm install

# Start the development server
npm start
# or
npm run dev

# Server runs on http://localhost:3000
```

## Architecture

### Server Layer (server.js:1-18)
- Express server serving static files from the `public/` directory
- Single route handler for the root path serving index.html
- No API endpoints - all computation happens client-side
- Port configured to 3000

### Client Layer (public/)
- **index.html**: Static HTML structure for calculator interface
  - Display section shows previous operand and current operand
  - Grid layout with buttons for digits (0-9), operations (+, -, *, /), clear (AC), delete (DEL), and equals
  - Inline onclick handlers calling calculator instance methods

- **calculator.js**: Calculator class with state management
  - Constructor initializes state: currentOperand, previousOperand, operation
  - Core methods:
    - `appendNumber()`: Handles digit and decimal input with validation
    - `chooseOperation()`: Sets operation and moves current to previous operand
    - `compute()`: Performs arithmetic, handles division by zero
    - `clear()` and `delete()`: Reset and backspace functionality
    - `updateDisplay()`: Updates DOM with formatted numbers
    - `getDisplayNumber()`: Formats numbers with locale-specific separators
  - Global instance created at line 118: `const calculator = new Calculator()`
  - Keyboard event listener (121-135) maps keys to calculator methods

- **style.css**: Glassmorphism UI design
  - Purple gradient background
  - Semi-transparent calculator with backdrop blur
  - Grid layout for buttons (4 columns)
  - Color-coded buttons: red (clear), orange (delete), blue (operators), green (equals)
  - Responsive breakpoint at 480px

### Key Design Patterns
- **Stateful calculator class**: All state (operands, operation) maintained in a single JavaScript class instance
- **Direct DOM manipulation**: updateDisplay() directly queries and updates DOM elements by ID
- **Client-side only**: No server-side computation or data persistence
- **Inline event handlers**: HTML uses onclick attributes rather than addEventListener
- **Operation chaining**: Choosing a new operation triggers computation of the previous operation
