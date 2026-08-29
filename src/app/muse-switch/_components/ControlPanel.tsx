'use client';

interface ToggleButtonProps {
  pressed: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}

function ToggleButton({ pressed, icon, label, onClick }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={pressed}
      className={`min-h-[44px] px-2 rounded-xl text-sm font-medium border transition-opacity hover:opacity-80 active:opacity-70 flex items-center justify-center gap-1 ${
        pressed
          ? 'bg-[#d6cef0] border-[#d6cef0] text-[#3a3630]'
          : 'bg-white border-[#e8e2d8] text-[#3a3630]'
      }`}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

const FOCUS_SIZE_LABELS: Record<number, string> = {
  120: '小',
  200: '中',
  280: '大',
};

interface Props {
  isUpsideDown: boolean;
  onToggleUpsideDown: () => void;
  isMirrored: boolean;
  onToggleMirrored: () => void;
  isMonochrome: boolean;
  onToggleMonochrome: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  focusMode: boolean;
  onToggleFocusMode: () => void;
  focusSize: number;
  onCycleFocusSize: () => void;
  revealMode: boolean;
  onToggleRevealMode: () => void;
  opacity: number;
  onOpacityChange: (v: number) => void;
  onReset: () => void;
  onChangeImage: () => void;
}

export default function ControlPanel({
  isUpsideDown,
  onToggleUpsideDown,
  isMirrored,
  onToggleMirrored,
  isMonochrome,
  onToggleMonochrome,
  showGrid,
  onToggleGrid,
  focusMode,
  onToggleFocusMode,
  focusSize,
  onCycleFocusSize,
  revealMode,
  onToggleRevealMode,
  opacity,
  onOpacityChange,
  onReset,
  onChangeImage,
}: Props) {
  return (
    <div
      className="w-full px-3 pb-5 pt-3 flex flex-col gap-3"
      style={{
        background: 'rgba(250,250,248,0.96)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderTop: '1px solid #e8e2d8',
        borderRadius: '16px 16px 0 0',
      }}
    >
      {revealMode && (
        <p aria-live="polite" className="text-center text-xs font-medium text-[#7a7570]">
          元の向きで確認中
        </p>
      )}

      <div className="grid grid-cols-3 gap-2">
        <ToggleButton pressed={isUpsideDown} icon="↻" label="逆さ" onClick={onToggleUpsideDown} />
        <ToggleButton pressed={isMirrored} icon="↔" label="左右" onClick={onToggleMirrored} />
        <ToggleButton pressed={isMonochrome} icon="◐" label="MONO" onClick={onToggleMonochrome} />
        <ToggleButton pressed={showGrid} icon="#" label="GRID" onClick={onToggleGrid} />
        <ToggleButton pressed={focusMode} icon="◎" label="FOCUS" onClick={onToggleFocusMode} />
        <ToggleButton pressed={revealMode} icon="👁" label="REVEAL" onClick={onToggleRevealMode} />
      </div>

      {focusMode && (
        <button
          onClick={onCycleFocusSize}
          className="min-h-[44px] rounded-xl text-sm font-medium border border-[#e8e2d8] bg-white text-[#3a3630] hover:opacity-80 active:opacity-70 transition-opacity"
        >
          観察窓のおおきさ：{FOCUS_SIZE_LABELS[focusSize] ?? '中'}
        </button>
      )}

      <div className="flex items-center gap-2">
        <span className="text-xs text-[#7a7570] shrink-0 w-14">うすさ {opacity}%</span>
        <input
          type="range"
          min={20}
          max={100}
          value={opacity}
          onChange={(e) => onOpacityChange(Number(e.target.value))}
          aria-valuetext={`うすさ ${opacity}パーセント`}
          className="flex-1 accent-[#c9a84c]"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 min-h-[44px] rounded-xl text-sm font-medium border border-[#e8e2d8] bg-white text-[#3a3630] hover:opacity-80 active:opacity-70 transition-opacity"
        >
          RESET
        </button>
        <button
          onClick={onChangeImage}
          className="flex-1 min-h-[44px] rounded-xl text-sm font-medium bg-[#c9a84c] text-white hover:opacity-80 active:opacity-70 transition-opacity"
        >
          画像を変える
        </button>
      </div>
    </div>
  );
}
