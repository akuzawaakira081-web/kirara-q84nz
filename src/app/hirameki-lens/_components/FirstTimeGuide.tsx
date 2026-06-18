'use client';

import { useState } from 'react';

const STEPS = [
  {
    title: 'カメラを起動しよう',
    desc: '「カメラを起動」ボタンを押してカメラを使えるようにします。初回はブラウザのカメラ許可が求められます。',
    icon: '📷',
  },
  {
    title: '下書きを重ねよう',
    desc: '「下書きを選ぶ」で端末内の画像を選択。カメラ映像に半透明で重ねて表示されます。',
    icon: '🖼️',
  },
  {
    title: '位置を合わせよう',
    desc: '指1本でドラッグして移動、2本指でピンチ拡縮・回転ができます。透明度スライダーで透け具合を調整しましょう。',
    icon: '✋',
  },
];

interface Props {
  onDone: () => void;
}

export default function FirstTimeGuide({ onDone }: Props) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onDone();
    } else {
      setStep((s) => s + 1);
    }
  };

  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div
        className="w-full max-w-sm rounded-card bg-[#fafaf8] p-6 shadow-xl"
        style={{ borderRadius: 'var(--radius-card)' }}
      >
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">{current.icon}</div>
          <h2 className="text-lg font-bold text-[#3a3630]">{current.title}</h2>
        </div>
        <p className="text-sm text-[#7a7570] text-center mb-6">{current.desc}</p>

        {/* ステップドット */}
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? 'bg-[#c9a84c]' : 'bg-[#e8e2d8]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full min-h-[44px] rounded-card bg-[#c9a84c] text-white font-medium hover:opacity-90 transition-opacity"
        >
          {isLast ? 'はじめる' : '次へ'}
        </button>
      </div>
    </div>
  );
}
