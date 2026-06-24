'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const moodWords: Record<number, string> = {
  1: 'Heavy day',
  2: 'Low',
  3: 'Neutral',
  4: 'Good — keep going',
  5: 'Great day',
};

interface CurrentTrack {
  name: string;
  artist: string;
  albumCover: string;
  spotifyId: string;
}

export default function MoodCard() {
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState('');
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
  const [playing, setPlaying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    function fetchCurrentTrack() {
      fetch('/api/spotify/currently-playing')
        .then((r) => r.json())
        .then((data) => {
          if (data.playing && data.track?.name) {
            setCurrentTrack(data.track);
            setPlaying(true);
          } else {
            setCurrentTrack(null);
            setPlaying(false);
          }
        });
    }

    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, 20000);
    return () => clearInterval(interval);
  }, []);

  async function handleSave() {
    setSaving(true);
    await fetch('/api/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, note }),
    });
    setSaving(false);
    setSaved(true);
    setNote('');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
  return (
    <div className="bg-surface border border-line rounded-2xl p-7">
      <div className="flex justify-between items-baseline mb-6">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-dim">
          Mood today
        </span>
        <span className="font-mono text-xs text-text-dim">tap to log</span>
      </div>

      <div className="font-display font-light text-[88px] leading-none tracking-tight mb-1">
        {mood}
        <span className="text-3xl text-text-dim">/5</span>
      </div>
      <div className="font-mono text-[13px] uppercase tracking-wider text-accent mb-5">
        {moodWords[mood]}
      </div>

      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setMood(n)}
            className={`flex-1 font-mono text-sm border rounded-lg py-3 transition-colors ${
              n === mood
                ? 'border-accent text-accent bg-accent-dim'
                : 'border-line bg-surface-2 text-text-mid hover:border-text-mid hover:text-foreground'
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      {currentTrack && (
        <div className="flex items-center gap-3 p-3 bg-surface-2 border border-line rounded-xl mb-4">
          {currentTrack.albumCover && (
            <Image
              src={currentTrack.albumCover}
              alt={currentTrack.name}
              width={36}
              height={36}
              className="rounded-md flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{currentTrack.name}</div>
            <div className="text-xs font-mono text-text-dim">{currentTrack.artist}</div>
          </div>
          <div className="flex gap-1 items-end h-4 flex-shrink-0">
            {playing && (
              <>
                <span
                  className="w-[2px] bg-accent rounded-sm animate-[bar_1.1s_ease-in-out_infinite] h-2"
                  style={{ animationDelay: '0s' }}
                />
                <span
                  className="w-[2px] bg-accent rounded-sm animate-[bar_1.1s_ease-in-out_infinite] h-4"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="w-[2px] bg-accent rounded-sm animate-[bar_1.1s_ease-in-out_infinite] h-3"
                  style={{ animationDelay: '0.4s' }}
                />
              </>
            )}
          </div>
        </div>
      )}

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="A note about today (optional)"
        className="w-full bg-surface-2 border border-line rounded-xl p-3 text-sm text-foreground placeholder:text-text-dim resize-none mb-4 focus:outline-none focus:border-text-mid"
        rows={2}
      />

      <button
        onClick={handleSave}
        disabled={saving || saved}
        className={`w-full font-mono text-sm rounded-xl py-3 transition-colors ${
          saved
            ? 'bg-accent-dim text-accent border border-accent'
            : 'bg-accent text-[#14180A] font-semibold hover:bg-[#c2f25a]'
        }`}
      >
        {saved ? 'Saved ✓' : saving ? 'Saving...' : 'Log mood'}
      </button>
    </div>
  );
}
