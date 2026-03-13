// Matches the Ambience enum in the backend Prisma schema exactly.
const AMBIENCE_OPTIONS = [
  { value: 'forest', label: 'Forest', icon: '🌲' },
  { value: 'ocean', label: 'Ocean', icon: '🌊' },
  { value: 'mountain', label: 'Mountain', icon: '⛰️' },
];

// Must match backend validation: text.isLength({ max: 5000 })
const MAX_TEXT_LENGTH = 5000;

// Rate limit imposed by the backend on LLM endpoints.
const RATE_LIMIT_WINDOW_MINUTES = 15;
const RATE_LIMIT_MAX_REQUESTS = 10;

// Maps emotion strings (returned by LLM) to CSS modifier class names.
// Used by the Badge component to apply the right color.
const EMOTION_COLOR_MAP = {
  calm: 'calm',
  happy: 'happy',
  excited: 'excited',
  sad: 'sad',
  anxious: 'anxious',
  angry: 'angry',
  reflective: 'reflective',
  grateful: 'grateful',
  hopeful: 'hopeful',
  tired: 'tired',
};

export {
  AMBIENCE_OPTIONS,
  MAX_TEXT_LENGTH,
  RATE_LIMIT_WINDOW_MINUTES,
  RATE_LIMIT_MAX_REQUESTS,
  EMOTION_COLOR_MAP,
};
