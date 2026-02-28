import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

const TimerContext = createContext(null);

const TOTAL_DURATION_SECONDS = 86400; // 24 hours (24 * 60 * 60)

const socket = io(import.meta.env.VITE_TIMER_SOCKET_URL || 'http://localhost:4000', {
    transports: ['websocket', 'polling'], // Explicitly fall back to polling if websocket fails (fixes Render proxy issues)
    reconnection: true,             // Aggressively reconnect on drops
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 60000,                 // Match backend ping timeout
    autoConnect: true
});

export function TimerProvider({ children }) {
    const [stateObj, setStateObj] = useState({
        duration: TOTAL_DURATION_SECONDS,
        isRunning: false,
        hasStarted: false,
        startedAt: null,
        remainingSeconds: TOTAL_DURATION_SECONDS,
    });

    const [showStartAnimation, setShowStartAnimation] = useState(false);
    const [showEndAnimation, setShowEndAnimation] = useState(false);

    // Sync from the server
    useEffect(() => {
        socket.on('SYNC_STATE', (state) => {
            setStateObj({
                duration: state.duration,
                isRunning: state.isRunning,
                hasStarted: state.hasStarted,
                startedAt: state.startedAt,
                remainingSeconds: state.remaining
            });

            if (state.remaining === 0 && state.hasStarted) {
                setShowEndAnimation(true);
            } else if (state.remaining > 0) {
                setShowEndAnimation(false);
            }
        });

        return () => {
            socket.off('SYNC_STATE');
        };
    }, []);

    // Local precise countdown logic
    useEffect(() => {
        if (!stateObj.isRunning || !stateObj.startedAt) return;

        const interval = setInterval(() => {
            setStateObj(prev => {
                const elapsed = Math.floor((Date.now() - prev.startedAt) / 1000);
                const newValue = Math.max(0, prev.duration - elapsed);
                if (newValue === 0) {
                    setShowEndAnimation(true);
                }
                return { ...prev, remainingSeconds: newValue };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [stateObj.isRunning, stateObj.startedAt]);

    // UI actions that trigger server events
    const start = useCallback(() => {
        setShowStartAnimation(true);
    }, []);

    const onStartAnimationComplete = useCallback(() => {
        setShowStartAnimation(false);
        socket.emit('START');
    }, []);

    const pause = useCallback(() => socket.emit('PAUSE'), []);
    const toggle = useCallback(() => socket.emit('TOGGLE'), []);

    const reset = useCallback(() => {
        socket.emit('RESET');
        setShowStartAnimation(false);
        setShowEndAnimation(false);
    }, []);

    const setTime = useCallback((hours, minutes, seconds) => {
        socket.emit('SET_TIME', { hours, minutes, seconds });
    }, []);

    const skipForward = useCallback((seconds = 3600) => {
        socket.emit('SKIP_FORWARD', { seconds });
    }, []);

    const skipBackward = useCallback((seconds = 3600) => {
        socket.emit('SKIP_BACKWARD', { seconds });
    }, []);

    const progress = 1 - (stateObj.remainingSeconds / TOTAL_DURATION_SECONDS);
    const percentage = ((TOTAL_DURATION_SECONDS - stateObj.remainingSeconds) / TOTAL_DURATION_SECONDS) * 100;

    const value = {
        remainingSeconds: stateObj.remainingSeconds,
        isRunning: stateObj.isRunning,
        hasStarted: stateObj.hasStarted,
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
