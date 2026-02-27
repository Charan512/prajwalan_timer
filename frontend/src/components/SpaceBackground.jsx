import React from 'react';
import './SpaceBackground.css';
import Particles from './Particles';

const SpaceBackground = ({ hasStarted }) => {
    return (
        <div className="space-background">
            <div className="particles-wrapper">
                <Particles
                    particleColors={['#ffffff', '#ffffff']}
                    particleCount={600}
                    particleSpread={40}
                    speed={0.1}
                    particleBaseSize={150}
                    moveParticlesOnHover={true}
                    alphaParticles={false}
                    disableRotation={false}
                    cameraDistance={10}
                />
            </div>

            <div className={`celestial-body earth ${hasStarted ? 'visible' : ''}`}>
                <img src="/earth-v3.png" alt="Earth" />
            </div>

            <div className={`celestial-body moon ${hasStarted ? 'visible' : ''}`}>
                <img src="/moon-latest.png" alt="Moon" />
            </div>
        </div>
    );
};

export default SpaceBackground;
