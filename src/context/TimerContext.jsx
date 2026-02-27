import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TimerContext = createContext(null);

const TOTAL_DURATION_SECONDS = 86400; // 24 hours (24 * 60 * 60)
const STORAGE_KEY = 'prajwalan2k26_react_timer';

export function TimerProvider({ children }) {
    const [remainingSeconds, setRemainingSeconds] = useState(TOTAL_DURATION_SECONDS);
    const [isRunning, setIsRunning] = useState(false); // Start paused
    const [hasStarted, setHasStarted] = useState(false); // Track if timer has ever been started
    const [startTimestamp, setStartTimestamp] = useState(null);
    const [showStartAnimation, setShowStartAnimation] = useState(false);
    const [showEndAnimation, setShowEndAnimation] = useState(false);

    // Clear any existing saved state on mount to always start fresh
    useEffect(() => {
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    // Save state periodically - DISABLED to prevent auto-restart on reload
    // useEffect(() => {
    //     const saveState = () => {
    //         localStorage.setItem(STORAGE_KEY, JSON.stringify({
    //             timestamp: Date.now(),
    //             remaining: remainingSeconds,
    //             running: isRunning,
    //             started: hasStarted
    //         }));
    //     };
    //     saveState();
    //     const interval = setInterval(saveState, 10000);
    //     return () => clearInterval(interval);
    // }, [remainingSeconds, isRunning, hasStarted]);

    // Countdown logic
    useEffect(() => {
        if (!isRunning || remainingSeconds <= 0) {
            if (remainingSeconds === 0 && hasStarted) {
                setShowEndAnimation(true);
            }
            return;
        }

        const interval = setInterval(() => {
            setRemainingSeconds(prev => {
                const newValue = Math.max(0, prev - 1);
                if (newValue === 0) {
                    setShowEndAnimation(true);
                }
                return newValue;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, remainingSeconds, hasStarted]);

    // Timer controls
    const start = useCallback(() => {
        setShowStartAnimation(true);
    }, []);

    const onStartAnimationComplete = useCallback(() => {
        setShowStartAnimation(false);
        setHasStarted(true);
        setIsRunning(true);
        if (!startTimestamp) {
            setStartTimestamp(Date.now());
        }
    }, [startTimestamp]);

    const pause = useCallback(() => setIsRunning(false), []);
    const toggle = useCallback(() => setIsRunning(prev => !prev), []);

    const reset = useCallback(() => {
        setRemainingSeconds(TOTAL_DURATION_SECONDS);
        setIsRunning(false);
        setHasStarted(false);
        setStartTimestamp(null);
        setShowStartAnimation(false);
        setShowEndAnimation(false);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const setTime = useCallback((hours, minutes, seconds) => {
        const total = (hours * 3600) + (minutes * 60) + seconds;
        // Allow setting any reasonable time (up to 99 hours for flexibility)
        const maxAllowedSeconds = 99 * 3600; // 99 hours max
        setRemainingSeconds(Math.max(0, Math.min(maxAllowedSeconds, total)));
    }, []);

    const skipForward = useCallback((seconds = 3600) => {
        setRemainingSeconds(prev => Math.max(0, prev - seconds));
    }, []);

    const skipBackward = useCallback((seconds = 3600) => {
        const maxAllowedSeconds = 99 * 3600; // 99 hours max
        setRemainingSeconds(prev => Math.min(maxAllowedSeconds, prev + seconds));
    }, []);

    const progress = 1 - (remainingSeconds / TOTAL_DURATION_SECONDS);
    const percentage = ((TOTAL_DURATION_SECONDS - remainingSeconds) / TOTAL_DURATION_SECONDS) * 100;

    const value = {
        remainingSeconds,
        isRunning,
        hasStarted,
        progress,
        percentage,
        totalDuration: TOTAL_DURATION_SECONDS,
        showStartAnimation,
        showEndAnimation,
        start,
        pause,
        toggle,
        reset,
        setTime,
        skipForward,
        skipBackward,
        onStartAnimationComplete,
    };

    return (
        <TimerContext.Provider value={value}>
            {children}
        </TimerContext.Provider>
    );
}

export function useTimer() {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error('useTimer must be used within a TimerProvider');
    }
    return context;
}
