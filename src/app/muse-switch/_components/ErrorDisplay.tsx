'use client';

import { MuseSwitchError, useMuseSwitchErrorMessage } from '../_hooks/useMuseSwitchState';

interface Props {
  error: MuseSwitchError;
}

export default function ErrorDisplay({ error }: Props) {
  const message = useMuseSwitchErrorMessage(error);

  return (
    <p
      role="alert"
      className="w-full max-w-sm mx-auto px-4 py-3 rounded-card text-sm text-center font-medium text-[#b3453a] bg-[#fbeceb] border border-[#f0c9c5]"
    >
      {message}
    </p>
  );
}
