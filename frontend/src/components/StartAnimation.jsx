import { useState, useEffect, useRef } from 'react';
import './StartAnimation.css';

export default function StartAnimation({ onComplete }) {
    const [phase, setPhase] = useState('grid_load'); // grid_load, system_check, identity, immerse
    const [decodedText, setDecodedText] = useState('');
    const [scrambleText, setScrambleText] = useState('');

    // Matrix decoding effect for "PRAJWALAN"
    useEffect(() => {
        if (phase === 'identity') {
            const targetText = 'PRAJWALAN';
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*';
            let iterations = 0;

            const interval = setInterval(() => {
                setDecodedText(targetText.split('').map((letter, index) => {
                    if (index < iterations) {
                        return targetText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join(''));

                if (iterations >= targetText.length) {
                    clearInterval(interval);
                    setDecodedText(targetText); // Ensure final text is correct
                }

                iterations += 1 / 3; // Slower reveal for dramatic effect
            }, 30);

            return () => clearInterval(interval);
        }
    }, [phase]);

    // Scramble effect for "INITIALIZED"
    useEffect(() => {
        if (phase === 'identity') {
            const interval = setInterval(() => {
                const chars = '01';
                setScrambleText(Array(11).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join(''));
            }, 50);

            // Stop scrambling and show real text after 1s
            const timeout = setTimeout(() => {
                clearInterval(interval);
                setScrambleText('INITIALIZED');
            }, 1000);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            }
        }
    }, [phase]);

    useEffect(() => {
        // Phase timing sequence
        const timings = {
            grid_load: 800,      // Grid draws out
            system_check: 1200,  // Terminal text & loader
            identity: 2500,      // Text decoding
            immerse: 1000        // Zoom through grid
        };

        if (phase === 'grid_load') {
            const timer = setTimeout(() => setPhase('system_check'), timings.grid_load);
            return () => clearTimeout(timer);
        }

        if (phase === 'system_check') {
            const timer = setTimeout(() => setPhase('identity'), timings.system_check);
            return () => clearTimeout(timer);
        }

        if (phase === 'identity') {
            const timer = setTimeout(() => setPhase('immerse'), timings.identity);
            return () => clearTimeout(timer);
        }

        if (phase === 'immerse') {
            const timer = setTimeout(() => {
                onComplete && onComplete();
            }, timings.immerse);
            return () => clearTimeout(timer);
        }
    }, [phase, onComplete]);

    return (
        <div className={`cyber-boot-overlay phase-${phase}`}>

            {/* Phase 1 & 4: The Grid */}
            <div className="cyber-grid-container">
                <div className="cyber-grid-floor"></div>
                <div className="cyber-grid-ceiling"></div>
            </div>

            {/* Phase 2: System Diagnostics */}
            {(phase === 'system_check' || phase === 'identity') && (
                <div className="system-diagnostics">
                    <div className="corner-text top-left">
                        <div>SYS_BOOT_SEQ... <span className="status-ok">OK</span></div>
                        <div>MEM_ALLOC_0x8F... <span className="status-ok">OK</span></div>
                        <div>VR_CORE_INIT... <span className="status-pending">LOAD</span></div>
                    </div>
                    <div className="corner-text bottom-right">
                        <div>LINK_ESTABLISHED</div>
                        <div>SECURE_CONN: TRUE</div>
                        <div className="blink-text">_WAITING_FOR_USER</div>
                    </div>

                    {/* Sharp Geometric Loader */}
                    <div className="geo-loader">
                        <div className="geo-ring outer"></div>
                        <div className="geo-ring inner"></div>
                        <div className="geo-core"></div>
                    </div>
                </div>
            )}

            {/* Phase 3: Identity Verification */}
            {(phase === 'identity' || phase === 'immerse') && (
                <div className="identity-container">
                    <div className="cyber-text-wrapper">
                        <h1 className="cyber-title" data-text={decodedText}>{decodedText}</h1>
                        <div className="cyber-underline"></div>
                    </div>
                    <div className="cyber-subtitle-box">
                        <span className="scramble-text">{scrambleText}</span>
                    </div>
                </div>
            )}

            {/* Vignette Overlay for depth */}
            <div className="cyber-vignette"></div>
        </div>
    );
}
