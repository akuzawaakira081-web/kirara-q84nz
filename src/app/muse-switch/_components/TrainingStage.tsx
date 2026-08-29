'use client';

import ImageViewport from './ImageViewport';
import ControlPanel from './ControlPanel';
import MissionCard from './MissionCard';
import ErrorDisplay from './ErrorDisplay';
import { useMuseSwitchState } from '../_hooks/useMuseSwitchState';

interface Props {
  state: ReturnType<typeof useMuseSwitchState>;
  onChangeImage: () => void;
}

export default function TrainingStage({ state, onChangeImage }: Props) {
  if (!state.imageUrl) return null;

  return (
    <div className="flex flex-col min-h-[70dvh]">
      <p className="text-center text-xs text-[#7a7570] px-4 py-3">
        名前を考えず、線・形・角度・余白を見て描いてみよう。
      </p>

      {state.error && (
        <div className="px-4 pb-3">
          <ErrorDisplay error={state.error} />
        </div>
      )}

      <ImageViewport
        imageUrl={state.imageUrl}
        altLabel={state.fileName ?? 'えらんだ画像'}
        isUpsideDown={state.isUpsideDown}
        isMirrored={state.isMirrored}
        isMonochrome={state.isMonochrome}
        opacity={state.opacity}
        showGrid={state.showGrid}
        focusMode={state.focusMode}
        focusX={state.focusX}
        focusY={state.focusY}
        focusSize={state.focusSize}
        revealMode={state.revealMode}
        onFocusMove={state.setFocusPosition}
        onLoadError={() => state.setError('load-failed')}
      />

      <div className="px-4 py-4">
        <MissionCard mission={state.mission} onNext={state.nextMission} />
      </div>

      <div className="sticky bottom-0 z-10">
        <ControlPanel
          isUpsideDown={state.isUpsideDown}
          onToggleUpsideDown={state.toggleUpsideDown}
          isMirrored={state.isMirrored}
          onToggleMirrored={state.toggleMirrored}
          isMonochrome={state.isMonochrome}
          onToggleMonochrome={state.toggleMonochrome}
          showGrid={state.showGrid}
          onToggleGrid={state.toggleGrid}
          focusMode={state.focusMode}
          onToggleFocusMode={state.toggleFocusMode}
          focusSize={state.focusSize}
          onCycleFocusSize={state.cycleFocusSize}
          revealMode={state.revealMode}
          onToggleRevealMode={state.toggleRevealMode}
          opacity={state.opacity}
          onOpacityChange={state.setOpacity}
          onReset={state.reset}
          onChangeImage={onChangeImage}
        />
      </div>
    </div>
  );
}
