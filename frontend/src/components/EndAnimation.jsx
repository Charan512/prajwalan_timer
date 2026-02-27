import { useState, useEffect } from 'react';
import './EndAnimation.css';

export default function EndAnimation({ show }) {
    const [phase, setPhase] = useState('implode'); // implode, supernova, trophy, report
    const [showStats, setShowStats] = useState(false);

    useEffect(() => {
        if (!show) return;

        // Reset state on show
        setPhase('implode');
        setShowStats(false);

        // Sequence Timings
        const timings = {
            implode: 1000,
            supernova: 800,
            trophy: 2000,
            report: 1000
        };

        // 1. Implode -> Supernova
        const t1 = setTimeout(() => setPhase('supernova'), timings.implode);

        // 2. Supernova -> Trophy
        const t2 = setTimeout(() => setPhase('trophy'), timings.implode + timings.supernova);

        // 3. Trophy -> Report (Final State)
        const t3 = setTimeout(() => {
            setPhase('report');
            setShowStats(true);
        }, timings.implode + timings.supernova + timings.trophy);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [show]);

    if (!show) return null;

    return (
        <div className={`cyber-end-overlay phase-${phase}`}>

            {/* Phase 1: Singularity Implosion */}
            {phase === 'implode' && (
                <div className="cyber-implosion-core">
                    <div className="implosion-ring"></div>
                    <div className="implosion-particles"></div>
                </div>
            )}

            {/* Phase 2: Digital Supernova */}
            {phase === 'supernova' && (
                <div className="cyber-supernova">
                    <div className="shockwave-grid"></div>
                    <div className="shockwave-ring"></div>
                </div>
            )}

            {/* Phase 3 & 4: Trophy & Report */}
            {(phase === 'trophy' || phase === 'report') && (
                <div className="mission-complete-container">

                    {/* 3D Wireframe Trophy/Emblem */}
                    <div className={`cyber-trophy ${phase === 'report' ? 'minimized' : ''}`}>
                        <div className="trophy-pyramid">
                            <div className="side front"></div>
                            <div className="side back"></div>
                            <div className="side left"></div>
                            <div className="side right"></div>
                            <div className="base"></div>
                        </div>
                        <div className="trophy-rings"></div>
                    </div>

                    {/* Main Text - Appears in Report Phase */}
                    <div className={`cyber-report ${phase === 'report' ? 'visible' : ''}`}>
                        <h1 className="mission-title" data-text="MISSION COMPLETE">MISSION COMPLETE</h1>
                        <div className="mission-subtitle">SYSTEM STATUS: <span className="status-success">OPTIMAL</span></div>

                        {/* Data Blocks for Stats */}
                        <div className="cyber-stats-grid">
                            {/* Duration Block */}
                            <div className="data-block">
                                <div className="block-header">/// DURATION</div>
                                <div className="block-content">
                                    <span className="huge-stat">24</span>
                                    <span className="unit">HRS</span>
                                </div>
                                <div className="block-footer">EXECUTION_TIME</div>
                            </div>

                            {/* Participants Block */}
                            <div className="data-block highlight">
                                <div className="block-header">/// AGENTS</div>
                                <div className="block-content">
                                    <span className="huge-stat">100+</span>
                                </div>
                                <div className="block-footer">PARTICIPANTS</div>
                            </div>

                            {/* Innovations Block */}
                            <div className="data-block">
                                <div className="block-header">/// OUTPUT</div>
                                <div className="block-content">
                                    <span className="huge-stat">50+</span>
                                    <span className="unit">PROJS</span>
                                </div>
                                <div className="block-footer">INNOVATIONS_LOGGED</div>
                            </div>
                        </div>


                    </div>
                </div>
            )}

            {/* Always Visible Overlay Effects during active phases */}
            <div className="scanline-overlay"></div>
            <div className="vignette-overlay"></div>
        </div>
    );
}
