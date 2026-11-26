import React from 'react';
import { Trash2 } from 'lucide-react';
import { SceneData } from '../data/screenplay';
import { SceneSchematic } from './SceneSchematic';

interface MarginRailProps {
  scene: SceneData;
  note: string;
  onChangeNote: (sceneId: string, value: string) => void;
  bookmarkedCount: number;
}

export const MarginRail: React.FC<MarginRailProps> = ({
  scene,
  note,
  onChangeNote,
  bookmarkedCount,
}) => {
  return (
    <aside
      aria-label="காட்சித் தயாரிப்பு விவரங்கள்"
      className="no-print space-y-6 lg:sticky lg:top-24 lg:self-start"
    >
      {/* Visual Schematic for Active Scene */}
      <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h3 className="font-display text-sm font-bold text-[var(--ink)]">
            காட்சி {scene.number} · காட்சிப் படிமம்
          </h3>
          <span className="font-mono text-xs tabular-nums text-[var(--muted)]">
            {scene.timeRange}
          </span>
        </div>
        <SceneSchematic scene={scene} />
      </div>

      {/* Production Breakdown extracted strictly from screenplay */}
      <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
        <h3 className="font-display text-sm font-bold text-[var(--ink)]">
          தயாரிப்புக் குறிப்புகள்
        </h3>

        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="text-xs font-medium text-[var(--muted)]">
              ஒளியமைப்பு மற்றும் சூழல்
            </dt>
            <dd className="mt-1 leading-relaxed text-[var(--ink)]">
              {scene.lightingMood}
            </dd>
          </div>

          <div className="border-t border-[var(--line)] pt-3">
            <dt className="text-xs font-medium text-[var(--muted)]">
              தேவையான பொருட்கள்
            </dt>
            <dd className="mt-1.5 leading-relaxed text-[var(--ink)]">
              {scene.props.join(' · ')}
            </dd>
          </div>

          <div className="border-t border-[var(--line)] pt-3">
            <dt className="text-xs font-medium text-[var(--muted)]">
              ஒலி வடிவமைப்பு
            </dt>
            <dd className="mt-1.5 leading-relaxed text-[var(--ink)]">
              {scene.soundCues.join(' · ')}
            </dd>
          </div>
        </dl>
      </div>

      {/* Persistent Director's Notes per Scene */}
      <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <label
            htmlFor={`note-${scene.id}`}
            className="font-display text-sm font-bold text-[var(--ink)]"
          >
            இயக்குநர் குறிப்பு (காட்சி {scene.number})
          </label>
          {note.trim().length > 0 && (
            <button
              type="button"
              onClick={() => onChangeNote(scene.id, '')}
              aria-label="குறிப்பை அழி"
              className="inline-flex min-h-8 cursor-pointer items-center gap-1 rounded px-2 py-1 text-xs text-[var(--muted)] transition-colors hover:text-[var(--crimson)] focus-visible:outline-2 focus-visible:outline-[var(--cyan)]"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>அழி</span>
            </button>
          )}
        </div>
        <textarea
          id={`note-${scene.id}`}
          rows={3}
          value={note}
          onChange={(e) => onChangeNote(scene.id, e.target.value)}
          placeholder="கேமரா கோணம், ஒலி அல்லது நடிப்புக் குறிப்புகளை இங்கே பதிவு செய்யலாம்..."
          className="w-full resize-y rounded-md border border-[var(--line)] bg-[var(--canvas)] px-3 py-2 text-sm leading-relaxed text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--cyan)] focus:outline-none"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-[var(--muted)]">
          <span>உலாவியில் தானாகச் சேமிக்கப்படும்</span>
          <span className="font-mono tabular-nums">
            அடையாளம்: {bookmarkedCount}/5
          </span>
        </div>
      </div>
    </aside>
  );
};
