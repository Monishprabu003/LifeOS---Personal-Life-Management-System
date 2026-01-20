import { useEffect, useRef } from 'react';

export function NexusAnimation({ activeTab }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;
        const mouse = { x: -100, y: -100, radius: 300 };
        let width, height;

        const getTabColors = (tab) => {
            switch (tab) {
                case 'health':
                    return { primary: '16, 185, 129', secondary: '52, 211, 153' }; // Green
                case 'wealth':
                    return { primary: '59, 130, 246', secondary: '96, 165, 250' }; // Blue
                case 'relationships':
                    return { primary: '244, 63, 94', secondary: '251, 113, 133' }; // Red/Rose
                case 'habits':
                    return { primary: '245, 158, 11', secondary: '251, 191, 36' }; // Orange/Amber
                case 'goals':
                    return { primary: '139, 92, 246', secondary: '167, 139, 250' }; // Purple/Violet
                default:
                    return { primary: '94, 114, 228', secondary: '130, 143, 236' }; // Default Indigo
            }
        };

        const createParticles = () => {
            particles = [];
            const count = Math.min(100, Math.floor((width * height) / 12000));
            const colors = getTabColors(activeTab);

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    z: Math.random() * 2 + 1,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 5 + 3,
                    color: Math.random() > 0.5 ? colors.primary : colors.secondary,
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: 0.02 + Math.random() * 0.03
                });
            }
        };

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            createParticles();
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            const colors = getTabColors(activeTab);

            particles.forEach((p, i) => {
                p.x += p.vx * (1 / p.z);
                p.y += p.vy * (1 / p.z);

                if (p.x < -100) p.x = width + 100;
                if (p.x > width + 100) p.x = -100;
                if (p.y < -100) p.y = height + 100;
                if (p.y > height + 100) p.y = -100;

                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let extraSize = 0;
                if (dist < mouse.radius) {
                    const force = (1 - dist / mouse.radius);
                    p.x -= dx * force * 0.08;
                    p.y -= dy * force * 0.08;
                    extraSize = force * 15;
                }

                p.pulse += p.pulseSpeed;
                const pulseFactor = Math.sin(p.pulse) * 0.3 + 0.7;
                const opac = (0.5 + (1 / p.z) * 0.5) * pulseFactor;

                ctx.beginPath();
                ctx.shadowBlur = 15;
                ctx.shadowColor = `rgba(${p.color}, 0.5)`;
                ctx.arc(p.x, p.y, (p.size + extraSize) * (2.5 / p.z), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color}, ${opac})`;
                ctx.fill();
                ctx.shadowBlur = 0;

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const ldx = p.x - p2.x;
                    const ldy = p.y - p2.y;
                    const ldist = Math.sqrt(ldx * ldx + ldy * ldy);

                    if (ldist < 300) {
                        const lineOpac = (1 - ldist / 300) * 0.4 * (1 / p.z);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(${colors.primary}, ${lineOpac})`;
                        ctx.lineWidth = 1.5;
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);

        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [activeTab]); // Restart animation when tab changes to update colors

    return (
        <canvas
            ref={canvasRef}
            id="nexus-bg-canvas"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                pointerEvents: 'none',
                opacity: 1,
                background: 'transparent'
            }}
        />
    );
}
