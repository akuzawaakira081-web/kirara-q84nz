'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useCamera } from './_hooks/useCamera';
import { useOverlayTransform } from './_hooks/useOverlayTransform';
import CameraView from './_components/CameraView';
import OverlayLayer from './_components/OverlayLayer';
import LayerControls from './_components/LayerControls';
import ErrorDisplay from './_components/ErrorDisplay';
import FirstTimeGuide from './_components/FirstTimeGuide';

const LS_OPACITY = 'hirameki-opacity';
const LS_GUIDE_DONE = 'hirameki-guide-done';
const LS_LOCKED = 'hirameki-locked';

export default function HiramekiLensPage() {
  const { videoRef, isActive, error, startCamera, stopCamera } = useCamera();
  const [opacity, setOpacity] = useState<number>(50);
  const [visible, setVisible] = useState(true);
  const [locked, setLocked] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [guideDone, setGuideDone] = useState(true); // default true to avoid SSR flash
  const prevImageUrlRef = useRef<string | null>(null);

  const { transform, resetTransform, onPointerDown, onPointerMove, onPointerUp } =
    useOverlayTransform(locked);

  // localStorage 読み込み（クライアントのみ）
  useEffect(() => {
    const savedOpacity = localStorage.getItem(LS_OPACITY);
    if (savedOpacity !== null) setOpacity(Number(savedOpacity));

    const savedLocked = localStorage.getItem(LS_LOCKED);
    if (savedLocked !== null) setLocked(savedLocked === 'true');

    const savedGuide = localStorage.getItem(LS_GUIDE_DONE);
    setGuideDone(savedGuide === 'true');
  }, []);

  // opacity 保存
  useEffect(() => {
    localStorage.setItem(LS_OPACITY, String(opacity));
  }, [opacity]);

  // locked 保存
  useEffect(() => {
    localStorage.setItem(LS_LOCKED, String(locked));
  }, [locked]);

  // imageUrl の revoke
  useEffect(() => {
    return () => {
      if (prevImageUrlRef.current) {
        URL.revokeObjectURL(prevImageUrlRef.current);
      }
    };
  }, []);

  const handleSelectImage = useCallback((url: string) => {
    if (prevImageUrlRef.current) {
      URL.revokeObjectURL(prevImageUrlRef.current);
    }
    prevImageUrlRef.current = url;
    setImageUrl(url);
  }, []);

  const handleGuideDone = useCallback(() => {
    localStorage.setItem(LS_GUIDE_DONE, 'true');
    setGuideDone(true);
  }, []);

  const handleOpacityChange = useCallback((v: number) => {
    setOpacity(v);
  }, []);

  return (
    <>
      {/* 初回ガイド */}
      {!guideDone && <FirstTimeGuide onDone={handleGuideDone} />}

      <div className="flex flex-col h-dvh bg-black overflow-hidden">
        {/* ヘッダー */}
        <header
          className="flex items-center justify-between px-4 py-2 z-20 shrink-0"
          style={{
            background: 'rgba(250,250,248,0.92)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderBottom: '1px solid #e8e2d8',
          }}
        >
          <Link
            href="/"
            onClick={stopCamera}
            className="min-h-[44px] flex items-center px-2 text-sm text-[#7a7570] hover:text-[#3a3630]"
          >
            ← 戻る
          </Link>
          <h1 className="text-base font-bold text-[#3a3630]">ひらめきレンズ</h1>
          <button
            onClick={() => setGuideDone(false)}
            className="min-h-[44px] flex items-center px-2 text-sm text-[#7a7570] hover:text-[#3a3630]"
            aria-label="使い方を見る"
          >
            ？
          </button>
        </header>

        {/* 描画エリア */}
        <div className="relative flex-1 overflow-hidden">
          {/* カメラ未起動の場合 */}
          {!isActive && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#fafaf8] z-10">
              <p className="text-[#7a7570] text-sm">カメラを起動してください</p>
              <button
                onClick={startCamera}
                className="min-h-[44px] px-8 py-3 rounded-card bg-[#c9a84c] text-white font-medium hover:opacity-90 transition-opacity"
              >
                カメラを起動
              </button>
            </div>
          )}

          {/* エラー表示 */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#fafaf8] z-10">
              <ErrorDisplay error={error} onRetry={startCamera} />
            </div>
          )}

          {/* カメラ映像 */}
          <CameraView videoRef={videoRef} isActive={isActive} />

          {/* オーバーレイ */}
          {isActive && (
            <OverlayLayer
              imageUrl={imageUrl}
              opacity={opacity}
              visible={visible}
              locked={locked}
              transform={transform}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            />
          )}
        </div>

        {/* 操作パネル */}
        <LayerControls
          hasImage={imageUrl !== null}
          opacity={opacity}
          visible={visible}
          locked={locked}
          isOpen={panelOpen}
          onOpacityChange={handleOpacityChange}
          onToggleVisible={() => setVisible((v) => !v)}
          onToggleLocked={() => setLocked((l) => !l)}
          onReset={resetTransform}
          onSelectImage={handleSelectImage}
          onTogglePanel={() => setPanelOpen((o) => !o)}
        />
      </div>
    </>
  );
}
