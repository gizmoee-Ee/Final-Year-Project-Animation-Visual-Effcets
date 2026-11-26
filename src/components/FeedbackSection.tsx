import React, { useState } from 'react';
import { Heart, MessageSquare, Trash2 } from 'lucide-react';
import { SceneData } from '../data/screenplay';

export interface ScriptComment {
  id: string;
  author: string;
  sceneId: string; // 'general' or scene.id ('s1'..'s5')
  body: string;
  createdAt: string;
  likes: number;
  likedByMe: boolean;
}

interface FeedbackSectionProps {
  scenes: SceneData[];
  scriptLiked: boolean;
  scriptLikeCount: number;
  onToggleScriptLike: () => void;
  comments: ScriptComment[];
  selectedSceneFilter: string;
  onChangeSceneFilter: (sceneId: string) => void;
  composerSceneId: string;
  onChangeComposerSceneId: (sceneId: string) => void;
  onAddComment: (author: string, sceneId: string, body: string) => void;
  onToggleCommentLike: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  scenes,
  scriptLiked,
  scriptLikeCount,
  onToggleScriptLike,
  comments,
  selectedSceneFilter,
  onChangeSceneFilter,
  composerSceneId,
  onChangeComposerSceneId,
  onAddComment,
  onToggleCommentLike,
  onDeleteComment,
  textareaRef,
}) => {
  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedBody = body.trim();
    if (!trimmedBody) {
      setError('கருத்தை உள்ளிடவும்.');
      return;
    }
    setError('');
    onAddComment(author.trim() || 'வாசகர்', composerSceneId, trimmedBody);
    setBody('');
  };

  const getSceneLabel = (sceneId: string) => {
    if (sceneId === 'general') return 'பொதுக் கருத்து';
    const found = scenes.find((s) => s.id === sceneId);
    return found ? `காட்சி ${found.number} · ${found.title}` : 'பொதுக் கருத்து';
  };

  const filteredComments =
    selectedSceneFilter === 'all'
      ? comments
      : comments.filter((c) => c.sceneId === selectedSceneFilter);

  return (
    <section
      id="feedback"
      aria-label="கருத்துகள் மற்றும் விருப்பம்"
      className="no-print mt-12 border-t border-[var(--line)] pt-10"
    >
      {/* Header + Overall Script Like */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2
            className="font-display text-2xl font-extrabold text-[var(--ink)]"
            style={{ textWrap: 'balance' }}
          >
            கருத்துகள் மற்றும் விருப்பம்
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            திரைக்கதை மற்றும் காட்சிகள் குறித்த உங்கள் பின்னூட்டத்தைப் பதிவு செய்யுங்கள்.
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleScriptLike}
          aria-pressed={scriptLiked}
          className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)] ${
            scriptLiked
              ? 'border-[var(--amber)] bg-[var(--surface)] text-[var(--amber)]'
              : 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--cyan)]'
          }`}
        >
          <Heart
            className="h-4 w-4"
            fill={scriptLiked ? 'currentColor' : 'none'}
          />
          <span>{scriptLiked ? 'விரும்பப்பட்டது' : 'விருப்பம்'}</span>
          <span className="font-mono text-xs tabular-nums text-[var(--muted)]">
            {scriptLikeCount}
          </span>
        </button>
      </div>

      {/* Comment Composer Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="feedback-author"
              className="block text-xs font-medium text-[var(--muted)]"
            >
              பெயர் (விருப்பத்திற்குரியது)
            </label>
            <input
              id="feedback-author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="உங்கள் பெயர்"
              maxLength={60}
              className="mt-1.5 min-h-10 w-full rounded-md border border-[var(--line)] bg-[var(--canvas)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--cyan)] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="feedback-scene"
              className="block text-xs font-medium text-[var(--muted)]"
            >
              தொடர்புடைய காட்சி
            </label>
            <select
              id="feedback-scene"
              value={composerSceneId}
              onChange={(e) => onChangeComposerSceneId(e.target.value)}
              className="mt-1.5 min-h-10 w-full rounded-md border border-[var(--line)] bg-[var(--canvas)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--cyan)] focus:outline-none"
            >
              <option value="general">பொதுக் கருத்து (முழுத் திரைக்கதை)</option>
              {scenes.map((scene) => (
                <option key={scene.id} value={scene.id}>
                  காட்சி {scene.number} · {scene.title} ({scene.timeRange})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="feedback-body"
            className="block text-xs font-medium text-[var(--muted)]"
          >
            உங்கள் கருத்து
          </label>
          <textarea
            ref={textareaRef}
            id="feedback-body"
            rows={3}
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              if (error) setError('');
            }}
            placeholder="காட்சி அமைப்பு, உரையாடல் அல்லது காட்சி ஓட்டம் குறித்த உங்கள் கருத்தை எழுதுங்கள்..."
            className="mt-1.5 w-full resize-y rounded-md border border-[var(--line)] bg-[var(--canvas)] px-3 py-2.5 text-sm leading-relaxed text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--cyan)] focus:outline-none"
          />
          {error && (
            <p className="mt-1.5 text-xs font-medium text-[var(--crimson)]">
              {error}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-[var(--muted)]">
            பதிவு செய்யப்படும் கருத்துகள் இந்த உலாவியில் சேமிக்கப்படும்.
          </span>
          <button
            type="submit"
            className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md bg-[var(--cyan)] px-5 py-2 text-sm font-semibold text-white dark:text-[#0d1317] whitespace-nowrap shrink-0 transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)]"
          >
            <MessageSquare className="h-4 w-4" />
            <span>கருத்தைச் சேர்</span>
          </button>
        </div>
      </form>

      {/* Comments List & Filter */}
      <div className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <h3 className="font-display text-base font-bold text-[var(--ink)]">
              பதிவான கருத்துகள்
            </h3>
            <span className="font-mono text-xs tabular-nums text-[var(--muted)]">
              ({filteredComments.length})
            </span>
          </div>

          {comments.length > 0 && (
            <select
              aria-label="கருத்துகளை வடிகட்டு"
              value={selectedSceneFilter}
              onChange={(e) => onChangeSceneFilter(e.target.value)}
              className="min-h-9 rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--ink)] focus:border-[var(--cyan)] focus:outline-none"
            >
              <option value="all">அனைத்து கருத்துகள்</option>
              <option value="general">பொதுக் கருத்துகள்</option>
              {scenes.map((scene) => (
                <option key={scene.id} value={scene.id}>
                  காட்சி {scene.number} · {scene.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {filteredComments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--line)] px-5 py-8 text-center text-sm text-[var(--muted)]">
            {comments.length === 0
              ? 'இதுவரை கருத்துகள் எதுவும் இல்லை. முதல் கருத்தைப் பதிவு செய்யுங்கள்.'
              : 'தேர்ந்தெடுத்த காட்சிக்குக் கருத்துகள் எதுவும் இல்லை.'}
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredComments.map((comment) => (
              <li
                key={comment.id}
                className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-xs">
                    <span className="font-display text-sm font-bold text-[var(--ink)]">
                      {comment.author}
                    </span>
                    <span aria-hidden="true" className="text-[var(--muted)]">
                      ·
                    </span>
                    <span className="font-medium text-[var(--cyan)]">
                      {getSceneLabel(comment.sceneId)}
                    </span>
                    <span aria-hidden="true" className="text-[var(--muted)]">
                      ·
                    </span>
                    <span className="font-mono tabular-nums text-[var(--muted)]">
                      {comment.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onToggleCommentLike(comment.id)}
                      aria-pressed={comment.likedByMe}
                      aria-label="கருத்தை விரும்பு"
                      className={`inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--cyan)] ${
                        comment.likedByMe
                          ? 'border-[var(--amber)] text-[var(--amber)]'
                          : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--muted)] hover:text-[var(--ink)]'
                      }`}
                    >
                      <Heart
                        className="h-3.5 w-3.5"
                        fill={comment.likedByMe ? 'currentColor' : 'none'}
                      />
                      <span className="font-mono tabular-nums">
                        {comment.likes}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteComment(comment.id)}
                      aria-label="கருத்தை நீக்கு"
                      className="inline-flex min-h-8 cursor-pointer items-center rounded border border-transparent p-1.5 text-[var(--muted)] transition-colors hover:text-[var(--crimson)] focus-visible:outline-2 focus-visible:outline-[var(--cyan)]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="mt-2.5 whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink)]">
                  {comment.body}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
