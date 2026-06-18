'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

export type CameraError =
  | 'permission-denied'
  | 'not-found'
  | 'https-required'
  | 'not-supported'
  | 'unknown';

const ERROR_MESSAGES: Record<CameraError, string> = {
  'permission-denied': 'カメラの使用が許可されていません',
  'not-found': 'カメラが見つかりません',
  'https-required': 'HTTPSが必要です',
  'not-supported': 'このブラウザはカメラ機能に対応していません',
  unknown: 'カメラの起動に失敗しました',
};

export function useCameraErrorMessage(error: CameraError | null): string {
  if (!error) return '';
  return ERROR_MESSAGES[error];
}

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<CameraError | null>(null);

  const startCamera = useCallback(async () => {
    setError(null);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      if (
        typeof window !== 'undefined' &&
        window.location.protocol !== 'https:' &&
        window.location.hostname !== 'localhost'
      ) {
        setError('https-required');
      } else {
        setError('not-supported');
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsActive(true);
    } catch (err) {
      if (err instanceof DOMException) {
        if (
          err.name === 'NotAllowedError' ||
          err.name === 'PermissionDeniedError'
        ) {
          setError('permission-denied');
        } else if (
          err.name === 'NotFoundError' ||
          err.name === 'DevicesNotFoundError'
        ) {
          setError('not-found');
        } else if (err.name === 'NotSupportedError') {
          setError('https-required');
        } else {
          setError('unknown');
        }
      } else {
        setError('unknown');
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return { videoRef, isActive, error, startCamera, stopCamera };
}
