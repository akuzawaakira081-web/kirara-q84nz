'use client';

interface Props {
  mission: string;
  onNext: () => void;
}

export default function MissionCard({ mission, onNext }: Props) {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 rounded-card bg-[#f5ecd7] flex flex-col items-center gap-3 text-center">
      <span className="text-xs font-bold tracking-wider text-[#a5843a]">今日のMUSE MISSION</span>
      <p aria-live="polite" className="text-base font-medium text-[#3a3630]">
        {mission}
      </p>
      <button
        onClick={onNext}
        className="min-h-[44px] px-5 rounded-card border border-[#c9a84c] text-[#c9a84c] text-sm font-medium bg-white hover:opacity-80 transition-opacity"
      >
        次のミッション
      </button>
    </div>
  );
}
