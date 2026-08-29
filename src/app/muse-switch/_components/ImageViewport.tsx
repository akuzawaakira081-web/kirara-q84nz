'use client';

import GridOverlay from './GridOverlay';
import FocusOverlay from './FocusOverlay';

interface Props {
  imageUrl: string;
  altLabel: string;
  isUpsideDown: boolean;
  isMirrored: boolean;
  isMonochrome: boolean;
  opacity: number;
  showGrid: boolean;
  focusMode: boolean;
  focusX: number;
  focusY: number;
  focusSize: number;
  revealMode: boolean;
  onFocusMove: (xPercent: number, yPercent: number) => void;
  onLoadError: () => void;
}

export default function ImageViewport({
  imageUrl,
  altLabel,
  isUpsideDown,
  isMirrored,
  isMonochrome,
  opacity,
  showGrid,
  focusMode,
  focusX,
  focusY,
  focusSize,
  revealMode,
  onFocusMove,
  onLoadError,
}: Props) {
  const rotation = revealMode ? 0 : isUpsideDown ? 180 : 0;
  const scaleX = isMirrored ? -1 : 1;

  return (
    <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
      <div className="relative inline-block leading-none max-w-full max-h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={altLabel}
          draggable={false}
          onError={onLoadError}
          className="block max-w-full select-none"
          style={{
            maxHeight: 'calc(100dvh - 320px)',
            transform: `rotate(${rotation}deg) scaleX(${scaleX})`,
            filter: isMonochrome ? 'grayscale(1)' : 'none',
            opacity: opacity / 100,
            transition: 'transform 0.15s, filter 0.15s, opacity 0.15s',
          }}
        />

        {showGrid && <GridOverlay />}
        {focusMode && (
          <FocusOverlay x={focusX} y={focusY} size={focusSize} onMove={onFocusMove} />
        )}
      </div>
    </div>
  );
}
