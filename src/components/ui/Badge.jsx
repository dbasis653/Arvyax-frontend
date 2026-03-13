import './Badge.css';
import { EMOTION_COLOR_MAP } from '@/constants/journal.constants';

// Colored pill for displaying an emotion label returned by the LLM.
// Falls back to a neutral style for unknown emotion strings.
// Props:
//   emotion — emotion string (e.g. 'calm', 'happy') — should match EMOTION_COLOR_MAP keys
export function Badge({ emotion }) {
  const modifier = EMOTION_COLOR_MAP[emotion?.toLowerCase()] ?? 'default';

  return (
    <span className={`badge badge--${modifier}`}>
      {emotion ?? 'unknown'}
    </span>
  );
}
