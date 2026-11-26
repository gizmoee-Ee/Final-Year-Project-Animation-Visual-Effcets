import React from 'react';
import { Bookmark, Heart, MessageSquare } from 'lucide-react';
import { SceneData, SpeakerId } from '../data/screenplay';

export type ViewFilter = 'all' | 'dialogue' | 'action';
export type SpeakerFilter = 'all' | SpeakerId;

interface ScriptSceneProps {
  scene: SceneData;
  isActive: boolean;
  isBookmarked: boolean;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  onToggleBookmark: (sceneId: string) => void;
  onToggleLike: (sceneId: string) => void;
  onOpenCommentForScene: (sceneId: string) => void;
  onSelectScene: (sceneId: string) => void;
  viewFilter: ViewFilter;
  speakerFilter: SpeakerFilter;
  fontSizeClass: string;
}

export const ScriptScene: React.FC<ScriptSceneProps> = ({
  scene,
  isActive,
  isBookmarked,
  isLiked,
  likeCount,
  commentCount,
  onToggleBookmark,
  onToggleLike,
  onOpenCommentForScene,
  onSelectScene,
  viewFilter,
  speakerFilter,
  fontSizeClass,
}) => {
  const visibleSegments = scene.segments.filter((segment) => {
    if (viewFilter === 'dialogue' && segment.type !== 'dialogue') {
      return false;
    }
    if (viewFilter === 'action' && segment.type !== 'action') {
      return false;
    }
    return true;
  });

  return (
    <article
      id={scene.id}
      data-scene-id={scene.id}
      onClick={() => onSelectScene(scene.id)}
      className={`scroll-mt-24 border-b border-[var(--line)] py-10 first:pt-4 last:border-b-0 transition-opacity duration-150`}
    >
      {/* Scene Heading + Timecode + Actions */}
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3
            className="font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-[1.65rem]"
            style={{ textWrap: 'balance' }}
          >
            காட்சி {scene.number} · {scene.title}
          </h3>
          <span className="font-mono text-xs tabular-nums tracking-wider text-[var(--muted)]">
            {scene.timeRange}
          </span>
        </div>

        <div className="no-print flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(scene.id);
            }}
            aria-pressed={isLiked}
            aria-label={`காட்சி ${scene.number} விருப்பம்`}
            className={`inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)] ${
              isLiked
                ? 'border-[var(--amber)] bg-[var(--surface)] text-[var(--amber)]'
                : 'border-[var(--line)] bg-transparent text-[var(--muted)] hover:border-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Heart
              className="h-3.5 w-3.5"
              fill={isLiked ? 'currentColor' : 'none'}
            />
            <span className="font-mono tabular-nums">{likeCount}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCommentForScene(scene.id);
            }}
            aria-label={`காட்சி ${scene.number} கருத்து எழுது`}
            className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-md border border-[var(--line)] bg-transparent px-3 py-1.5 text-xs font-medium text-[var(--muted)] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[var(--cyan)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)]"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="font-mono tabular-nums">{commentCount}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(scene.id);
            }}
            aria-pressed={isBookmarked}
            aria-label={`காட்சி ${scene.number} அடையாளம்`}
            className={`inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)] ${
              isBookmarked
                ? 'border-[var(--amber)] bg-[var(--surface)] text-[var(--amber)]'
                : 'border-[var(--line)] bg-transparent text-[var(--muted)] hover:border-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Bookmark
              className="h-3.5 w-3.5"
              fill={isBookmarked ? 'currentColor' : 'none'}
            />
            <span>{isBookmarked ? 'சேமிக்கப்பட்டது' : 'அடையாளம்'}</span>
          </button>
        </div>
      </div>

      {/* Slugline: Hairline all-around border + subtle surface contrast (no thick left bar) */}
      <p
        className={`mb-6 rounded-md border px-4 py-2.5 font-display text-sm font-bold leading-relaxed text-[var(--cyan)] sm:text-base ${
          isActive
            ? 'border-[var(--cyan)]/50 bg-[var(--surface)]'
            : 'border-[var(--line)] bg-[var(--surface)]'
        }`}
      >
        {scene.slugline}
      </p>

      {/* Screenplay Body */}
      <div className={`space-y-5 leading-[1.95] ${fontSizeClass}`}>
        {visibleSegments.map((segment, index) => {
          if (segment.type === 'action' && segment.parts) {
            return (
              <p
                key={`${scene.id}-act-${index}`}
                className="max-w-[65ch] text-[var(--ink)]"
              >
                {segment.parts.map((part, pIdx) => {
                  if (part.emphasis === 'strong') {
                    return (
                      <strong key={pIdx} className="font-semibold text-[var(--ink)]">
                        {part.text}
                      </strong>
                    );
                  }
                  if (part.emphasis === 'em') {
                    return (
                      <em
                        key={pIdx}
                        className="font-mono text-[0.92em] not-italic text-[var(--crimson)]"
                      >
                        {part.text}
                      </em>
                    );
                  }
                  return <React.Fragment key={pIdx}>{part.text}</React.Fragment>;
                })}
              </p>
            );
          }

          if (segment.type === 'dialogue') {
            const isDimmed =
              speakerFilter !== 'all' && segment.speakerId !== speakerFilter;
            const isHighlighted =
              speakerFilter !== 'all' && segment.speakerId === speakerFilter;

            return (
              <div
                key={`${scene.id}-dlg-${index}`}
                className={`mx-auto my-6 max-w-md rounded-md px-5 py-4 text-center transition-opacity duration-150 ${
                  isHighlighted
                    ? 'border border-[var(--amber)]/40 bg-[var(--surface)]'
                    : 'bg-transparent'
                } ${isDimmed ? 'opacity-35' : 'opacity-100'}`}
              >
                <p className="font-display text-sm font-bold tracking-wide text-[var(--amber)]">
                  {segment.speakerLabel}
                </p>
                {segment.parenthetical && (
                  <p className="mt-0.5 text-sm text-[var(--muted)]">
                    {segment.parenthetical}
                  </p>
                )}
                <p
                  className={`mt-2 font-medium text-[var(--ink)] ${
                    segment.isMachine
                      ? 'font-mono text-[0.94em] leading-relaxed'
                      : 'text-[1.04em] leading-relaxed'
                  }`}
                >
                  {segment.line}
                </p>
              </div>
            );
          }

          return null;
        })}
      </div>
    </article>
  );
};
