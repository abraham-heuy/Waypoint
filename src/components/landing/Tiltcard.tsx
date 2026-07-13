import { useRef, useState, type ReactNode, type MouseEvent } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number; // degrees
  glare?: boolean;
}

export default function TiltCard({ children, className = '', maxTilt = 10, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<{ transform: string; glareStyle: React.CSSProperties }>({
    transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
    glareStyle: { opacity: 0 },
  });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - py) * maxTilt * 2;

    setStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`,
      glareStyle: glare
        ? {
            opacity: 0.08,
            background: `radial-gradient(circle at ${px * 100}% ${py * 100}%, #ffffff, transparent 60%)`,
          }
        : { opacity: 0 },
    });
  }

  function handleLeave() {
    setStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
      glareStyle: { opacity: 0 },
    });
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transform: style.transform, transition: 'transform 150ms ease-out', transformStyle: 'preserve-3d' }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-150"
        style={style.glareStyle}
      />
    </div>
  );
}