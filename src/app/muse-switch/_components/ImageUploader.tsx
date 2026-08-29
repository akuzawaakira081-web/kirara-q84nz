'use client';

import { useState } from 'react';
import ErrorDisplay from './ErrorDisplay';
import { MuseSwitchError } from '../_hooks/useMuseSwitchState';

interface Props {
  error: MuseSwitchError | null;
  onPickClick: () => void;
  onDropFile: (file: File) => void;
}

export default function ImageUploader({ error, onPickClick, onDropFile }: Props) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onDropFile(file);
  };

  return (
    <div className="flex flex-col items-center gap-4 px-6 pb-16">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={onPickClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPickClick();
          }
        }}
        className={`w-full max-w-md min-h-[220px] flex flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed cursor-pointer transition-colors ${
          isDragOver ? 'border-[#c9a84c] bg-[#f5ecd7]' : 'border-[#e8e2d8] bg-white'
        }`}
      >
        <span className="text-4xl" aria-hidden="true">
          🖼️
        </span>
        <span className="text-base font-medium text-[#3a3630]">描いてみたい画像をえらんでね</span>
        <span className="text-xs text-[#7a7570]">JPEG・PNG・WebP対応（PCはドラッグ＆ドロップもOK）</span>
        <span className="mt-1 min-h-[44px] px-6 flex items-center rounded-card bg-[#c9a84c] text-white font-medium hover:opacity-90 transition-opacity">
          画像をえらぶ
        </span>
      </div>

      {error && <ErrorDisplay error={error} />}

      <p className="text-xs text-[#7a7570] text-center max-w-xs">
        選んだ画像は、この端末の中だけで使われます。
      </p>
    </div>
  );
}
