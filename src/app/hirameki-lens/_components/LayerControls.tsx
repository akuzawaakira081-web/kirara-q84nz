'use client';

import React, { useRef } from 'react';

interface Props {
  hasImage: boolean;
  opacity: number;
  visible: boolean;
  locked: boolean;
  isOpen: boolean;
  onOpacityChange: (v: number) => void;
  onToggleVisible: () => void;
  onToggleLocked: () => void;
  onReset: () => void;
  onSelectImage: (url: string) => void;
  onTogglePanel: () => void;
}

export default function LayerControls({
  hasImage,
  opacity,
  visible,
  locked,
  isOpen,
  onOpacityChange,
  onToggleVisible,
  onToggleLocked,
  onReset,
  onSelectImage,
  onTogglePanel,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onSelectImage(url);
    e.target.value = '';
  };

  const btnBase =
    'min-h-[44px] px-3 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 active:opacity-70';
  const btnGold = `${btnBase} bg-[#c9a84c] text-white`;
  const btnOutline = `${btnBase} border border-[#e8e2d8] bg-white text-[#3a3630]`;
  const btnActive = `${btnBase} bg-[#d6cef0] text-[#3a3630]`;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30"
      style={{
        background: 'rgba(250,250,248,0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderTop: '1px solid #e8e2d8',
        borderRadius: '16px 16px 0 0',
      }}
    >
      {/* 折りたたみトグル */}
      <button
        onClick={onTogglePanel}
        className="w-full flex justify-center py-2"
        aria-label={isOpen ? 'パネルを閉じる' : 'パネルを開く'}
      >
        <span className="w-10 h-1 rounded-full bg-[#c9c4bc]" />
      </button>

      {isOpen && (
        <div className="px-4 pb-safe-or-4 pb-4 flex flex-col gap-3">
          {/* 画像選択 */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`${btnGold} w-full`}
          >
            {hasImage ? '下書きを変更' : '下書きを選ぶ'}
          </button>

          {/* 透明度スライダー */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#7a7570] w-16 shrink-0">透明度 {opacity}%</span>
            <input
              type="range"
              min={0}
              max={100}
              value={opacity}
              onChange={(e) => onOpacityChange(Number(e.target.value))}
              className="flex-1 accent-[#c9a84c]"
            />
          </div>

          {/* 操作ボタン行（画像あり時のみ） */}
          {hasImage && (
            <div className="flex gap-2">
              <button
                onClick={onToggleVisible}
                className={`${visible ? btnActive : btnOutline} flex-1`}
              >
                {visible ? '非表示' : '表示'}
              </button>
              <button
                onClick={onToggleLocked}
                className={`${locked ? btnActive : btnOutline} flex-1`}
              >
                {locked ? '固定中' : '固定'}
              </button>
              <button onClick={onReset} className={`${btnOutline} flex-1`}>
                リセット
              </button>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
