'use client';

import { useState } from 'react';
import { useJournal } from '@/hooks/useJournal';
import { useUser } from '@/context/UserContext';
import { AmbienceSelector } from './AmbienceSelector';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { MAX_TEXT_LENGTH, RATE_LIMIT_WINDOW_MINUTES } from '@/constants/journal.constants';
import { RateLimitError } from '@/services/api';

// Form for creating a new journal entry.
// Props:
//   onSuccess — called with the newly created entry after a successful submit
export function JournalForm({ onSuccess }) {
  const { user } = useUser();
  const { submitEntry, isSubmitting, error, clearError } = useJournal();

  const [ambience, setAmbience] = useState(null);
  const [text, setText]         = useState('');
  const [localError, setLocalError] = useState(null);

  const displayError = localError || error;
  const canSubmit = text.trim() && ambience && !isSubmitting;

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!ambience) { setLocalError('Please select an ambience before submitting.'); return; }
    if (!text.trim()) { setLocalError('Please write something before submitting.'); return; }
    if (text.length > MAX_TEXT_LENGTH) { setLocalError(`Entry must be ${MAX_TEXT_LENGTH} characters or fewer.`); return; }

    try {
      const entry = await submitEntry({ username: user.username, ambience, text });
      setText('');
      setAmbience(null);
      onSuccess?.(entry);
    } catch (err) {
      if (err instanceof RateLimitError) {
        setLocalError(`You've reached the limit. Please wait ${RATE_LIMIT_WINDOW_MINUTES} minutes before submitting again.`);
      }
    }
  }

  return (
    <div className="form-panel">
      <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit} noValidate>

        {/* ── Ambience picker ── */}
        <AmbienceSelector value={ambience} onChange={setAmbience} />

        {/* ── Text input ── */}
        <Input
          label="What's on your mind?"
          multiline
          placeholder="Write freely — your thoughts, feelings, reflections..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={MAX_TEXT_LENGTH}
        />

        {/* ── Error ── */}
        <ErrorMessage message={displayError} />

        {/* ── Submit ── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!canSubmit}
          >
            {isSubmitting
              ? <><span className="spinner spinner-sm" /><span>Saving…</span></>
              : <span>Save Entry</span>
            }
          </button>
        </div>
      </form>
    </div>
  );
}
