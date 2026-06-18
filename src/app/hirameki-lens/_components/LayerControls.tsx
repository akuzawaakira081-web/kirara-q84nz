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
  const changeFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onSelectImage(url);
    e.target.value = '';
  };

  const handleChangeImage = () => {
    const ok = window.confirm('下書き画像を変更しますか？');
    if (ok) {
      changeFileInputRef.current?.click();
    }
  };

  const btnBase =
    'min-h-[44px] px-4 py-2 rounded-card text-sm font-medium transition-opacity hover:opacity-80 active:opacity-70';
  const btnGold = `${btnBase} bg-[#c9a84c] text-white`;
  const btnOutline = `${btnBase} border border-[#e8e2d8] bg-white text-[#3a3630]`;
  const btnActive = `${btnBase} bg-[#d6cef0] text-[#3a3630]`;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30"
      style={{
        background: 'rgba(250,250,248,0.92)',
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
        <span className="w-10 h-1 rounded-full bg-[#e8e2d8]" />
      </button>

      {isOpen && (
        <div className="px-4 pb-6 flex flex-col gap-3">
          {/* 画像選択行 */}
          <div className="flex gap-2">
            {!hasImage ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`${btnGold} flex-1`}
              >
                下書きを選ぶ
              </button>
            ) : (
              <button onClick={handleChangeImage} className={`${btnOutline} flex-1`}>
                下書きを変更
              </button>
            )}
          </div>

          {/* 透明度スライダー */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#7a7570]">透明度 {opacity}%</label>
            <input
              type="range"
              min={0}
              max={100}
              value={opacity}
              onChange={(e) => onOpacityChange(Number(e.target.value))}
              className="w-full accent-[#c9a84c]"
            />
          </div>

          {/* 操作ボタン行 */}
          {hasImage && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={onToggleVisible}
                className={visible ? btnActive : btnOutline}
              >
                {visible ? '下書きを隠す' : '下書きを表示'}
              </button>
              <button
                onClick={onToggleLocked}
                className={locked ? btnActive : btnOutline}
              >
                {locked ? '固定を解除' : '位置を固定'}
              </button>
              <button onClick={onReset} className={btnOutline}>
                位置をリセット
              </button>
            </div>
          )}
        </div>
      )}

      {/* hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={changeFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
