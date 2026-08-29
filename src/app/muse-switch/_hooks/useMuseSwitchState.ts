'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type MuseSwitchError = 'invalid-type' | 'too-large' | 'load-failed';

const ERROR_MESSAGES: Record<MuseSwitchError, string> = {
  'invalid-type': 'JPEG・PNG・WebPの画像をえらんでね。',
  'too-large': '画像が大きすぎます。20MBより小さい画像をえらんでね。',
  'load-failed': '画像を開けませんでした。別の画像でもう一度ためしてね。',
};

export function useMuseSwitchErrorMessage(error: MuseSwitchError | null): string {
  if (!error) return '';
  return ERROR_MESSAGES[error];
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

export const MISSIONS = [
  'いちばん長い線を探してみよう。',
  '大きな形を3つに分けて見てみよう。',
  '線が曲がる場所を5つ探してみよう。',
  '暗いところと明るいところを見比べよう。',
  '画像ではなく、まわりの余白を見てみよう。',
  '色を忘れて、明るさだけで見てみよう。',
  '画面の端から、どの線が入ってくるか見よう。',
  '描く前に、いちばん大きい角度を指でなぞろう。',
];

export const FOCUS_SIZES = [120, 200, 280] as const;

const INITIAL_CONTROLS = {
  isUpsideDown: true,
  isMirrored: false,
  isMonochrome: false,
  showGrid: false,
  opacity: 100,
  focusMode: false,
  focusX: 50,
  focusY: 50,
  focusSizeIndex: 1,
  revealMode: false,
};

export function useMuseSwitchState() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<MuseSwitchError | null>(null);
  const [missionIndex, setMissionIndex] = useState(0);

  const [isUpsideDown, setIsUpsideDown] = useState(INITIAL_CONTROLS.isUpsideDown);
  const [isMirrored, setIsMirrored] = useState(INITIAL_CONTROLS.isMirrored);
  const [isMonochrome, setIsMonochrome] = useState(INITIAL_CONTROLS.isMonochrome);
  const [showGrid, setShowGrid] = useState(INITIAL_CONTROLS.showGrid);
  const [opacity, setOpacityState] = useState(INITIAL_CONTROLS.opacity);
  const [focusMode, setFocusMode] = useState(INITIAL_CONTROLS.focusMode);
  const [focusX, setFocusX] = useState(INITIAL_CONTROLS.focusX);
  const [focusY, setFocusY] = useState(INITIAL_CONTROLS.focusY);
  const [focusSizeIndex, setFocusSizeIndex] = useState(INITIAL_CONTROLS.focusSizeIndex);
  const [revealMode, setRevealMode] = useState(INITIAL_CONTROLS.revealMode);

  const imageUrlRef = useRef<string | null>(null);
  useEffect(() => {
    imageUrlRef.current = imageUrl;
  }, [imageUrl]);

  // アンマウント時にObject URLを解放
  useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
    };
  }, []);

  const applyInitialControls = useCallback(() => {
    setIsUpsideDown(INITIAL_CONTROLS.isUpsideDown);
    setIsMirrored(INITIAL_CONTROLS.isMirrored);
    setIsMonochrome(INITIAL_CONTROLS.isMonochrome);
    setShowGrid(INITIAL_CONTROLS.showGrid);
    setOpacityState(INITIAL_CONTROLS.opacity);
    setFocusMode(INITIAL_CONTROLS.focusMode);
    setFocusX(INITIAL_CONTROLS.focusX);
    setFocusY(INITIAL_CONTROLS.focusY);
    setFocusSizeIndex(INITIAL_CONTROLS.focusSizeIndex);
    setRevealMode(INITIAL_CONTROLS.revealMode);
  }, []);

  const selectImage = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('invalid-type');
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError('too-large');
        return;
      }

      let url: string;
      try {
        url = URL.createObjectURL(file);
      } catch {
        setError('load-failed');
        return;
      }

      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }

      setImageUrl(url);
      setFileName(file.name);
      setMissionIndex(0);
      applyInitialControls();
    },
    [applyInitialControls]
  );

  const handleImageLoadError = useCallback(() => {
    setError('load-failed');
  }, []);

  const reset = useCallback(() => {
    applyInitialControls();
  }, [applyInitialControls]);

  const nextMission = useCallback(() => {
    setMissionIndex((i) => (i + 1) % MISSIONS.length);
  }, []);

  const cycleFocusSize = useCallback(() => {
    setFocusSizeIndex((i) => (i + 1) % FOCUS_SIZES.length);
  }, []);

  const setFocusPosition = useCallback((xPercent: number, yPercent: number) => {
    setFocusX(Math.min(100, Math.max(0, xPercent)));
    setFocusY(Math.min(100, Math.max(0, yPercent)));
  }, []);

  const setOpacity = useCallback((v: number) => {
    setOpacityState(Math.min(100, Math.max(20, v)));
  }, []);

  return {
    imageUrl,
    fileName,
    error,
    setError,
    missionIndex,
    mission: MISSIONS[missionIndex],
    nextMission,

    isUpsideDown,
    toggleUpsideDown: () => setIsUpsideDown((v) => !v),
    isMirrored,
    toggleMirrored: () => setIsMirrored((v) => !v),
    isMonochrome,
    toggleMonochrome: () => setIsMonochrome((v) => !v),
    showGrid,
    toggleGrid: () => setShowGrid((v) => !v),
    opacity,
    setOpacity,
    focusMode,
    toggleFocusMode: () => setFocusMode((v) => !v),
    focusX,
    focusY,
    setFocusPosition,
    focusSize: FOCUS_SIZES[focusSizeIndex],
    cycleFocusSize,
    revealMode,
    toggleRevealMode: () => setRevealMode((v) => !v),

    selectImage,
    handleImageLoadError,
    reset,
  };
}
