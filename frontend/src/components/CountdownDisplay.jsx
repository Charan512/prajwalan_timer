import { useState } from 'react';
import { useTimer } from '../context/TimerContext';
import './CountdownDisplay.css';

function padZero(num) {
    return num.toString().padStart(2, '0');
}

export default function CountdownDisplay() {
    const { remainingSeconds, isRunning, hasStarted, start, totalDuration, percentage } = useTimer();

    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    const progressPercentage = (remainingSeconds / totalDuration) * 100;
    const isComplete = remainingSeconds <= 0;

    // Status message based on time remaining
    const getStatusMessage = () => {
        const hoursRemaining = remainingSeconds / 3600;
        if (isComplete) return '🎉 Time\'s Up! Great work everyone! 🎉';
        if (!hasStarted) return 'Ready to ignite the innovation!';
        if (!isRunning) return 'Timer Paused';
        if (hoursRemaining > 22) return 'Prajwalan Ignited! Let the innovation begin!';
        if (hoursRemaining > 18) return 'Great start! Keep brainstorming those ideas!';
        if (hoursRemaining > 12) return 'Keep going! Stay focused and energized!';
        if (hoursRemaining > 6) return 'In the zone! Your project is taking shape!';
        if (hoursRemaining > 3) return 'Sprint mode! Time to polish your work!';
        if (hoursRemaining > 1) return 'Final hours! Get ready to present!';
        if (hoursRemaining > 0.5) return 'Last 30 minutes! Wrap up your code!';
        return '';
    };

    const isLast10Seconds = remainingSeconds <= 10 && remainingSeconds > 0 && hasStarted;
    const isLast5Seconds = remainingSeconds <= 5 && remainingSeconds > 0 && hasStarted;

    return (
        <div className={`countdown-container ${isComplete ? 'ended' : ''}`}>
            <div className="countdown-label">TIME REMAINING</div>
            <div className="countdown">
                <div className="time-block">
                    <span className="time-value">{padZero(hours)}</span>
                    <span className="time-unit">HOURS</span>
                </div>
                <span className="time-separator">:</span>
                <div className="time-block">
                    <span className="time-value">{padZero(minutes)}</span>
                    <span className="time-unit">MINUTES</span>
                </div>
                <span className="time-separator">:</span>
                <div className={`time-block ${isLast10Seconds ? (isLast5Seconds ? 'critical-block-red' : 'critical-block') : ''}`}>
                    <span
                        key={isLast10Seconds ? seconds : 'static'}
                        className={`time-value ${isLast10Seconds ? (isLast5Seconds ? 'pop-animate-red' : 'pop-animate') : ''}`}
                    >
                        {padZero(seconds)}
                    </span>
                    <span className="time-unit">SECONDS</span>
                </div>
            </div>
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>

            {/* Percentage Display */}


            {/* Start Button - animate out instead of unmounting */}
            <button
                className={`start-button ${hasStarted ? 'hidden' : ''}`}
                onClick={!hasStarted ? start : undefined}
                disabled={hasStarted}
            >
                IGNITE PRAJWALAN
            </button>

            <div className="status-container">
                <p className="status-message">{getStatusMessage()}</p>
            </div>
        </div>
    );
}
