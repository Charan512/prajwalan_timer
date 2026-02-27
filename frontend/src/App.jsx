import { useState, useEffect } from 'react';
import { TimerProvider, useTimer } from './context/TimerContext';
import SpaceBackground from './components/SpaceBackground';
import CountdownDisplay from './components/CountdownDisplay';
import AdminPanel from './components/AdminPanel';
import StartAnimation from './components/StartAnimation';
import EndAnimation from './components/EndAnimation';
import './App.css';

function App() {
  return (
    <TimerProvider>
      <AppContent />
    </TimerProvider>
  );
}

function AppContent() {
  const { hasStarted, showStartAnimation, showEndAnimation, onStartAnimationComplete } = useTimer();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      // Base design resolution (e.g., 1536x864 - Standard Laptop)
      const baseWidth = 1536;
      const baseHeight = 864;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculate scale to fit the viewport while maintaining aspect ratio
      const scaleX = windowWidth / baseWidth;
      const scaleY = windowHeight / baseHeight;

      // Use the smaller scale to ensure content fits within the viewport
      const newScale = Math.min(scaleX, scaleY);

      setScale(newScale);
    };

    handleResize(); // Initial calculation
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app">
      {/* Background Section - Unscaled */}
      <SpaceBackground hasStarted={hasStarted} />

      {/* Start Animation Overlay */}
      {showStartAnimation && <StartAnimation onComplete={onStartAnimationComplete} />}

      {/* End Animation Overlay */}
      <EndAnimation show={showEndAnimation} />

      {/* Content Section - Scaled */}
      <div
        className="scale-wrapper"
        style={{
          transform: `scale(${scale})`,
          width: '1536px',
          height: '864px'
        }}
      >
        <div className={`container ${hasStarted ? 'started' : ''}`}>
          {/* Header with Logo */}
          <header className="header">
            <div className="logo-container">
              <div className="logo-glow"></div>
              <h1 className="logo-text">Prajwalan 2k26</h1>
            </div>
            <p className="tagline">24-Hour Innovation Challenge</p>
          </header>

          {/* Countdown Timer Display */}
          <CountdownDisplay />

          {/* Footer */}
          <footer className="footer">
          </footer>
        </div>
      </div>

      {/* Admin Panel */}
      <AdminPanel />
    </div>
  );
}

export default App;
