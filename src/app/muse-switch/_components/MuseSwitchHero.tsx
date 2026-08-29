'use client';

interface Props {
  onStart: () => void;
}

export default function MuseSwitchHero({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-12 gap-4">
      <span className="text-xs font-bold tracking-wider text-[#7a7570]">きららMuse</span>
      <h1 className="text-3xl font-bold text-[#3a3630]">MUSE SWITCH</h1>
      <p className="text-sm font-medium text-[#c9a84c]">いつもの見方をOFF。見る力をON。</p>
      <p className="text-sm text-[#7a7570] max-w-xs">
        画像を逆さまにして、名前ではなく「線・形・色」を見て描いてみよう。
      </p>
      <button
        onClick={onStart}
        className="mt-2 min-h-[44px] px-8 py-3 rounded-card bg-[#c9a84c] text-white font-medium hover:opacity-90 transition-opacity"
      >
        画像を選んではじめる
      </button>
    </div>
  );
}
