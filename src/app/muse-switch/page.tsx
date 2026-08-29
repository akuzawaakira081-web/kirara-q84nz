'use client';

import Link from 'next/link';
import { useRef } from 'react';
import MuseSwitchHero from './_components/MuseSwitchHero';
import ImageUploader from './_components/ImageUploader';
import TrainingStage from './_components/TrainingStage';
import HowToSteps from './_components/HowToSteps';
import { useMuseSwitchState } from './_hooks/useMuseSwitchState';

export default function MuseSwitchPage() {
  const state = useMuseSwitchState();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) state.selectImage(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col min-h-dvh bg-[#fafaf8]">
      <header
        className="flex items-center justify-between px-4 py-2 shrink-0"
        style={{
          background: 'rgba(250,250,248,0.92)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: '1px solid #e8e2d8',
        }}
      >
        <Link
          href="/"
          className="min-h-[44px] flex items-center px-2 text-sm text-[#7a7570] hover:text-[#3a3630]"
        >
          ← 戻る
        </Link>
        <h1 className="text-base font-bold text-[#3a3630]">MUSE SWITCH</h1>
        <span className="min-h-[44px] flex items-center px-2" aria-hidden="true" />
      </header>

      <main className="flex-1 flex flex-col">
        {!state.imageUrl ? (
          <>
            <MuseSwitchHero onStart={openPicker} />
            <ImageUploader error={state.error} onPickClick={openPicker} onDropFile={state.selectImage} />
          </>
        ) : (
          <TrainingStage state={state} onChangeImage={openPicker} />
        )}

        <HowToSteps />
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="画像をえらぶ"
      />
    </div>
  );
}
