import { EMOTION_COLOR_MAP } from '@/constants/journal.constants';

// Colored pill for displaying an emotion label returned by the LLM.
// Falls back to a neutral accent style for unknown emotion strings.

const EMOTION_STYLES = {
  calm:       { background: 'rgba(99,179,237,0.14)',  color: '#2b7fc4' },
  happy:      { background: 'rgba(251,211,141,0.20)', color: '#b45309' },
  excited:    { background: 'rgba(252,165,165,0.18)', color: '#b91c1c' },
  sad:        { background: 'rgba(147,197,253,0.18)', color: '#1d4ed8' },
  anxious:    { background: 'rgba(253,186,116,0.20)', color: '#c2410c' },
  angry:      { background: 'rgba(252,165,165,0.24)', color: '#991b1b' },
  reflective: { background: 'rgba(196,181,253,0.20)', color: '#6d28d9' },
  grateful:   { background: 'rgba(110,231,183,0.20)', color: '#065f46' },
  hopeful:    { background: 'rgba(167,243,208,0.22)', color: '#047857' },
  tired:      { background: 'rgba(209,213,219,0.28)', color: '#4b5563' },
};

export function Badge({ emotion }) {
  const key = EMOTION_COLOR_MAP[emotion?.toLowerCase()];
  const style = EMOTION_STYLES[key] ?? { background: 'var(--accent-bg)', color: 'var(--accent)' };

  return (
    <span
      className="badge"
      style={style}
    >
      {emotion ?? 'unknown'}
    </span>
  );
}
