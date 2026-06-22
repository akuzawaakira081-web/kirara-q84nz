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

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30"
      style={{
        background: 'rgba(250,250,248,0.96)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderTop: '1px solid #e8e2d8',
        borderRadius: '16px 16px 0 0',
      }}
    >
      {/* ドラッグバー */}
      <button
        onClick={onTogglePanel}
        className="w-full flex justify-center pt-2 pb-1"
        aria-label={isOpen ? 'パネルを閉じる' : 'パネルを開く'}
      >
        <span className="w-10 h-1 rounded-full bg-[#c9c4bc]" />
      </button>

      {isOpen && (
        <div className="px-3 pb-5 flex flex-col gap-2">
          {/* 行1: 画像選択ボタン ＋ 操作ボタン群（画像あり時） */}
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 min-h-[44px] rounded-xl text-sm font-medium bg-[#c9a84c] text-white transition-opacity hover:opacity-80 active:opacity-70"
            >
              {hasImage ? '下書きを変更' : '下書きを選ぶ'}
            </button>

            {hasImage && (
              <>
                <button
                  onClick={onToggleVisible}
                  className={`min-h-[44px] px-3 rounded-xl text-sm font-medium border transition-opacity hover:opacity-80 active:opacity-70 ${
                    visible ? 'bg-[#d6cef0] border-[#d6cef0] text-[#3a3630]' : 'bg-white border-[#e8e2d8] text-[#7a7570]'
                  }`}
                  title={visible ? '非表示にする' : '表示する'}
                >
                  {visible ? '👁 表示中' : '👁 非表示'}
                </button>
                <button
                  onClick={onToggleLocked}
                  className={`min-h-[44px] px-3 rounded-xl text-sm font-medium border transition-opacity hover:opacity-80 active:opacity-70 ${
                    locked ? 'bg-[#d6cef0] border-[#d6cef0] text-[#3a3630]' : 'bg-white border-[#e8e2d8] text-[#3a3630]'
                  }`}
                  title={locked ? '固定解除' : '位置を固定'}
                >
                  {locked ? '🔒' : '🔓'}
                </button>
                <button
                  onClick={onReset}
                  className="min-h-[44px] px-3 rounded-xl text-sm font-medium border border-[#e8e2d8] bg-white text-[#3a3630] transition-opacity hover:opacity-80 active:opacity-70"
                  title="位置をリセット"
                >
                  ↺
                </button>
              </>
            )}
          </div>

          {/* 行2: 透明度スライダー */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7a7570] shrink-0 w-14">透明度 {opacity}%</span>
            <input
              type="range"
              min={0}
              max={100}
              value={opacity}
              onChange={(e) => onOpacityChange(Number(e.target.value))}
              className="flex-1 accent-[#c9a84c]"
            />
          </div>
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
