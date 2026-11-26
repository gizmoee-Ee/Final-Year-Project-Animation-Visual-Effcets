import React from 'react';
import { FILM_META, SceneData } from '../data/screenplay';

interface RuntimeTimelineProps {
  scenes: SceneData[];
  activeSceneId: string;
  onSelectScene: (sceneId: string) => void;
}

export const RuntimeTimeline: React.FC<RuntimeTimelineProps> = ({
  scenes,
  activeSceneId,
  onSelectScene,
}) => {
  return (
    <section
      id="timeline"
      aria-label="ஐந்து நிமிட நேரக்கோட்டு"
      className="no-print border-b border-[var(--line)] bg-[var(--surface)]/60 py-6"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-base font-bold text-[var(--ink)]">
            காட்சி நேரக்கோட்டு
          </h2>
          <span className="font-mono text-xs tabular-nums text-[var(--muted)]">
            0:00 — 5:00 · 5 காட்சிகள்
          </span>
        </div>

        {/* Proportional timeline segments matching actual seconds in script */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-5 sm:gap-1.5">
          {scenes.map((scene) => {
            const isActive = scene.id === activeSceneId;
            const durationSec = scene.endSec - scene.startSec;
            const widthPercent = Math.round(
              (durationSec / FILM_META.runtimeSeconds) * 100
            );

            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => onSelectScene(scene.id)}
                className={`group flex min-h-11 cursor-pointer flex-col justify-between rounded-md border px-3 py-2.5 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)] ${
                  isActive
                    ? 'border-[var(--cyan)] bg-[var(--surface)] text-[var(--ink)]'
                    : 'border-[var(--line)] bg-[var(--canvas)] text-[var(--muted)] hover:border-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="font-mono text-xs font-medium tabular-nums">
                    {scene.number.toString().padStart(2, '0')}
                  </span>
                  <span className="font-mono text-xs tabular-nums">
                    {scene.timeRange}
                  </span>
                </div>

                <div className="mt-1.5 truncate font-display text-sm font-bold text-[var(--ink)]">
                  {scene.title}
                </div>

                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--line)]">
                  <div
                    className={`h-full transition-colors duration-150 ${
                      isActive
                        ? 'bg-[var(--cyan)]'
                        : 'bg-[var(--muted)]/40 group-hover:bg-[var(--muted)]'
                    }`}
                    style={{ width: `${Math.min(100, widthPercent * 3)}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
