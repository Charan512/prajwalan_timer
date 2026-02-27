import { useState, useEffect } from 'react';
import { useTimer } from '../context/TimerContext';
import './AdminPanel.css';

export default function AdminPanel() {
    const [isVisible, setIsVisible] = useState(false);
    const [hours, setHours] = useState(24);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const {
        remainingSeconds,
        isRunning,
        toggle,
        reset,
        setTime,
        skipForward,
        skipBackward
    } = useTimer();

    // Keyboard shortcut: Ctrl+Shift+A to toggle panel
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                setIsVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Update input fields when timer changes
    useEffect(() => {
        setHours(Math.floor(remainingSeconds / 3600));
        setMinutes(Math.floor((remainingSeconds % 3600) / 60));
        setSeconds(remainingSeconds % 60);
    }, [remainingSeconds]);

    const handleSetTime = () => {
        setTime(
            parseInt(hours) || 0,
            parseInt(minutes) || 0,
            parseInt(seconds) || 0
        );
    };

    if (!isVisible) {
        return (
            <button
                className="admin-toggle-btn"
                onClick={() => setIsVisible(true)}
                title="Open Admin Panel (Ctrl+Shift+A)"
            >
                ⚙️
            </button>
        );
    }

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h3>🎛️ Admin Panel</h3>
                <button
                    className="close-btn"
                    onClick={() => setIsVisible(false)}
                >
                    ✕
                </button>
            </div>

            <div className="admin-section">
                <h4>Playback Controls</h4>
                <div className="control-row">
                    <button
                        className={`control-btn ${isRunning ? 'pause' : 'play'}`}
                        onClick={toggle}
                    >
                        {isRunning ? '⏸️ Pause' : '▶️ Start'}
                    </button>
                    <button
                        className="control-btn reset"
                        onClick={reset}
                    >
                        🔄 Reset
                    </button>
                </div>
            </div>

            <div className="admin-section">
                <h4>Skip Time</h4>
                <div className="control-row">
                    <button
                        className="control-btn skip"
                        onClick={() => skipBackward(3600)}
                    >
                        ⏪ -1 Hour
                    </button>
                    <button
                        className="control-btn skip"
                        onClick={() => skipForward(3600)}
                    >
                        ⏩ +1 Hour
                    </button>
                </div>
                <div className="control-row">
                    <button
                        className="control-btn skip small"
                        onClick={() => skipBackward(600)}
                    >
                        -10 Min
                    </button>
                    <button
                        className="control-btn skip small"
                        onClick={() => skipForward(600)}
                    >
                        +10 Min
                    </button>
                </div>
            </div>

            <div className="admin-section">
                <h4>Set Custom Time</h4>
                <div className="time-inputs">
                    <div className="time-input-group">
                        <label>Hours</label>
                        <input
                            type="number"
                            min="0"
                            max="99"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                        />
                    </div>
                    <span className="input-separator">:</span>
                    <div className="time-input-group">
                        <label>Min</label>
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value)}
                        />
                    </div>
                    <span className="input-separator">:</span>
                    <div className="time-input-group">
                        <label>Sec</label>
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={seconds}
                            onChange={(e) => setSeconds(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    className="control-btn apply"
                    onClick={handleSetTime}
                >
                    ✓ Apply Time
                </button>
            </div>

            <div className="admin-footer">
                <small>Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd> to toggle</small>
            </div>
        </div>
    );
}
