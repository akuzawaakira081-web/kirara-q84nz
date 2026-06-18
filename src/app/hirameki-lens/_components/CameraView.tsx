'use client';

import React from 'react';

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
}

export default function CameraView({ videoRef, isActive }: Props) {
  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="absolute inset-0 w-full h-full z-[1]"
      style={{ objectFit: 'cover', display: isActive ? 'block' : 'none' }}
    />
  );
}
