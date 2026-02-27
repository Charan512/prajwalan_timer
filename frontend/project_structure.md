# Project Structure

## Root Directory
- **README.md**: Project documentation and setup instructions.
- **package.json**: Project metadata, scripts, and dependencies.
- **vite.config.js**: Configuration for Vite build tool.
- **eslint.config.js**: Configuration for ESLint linting.
- **index.html**: Entry point HTML file.

## Source Directory (`src/`)
The core application code.

- **App.jsx**: Main application component, orchestrating the layout and child components.
- **App.css**: Styles specific to the App component.
- **main.jsx**: Application entry point where React is rendered into the DOM.
- **index.css**: Global styles for the application.

### Components (`src/components/`)
Reusable UI components.

- **AdminPanel.jsx / .css**: Component for administrative controls.
- **CountdownDisplay.jsx / .css**: Component responsible for displaying the countdown timer.
- **EndAnimation.jsx / .css**: Animation component displayed when the timer/event ends.
- **Particles.jsx / .css**: Component for rendering particle effects (likely for the background).
- **SpaceBackground.jsx / .css**: Main background component featuring a space theme.
- **StartAnimation.jsx / .css**: Animation component displayed on application startup.

### Context (`src/context/`)
React Context for global state management.

- **TimerContext.jsx**: Context provider managing the timer state and logic, accessible throughout the component tree.
