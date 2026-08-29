'use client';

import { useRef } from 'react';

interface Props {
  x: number; // 0-100 (%)
  y: number; // 0-100 (%)
  size: number; // px diameter
  onMove: (xPercent: number, yPercent: number) => void;
}

export default function FocusOverlay({ x, y, size, onMove }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFromPoint = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const xPercent = ((clientX - rect.left) / rect.width) * 100;
    const yPercent = ((clientY - rect.top) / rect.height) * 100;
    onMove(xPercent, yPercent);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromPoint(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons === 0 && e.pointerType !== 'touch') return;
    updateFromPoint(e.clientX, e.clientY);
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 touch-none cursor-crosshair"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      role="button"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size,
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)',
          border: '2px solid rgba(255,255,255,0.85)',
        }}
      />
    </div>
  );
}
