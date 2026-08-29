const STEPS = ['画像をえらぶ', '逆さのまま、線と形を見て描く', 'REVEALで元に戻して見比べる'];

export default function HowToSteps() {
  return (
    <div className="w-full max-w-md mx-auto px-6 py-10 flex flex-col items-center gap-6 text-center">
      <h2 className="text-sm font-bold tracking-wider text-[#7a7570]">つかいかた</h2>
      <ol className="flex flex-col gap-3 w-full">
        {STEPS.map((step, i) => (
          <li
            key={step}
            className="flex items-center gap-3 px-4 py-3 rounded-card bg-white border border-[#e8e2d8] text-left"
          >
            <span
              className="shrink-0 w-7 h-7 rounded-full bg-[#c9a84c] text-white text-sm font-bold flex items-center justify-center"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span className="text-sm text-[#3a3630]">{step}</span>
          </li>
        ))}
      </ol>
      <p className="text-xs text-[#7a7570]">上手に描くことより、よく見ることが今日のゴールです。</p>
    </div>
  );
}
