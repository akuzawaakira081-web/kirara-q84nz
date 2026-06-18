'use client';

import React from 'react';
import { TransformState } from '../_hooks/useOverlayTransform';

interface Props {
  imageUrl: string | null;
  opacity: number;
  visible: boolean;
  locked: boolean;
  transform: TransformState;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export default function OverlayLayer({
  imageUrl,
  opacity,
  visible,
  locked,
  transform,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: Props) {
  if (!imageUrl) return null;

  const { x, y, scale, rotation } = transform;

  return (
    <div
      className="absolute inset-0 z-10 touch-none"
      style={{ pointerEvents: locked ? 'none' : 'auto' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="overlay"
        draggable={false}
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          maxWidth: '100%',
          maxHeight: '100%',
          transformOrigin: 'center center',
          transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotation}deg)`,
          opacity: visible ? opacity / 100 : 0,
          transition: 'opacity 0.2s',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      />
    </div>
  );
}
