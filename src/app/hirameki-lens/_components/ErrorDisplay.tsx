'use client';

import { CameraError, useCameraErrorMessage } from '../_hooks/useCamera';

interface Props {
  error: CameraError;
  onRetry: () => void;
}

export default function ErrorDisplay({ error, onRetry }: Props) {
  const message = useCameraErrorMessage(error);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-[#3a3630] text-base">{message}</p>
      <button
        onClick={onRetry}
        className="min-h-[44px] px-6 py-2 rounded-card bg-[#c9a84c] text-white font-medium hover:opacity-90 transition-opacity"
      >
        もう一度試す
      </button>
    </div>
  );
}
