import React, { useEffect, useRef } from 'react';

interface CelebrationCanvasProps {
  burstCounter: number;
  burstOrigin?: { x: number; y: number } | null;
}

interface AmbientParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  shape: 'heart' | 'sparkle' | 'petal';
}

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'confetti' | 'heart' | 'star';
}

const PALETTE = [
  '#E11D48', // Rose Berry
  '#FB7185', // Warm Blush Pink
  '#F59E0B', // Champagne Gold
  '#FBBF24', // Sunlit Amber
  '#A855F7', // Soft Lavender
  '#EC4899', // Peony Pink
  '#14B8A6', // Mint Spark
];

export const CelebrationCanvas: React.FC<CelebrationCanvasProps> = ({
  burstCounter,
  burstOrigin,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fireworksRef = useRef<FireworkParticle[]>([]);
  const ambientRef = useRef<AmbientParticle[]>([]);

  useEffect(() => {
    if (burstCounter === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    const origins = burstOrigin
      ? [
          { x: burstOrigin.x, y: burstOrigin.y },
          { x: width * 0.25, y: height * 0.35 },
          { x: width * 0.75, y: height * 0.35 },
        ]
      : [
          { x: width * 0.5, y: height * 0.4 },
          { x: width * 0.22, y: height * 0.32 },
          { x: width * 0.78, y: height * 0.32 },
          { x: width * 0.35, y: height * 0.24 },
          { x: width * 0.65, y: height * 0.24 },
        ];

    origins.forEach((origin, groupIdx) => {
      const count = groupIdx === 0 ? 68 : 42;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const speed = 2.8 + Math.random() * 8.5;
        const shapes: Array<'confetti' | 'heart' | 'star'> = ['confetti', 'heart', 'star'];
        fireworksRef.current.push({
          x: origin.x,
          y: origin.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.2,
          size: 5 + Math.random() * 6,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          alpha: 1,
          decay: 0.007 + Math.random() * 0.008,
          gravity: 0.11 + Math.random() * 0.05,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.16,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
        });
      }
    });
  }, [burstCounter, burstOrigin]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const ambientCount = window.innerWidth < 768 ? 18 : 32;
    const shapes: Array<'heart' | 'sparkle' | 'petal'> = ['heart', 'sparkle', 'petal'];
    ambientRef.current = Array.from({ length: ambientCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 6 + Math.random() * 8,
      speedY: -0.25 - Math.random() * 0.45,
      speedX: (Math.random() - 0.5) * 0.35,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.015,
      opacity: 0.16 + Math.random() * 0.28,
      color: PALETTE[Math.floor(Math.random() * 4)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }));

    const drawHeart = (c: CanvasRenderingContext2D, size: number) => {
      const s = size * 0.55;
      c.beginPath();
      c.moveTo(0, s * 0.4);
      c.bezierCurveTo(0, -s * 0.3, -s, -s * 0.3, -s, s * 0.25);
      c.bezierCurveTo(-s, s * 0.8, 0, s * 1.15, 0, s * 1.45);
      c.bezierCurveTo(0, s * 1.15, s, s * 0.8, s, s * 0.25);
      c.bezierCurveTo(s, -s * 0.3, 0, -s * 0.3, 0, s * 0.4);
      c.closePath();
      c.fill();
    };

    const drawSparkle = (c: CanvasRenderingContext2D, size: number) => {
      const s = size * 0.75;
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        c.lineTo(Math.cos(angle) * s, Math.sin(angle) * s);
        const midAngle = angle + Math.PI / 4;
        c.lineTo(Math.cos(midAngle) * (s * 0.28), Math.sin(midAngle) * (s * 0.28));
      }
      c.closePath();
      c.fill();
    };

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of ambientRef.current) {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.012) * 0.18;
        p.rotation += p.rotationSpeed;

        if (p.y < -25) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -25) p.x = canvas.width + 20;
        if (p.x > canvas.width + 25) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'heart') {
          drawHeart(ctx, p.size);
        } else if (p.shape === 'sparkle') {
          drawSparkle(ctx, p.size);
        } else {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.6, p.size * 0.32, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
        const fw = fireworksRef.current[i];
        fw.x += fw.vx;
        fw.y += fw.vy;
        fw.vy += fw.gravity;
        fw.vx *= 0.985;
        fw.rotation += fw.rotationSpeed;
        fw.alpha -= fw.decay;

        if (fw.alpha <= 0.01 || fw.y > canvas.height + 50) {
          fireworksRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(fw.x, fw.y);
        ctx.rotate(fw.rotation);
        ctx.globalAlpha = Math.max(0, fw.alpha);
        ctx.fillStyle = fw.color;

        if (fw.shape === 'heart') {
          drawHeart(ctx, fw.size * 1.25);
        } else if (fw.shape === 'star') {
          drawSparkle(ctx, fw.size * 1.25);
        } else {
          ctx.fillRect(-fw.size * 0.6, -fw.size * 0.3, fw.size * 1.2, fw.size * 0.6);
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-40"
    />
  );
};
