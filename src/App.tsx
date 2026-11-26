import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Moon, Printer, Sun } from 'lucide-react';
import {
  CHARACTERS,
  FILM_META,
  SCENES,
} from './data/screenplay';
import { TopBar } from './components/TopBar';
import { RuntimeTimeline } from './components/RuntimeTimeline';
import {
  ScriptScene,
  SpeakerFilter,
  ViewFilter,
} from './components/ScriptScene';
import { MarginRail } from './components/MarginRail';
import {
  FeedbackSection,
  ScriptComment,
} from './components/FeedbackSection';

type FontScale = 'sm' | 'md' | 'lg';

const FONT_SCALE_CLASSES: Record<FontScale, string> = {
  sm: 'text-[0.98rem]',
  md: 'text-[1.0625rem]',
  lg: 'text-[1.1875rem]',
};

const STORAGE_KEYS = {
  theme: 'dormant-theme',
  bookmarks: 'dormant-bookmarks',
  notes: 'dormant-notes',
  scriptLike: 'dormant-script-like',
  sceneLikes: 'dormant-scene-likes',
  comments: 'dormant-comments',
};

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = window.localStorage.getItem(STORAGE_KEYS.theme);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [activeSceneId, setActiveSceneId] = useState<string>(SCENES[0].id);
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');
  const [speakerFilter, setSpeakerFilter] = useState<SpeakerFilter>('all');
  const [fontScale, setFontScale] = useState<FontScale>('md');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.bookmarks);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [notesByScene, setNotesByScene] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.notes);
      return raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch {
      return {};
    }
  });

  const [scriptLiked, setScriptLiked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEYS.scriptLike) === 'true';
  });

  const [sceneLikes, setSceneLikes] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.sceneLikes);
      return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });

  const [comments, setComments] = useState<ScriptComment[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.comments);
      return raw ? (JSON.parse(raw) as ScriptComment[]) : [];
    } catch {
      return [];
    }
  });

  const [composerSceneId, setComposerSceneId] = useState<string>('general');
  const [selectedSceneFilter, setSelectedSceneFilter] = useState<string>('all');
  const feedbackTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Sync .dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem(STORAGE_KEYS.theme, isDark ? 'dark' : 'light');
  }, [isDark]);

  // Persist bookmarks, director notes, likes & comments
  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.bookmarks,
      JSON.stringify(bookmarks)
    );
  }, [bookmarks]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.notes,
      JSON.stringify(notesByScene)
    );
  }, [notesByScene]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.scriptLike,
      String(scriptLiked)
    );
  }, [scriptLiked]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.sceneLikes,
      JSON.stringify(sceneLikes)
    );
  }, [sceneLikes]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.comments,
      JSON.stringify(comments)
    );
  }, [comments]);

  // Scroll-spy for active scene & reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(
          Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100))
        );
      }

      const sceneElements = Array.from(
        document.querySelectorAll<HTMLElement>('[data-scene-id]')
      );
      if (sceneElements.length === 0) return;

      const anchorY = window.innerHeight * 0.32;
      let current = sceneElements[0].dataset.sceneId || SCENES[0].id;
      for (const el of sceneElements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= anchorY) {
          current = el.dataset.sceneId || current;
        }
      }
      setActiveSceneId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [focusMode]);

  const activeScene = useMemo(
    () => SCENES.find((s) => s.id === activeSceneId) ?? SCENES[0],
    [activeSceneId]
  );

  const handleSelectScene = (sceneId: string) => {
    setActiveSceneId(sceneId);
    const el = document.getElementById(sceneId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleBookmark = (sceneId: string) => {
    setBookmarks((prev) =>
      prev.includes(sceneId)
        ? prev.filter((id) => id !== sceneId)
        : [...prev, sceneId]
    );
  };

  const handleChangeNote = (sceneId: string, value: string) => {
    setNotesByScene((prev) => ({
      ...prev,
      [sceneId]: value,
    }));
  };

  const handleToggleSceneLike = (sceneId: string) => {
    setSceneLikes((prev) => ({
      ...prev,
      [sceneId]: !prev[sceneId],
    }));
  };

  const handleOpenCommentForScene = (sceneId: string) => {
    setComposerSceneId(sceneId);
    const el = document.getElementById('feedback');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.setTimeout(() => {
      feedbackTextareaRef.current?.focus();
    }, 350);
  };

  const handleAddComment = (author: string, sceneId: string, body: string) => {
    const now = new Date();
    const timeLabel = now.toLocaleTimeString('ta-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const newComment: ScriptComment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      author,
      sceneId,
      body,
      createdAt: timeLabel,
      likes: 0,
      likedByMe: false,
    };
    setComments((prev) => [newComment, ...prev]);
    if (selectedSceneFilter !== 'all' && selectedSceneFilter !== sceneId) {
      setSelectedSceneFilter('all');
    }
  };

  const handleToggleCommentLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        const nextLiked = !c.likedByMe;
        return {
          ...c,
          likedByMe: nextLiked,
          likes: Math.max(0, c.likes + (nextLiked ? 1 : -1)),
        };
      })
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="top" className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <TopBar
        focusMode={focusMode}
        onToggleFocusMode={() => setFocusMode((prev) => !prev)}
      />

      {/* Reading progress hairline */}
      <div
        aria-hidden="true"
        className="no-print fixed left-0 right-0 top-0 z-40 h-0.5 bg-transparent pointer-events-none"
      >
        <div
          className="h-full bg-[var(--cyan)] transition-[width] duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Dossier (hidden in Focus Reading Mode & Print) */}
      {!focusMode && (
        <section
          id="synopsis"
          className="no-print border-b border-[var(--line)] py-10 sm:py-14"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
              {/* Left: Film Title, Tagline, Synopsis & Primary Actions */}
              <div className="flex flex-col justify-between lg:col-span-7">
                <div>
                  <p className="text-xs font-medium tracking-wider text-[var(--muted)]">
                    {FILM_META.subtitle} · {FILM_META.genre}
                  </p>
                  <h1 className="mt-3 font-mono text-5xl font-medium tracking-[0.12em] text-[var(--ink)] sm:text-6xl lg:text-7xl">
                    {FILM_META.title}
                    <span className="text-[var(--amber)]">.</span>
                  </h1>
                  <p
                    className="mt-4 font-display text-xl font-medium text-[var(--cyan)] sm:text-2xl"
                    style={{ textWrap: 'balance' }}
                  >
                    {FILM_META.tagline}
                  </p>

                  <p className="mt-6 max-w-2xl text-base leading-[1.85] text-[var(--ink)]">
                    {FILM_META.logline}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#script"
                    className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--cyan)] px-5 py-2.5 text-sm font-semibold text-white dark:text-[#0d1317] whitespace-nowrap shrink-0 transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)]"
                  >
                    திரைக்கதை வாசிக்க
                  </a>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--ink)] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[var(--cyan)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)]"
                  >
                    <Printer className="h-4 w-4" />
                    <span>அச்சிடு</span>
                  </button>
                </div>
              </div>

              {/* Right: Character Roster Dossier matching hero height */}
              <div
                id="characters"
                className="flex flex-col justify-between rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 lg:col-span-5"
              >
                <div>
                  <h2 className="font-display text-base font-bold text-[var(--ink)]">
                    கதாபாத்திரங்கள்
                  </h2>
                  <dl className="mt-5 space-y-5">
                    {CHARACTERS.map((char, idx) => (
                      <div
                        key={char.id}
                        className={
                          idx > 0
                            ? 'border-t border-[var(--line)] pt-5'
                            : undefined
                        }
                      >
                        <dt className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="font-display text-base font-bold text-[var(--amber)]">
                            {char.name}
                          </span>
                          <span className="text-xs text-[var(--muted)]">
                            {char.role}
                          </span>
                        </dt>
                        <dd className="mt-1.5 text-sm leading-relaxed text-[var(--ink)]">
                          {char.description}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Unboxed quantitative summary strip */}
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--line)] pt-4 text-xs text-[var(--muted)]">
                  <span className="font-mono tabular-nums">5 காட்சிகள்</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">5:00 நிமிடம்</span>
                  <span aria-hidden="true">·</span>
                  <span>ஒற்றை இடக்களம் (மாடி)</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive 5-minute Runtime Timeline */}
      {!focusMode && (
        <RuntimeTimeline
          scenes={SCENES}
          activeSceneId={activeSceneId}
          onSelectScene={handleSelectScene}
        />
      )}

      {/* Reader Workspace Toolbar */}
      <div
        id="script"
        className="no-print border-b border-[var(--line)] bg-[var(--canvas)] py-4"
      >
        <div
          className={`mx-auto flex flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 ${
            focusMode ? 'max-w-3xl' : 'max-w-6xl'
          }`}
        >
          {/* Left: View & Speaker Filter Segmented Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode */}
            <div
              role="group"
              aria-label="உள்ளடக்க வடிப்பான்"
              className="flex items-center rounded-md border border-[var(--line)] bg-[var(--surface)] p-1"
            >
              {(
                [
                  { id: 'all', label: 'அனைத்தும்' },
                  { id: 'dialogue', label: 'உரையாடல்' },
                  { id: 'action', label: 'விளக்கம்' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setViewFilter(tab.id)}
                  className={`min-h-8 cursor-pointer rounded px-3 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--cyan)] ${
                    viewFilter === tab.id
                      ? 'bg-[var(--canvas)] text-[var(--ink)]'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Speaker Highlight */}
            {viewFilter !== 'action' && (
              <div
                role="group"
                aria-label="கதாபாத்திரக் கவனம்"
                className="flex items-center rounded-md border border-[var(--line)] bg-[var(--surface)] p-1"
              >
                {(
                  [
                    { id: 'all', label: 'அனைவர்' },
                    { id: 'arjun', label: 'அர்ஜுன்' },
                    { id: 'drone', label: 'இயந்திரம்' },
                  ] as const
                ).map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => setSpeakerFilter(sp.id)}
                    className={`min-h-8 cursor-pointer rounded px-3 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--cyan)] ${
                      speakerFilter === sp.id
                        ? 'bg-[var(--canvas)] text-[var(--amber)]'
                        : 'text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Typography Size & Theme Switch */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label="எழுத்து அளவு"
              className="flex items-center rounded-md border border-[var(--line)] bg-[var(--surface)] p-1"
            >
              {(
                [
                  { id: 'sm', label: 'சிறிய' },
                  { id: 'md', label: 'இயல்பு' },
                  { id: 'lg', label: 'பெரிய' },
                ] as const
              ).map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setFontScale(size.id)}
                  className={`min-h-8 cursor-pointer rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--cyan)] ${
                    fontScale === size.id
                      ? 'bg-[var(--canvas)] text-[var(--ink)]'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              aria-label={isDark ? 'ஒளி வண்ணத்திற்கு மாற்று' : 'இருள் வண்ணத்திற்கு மாற்று'}
              className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--ink)] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[var(--cyan)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)]"
            >
              {isDark ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-[var(--amber)]" />
                  <span>ஒளி</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-[var(--cyan)]" />
                  <span>இருள்</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Reading Canvas */}
      <main
        className={`mx-auto px-4 py-8 sm:px-6 lg:px-8 ${
          focusMode ? 'max-w-3xl' : 'max-w-6xl'
        }`}
      >
        {/* Print-only title header */}
        <div className="hidden print:block border-b border-black pb-4 mb-6">
          <h1 className="font-mono text-3xl font-semibold tracking-widest">
            {FILM_META.title}.
          </h1>
          <p className="mt-1 text-base">{FILM_META.tagline}</p>
          <p className="mt-1 text-xs text-neutral-600">
            {FILM_META.subtitle} · {FILM_META.genre}
          </p>
        </div>

        <div
          className={
            focusMode
              ? 'print-full'
              : 'grid grid-cols-1 gap-10 lg:grid-cols-12'
          }
        >
          {/* Screenplay Column */}
          <div className={focusMode ? '' : 'print-full lg:col-span-8'}>
            {SCENES.map((scene) => (
              <ScriptScene
                key={scene.id}
                scene={scene}
                isActive={scene.id === activeSceneId}
                isBookmarked={bookmarks.includes(scene.id)}
                isLiked={Boolean(sceneLikes[scene.id])}
                likeCount={sceneLikes[scene.id] ? 1 : 0}
                commentCount={
                  comments.filter((c) => c.sceneId === scene.id).length
                }
                onToggleBookmark={handleToggleBookmark}
                onToggleLike={handleToggleSceneLike}
                onOpenCommentForScene={handleOpenCommentForScene}
                onSelectScene={setActiveSceneId}
                viewFilter={viewFilter}
                speakerFilter={speakerFilter}
                fontSizeClass={FONT_SCALE_CLASSES[fontScale]}
              />
            ))}

            {/* Closing Beat */}
            <div className="mt-8 border-t border-[var(--line)] pt-10 text-center font-display">
              <p className="text-sm font-medium tracking-wider text-[var(--muted)]">
                {FILM_META.endCut}
              </p>
              <p className="mt-2 text-2xl font-extrabold text-[var(--ink)]">
                {FILM_META.endFin}
              </p>
            </div>

            {/* Interactive Likes & Comments Feedback Section */}
            <FeedbackSection
              scenes={SCENES}
              scriptLiked={scriptLiked}
              scriptLikeCount={scriptLiked ? 1 : 0}
              onToggleScriptLike={() => setScriptLiked((prev) => !prev)}
              comments={comments}
              selectedSceneFilter={selectedSceneFilter}
              onChangeSceneFilter={setSelectedSceneFilter}
              composerSceneId={composerSceneId}
              onChangeComposerSceneId={setComposerSceneId}
              onAddComment={handleAddComment}
              onToggleCommentLike={handleToggleCommentLike}
              onDeleteComment={handleDeleteComment}
              textareaRef={feedbackTextareaRef}
            />
          </div>

          {/* Right Sticky Production Margin Rail */}
          {!focusMode && (
            <div className="lg:col-span-4">
              <MarginRail
                scene={activeScene}
                note={notesByScene[activeScene.id] ?? ''}
                onChangeNote={handleChangeNote}
                bookmarkedCount={bookmarks.length}
              />
            </div>
          )}
        </div>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="no-print border-t border-[var(--line)] py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-xs text-[var(--muted)] sm:px-6 lg:px-8">
          <span>
            {FILM_META.title}. · {FILM_META.subtitle}
          </span>
          <a
            href="#top"
            className="font-medium text-[var(--ink)] transition-colors hover:text-[var(--cyan)] hover:underline underline-offset-4"
          >
            மேலே செல்ல ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
