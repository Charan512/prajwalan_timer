const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const TOTAL_DURATION_SECONDS = 86400; // 24 hours

// In-memory state
let state = {
    duration: TOTAL_DURATION_SECONDS, // Currently remaining seconds
    totalDuration: TOTAL_DURATION_SECONDS,
    isRunning: false,
    startedAt: null, // timestamp when it was started (or resumed)
    hasStarted: false,
};

// Calculate exact remaining time based on current timestamp
const calculateRemaining = () => {
    if (!state.isRunning || !state.startedAt) {
        return state.duration;
    }
    const elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
    return Math.max(0, state.duration - elapsed);
};

// Stop timer if it reached zero
const checkCompletion = () => {
    if (state.isRunning && calculateRemaining() === 0) {
        state.duration = 0;
        state.isRunning = false;
        state.startedAt = null;
    }
};

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send current state to newly connected client
    checkCompletion();
    socket.emit('SYNC_STATE', {
        ...state,
        remaining: calculateRemaining()
    });

    socket.on('START', () => {
        if (!state.isRunning && calculateRemaining() > 0) {
            state.isRunning = true;
            state.hasStarted = true;
            state.startedAt = Date.now();
            io.emit('SYNC_STATE', {
                ...state,
                remaining: calculateRemaining()
            });
        }
    });

    socket.on('PAUSE', () => {
        if (state.isRunning) {
            state.duration = calculateRemaining();
            state.isRunning = false;
            state.startedAt = null;
            io.emit('SYNC_STATE', {
                ...state,
                remaining: state.duration
            });
        }
    });

    socket.on('TOGGLE', () => {
        if (state.isRunning) {
            state.duration = calculateRemaining();
            state.isRunning = false;
            state.startedAt = null;
        } else if (calculateRemaining() > 0) {
            state.isRunning = true;
            state.hasStarted = true;
            state.startedAt = Date.now();
        }
        io.emit('SYNC_STATE', {
            ...state,
            remaining: calculateRemaining()
        });
    });

    socket.on('RESET', () => {
        state.duration = TOTAL_DURATION_SECONDS;
        state.isRunning = false;
        state.hasStarted = false;
        state.startedAt = null;
        io.emit('SYNC_STATE', {
            ...state,
            remaining: state.duration
        });
    });

    socket.on('SET_TIME', ({ hours, minutes, seconds }) => {
        const total = (hours * 3600) + (minutes * 60) + seconds;
        const maxAllowedSeconds = 99 * 3600;
        state.duration = Math.max(0, Math.min(maxAllowedSeconds, total));

        if (state.isRunning) {
            state.startedAt = Date.now(); // reset the start point from now
        }
        io.emit('SYNC_STATE', {
            ...state,
            remaining: calculateRemaining()
        });
    });

    socket.on('SKIP_FORWARD', ({ seconds }) => {
        const currentRemaining = calculateRemaining();
        state.duration = Math.max(0, currentRemaining - seconds);
        if (state.isRunning) {
            state.startedAt = Date.now();
        }
        checkCompletion();
        io.emit('SYNC_STATE', {
            ...state,
            remaining: calculateRemaining()
        });
    });

    socket.on('SKIP_BACKWARD', ({ seconds }) => {
        const currentRemaining = calculateRemaining();
        const maxAllowedSeconds = 99 * 3600;
        state.duration = Math.min(maxAllowedSeconds, currentRemaining + seconds);
        if (state.isRunning) {
            state.startedAt = Date.now();
        }
        io.emit('SYNC_STATE', {
            ...state,
            remaining: calculateRemaining()
        });
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Timer synchronization server running on port ${PORT}`);
});
