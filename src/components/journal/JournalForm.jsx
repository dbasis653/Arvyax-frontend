'use client';

import { useState } from 'react';
import { useJournal } from '@/hooks/useJournal';
import { useUser } from '@/context/UserContext';
import { AmbienceSelector } from './AmbienceSelector';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { MAX_TEXT_LENGTH } from '@/constants/journal.constants';
import { RateLimitError } from '@/services/api';
import './JournalForm.css';

// Form for creating a new journal entry.
// Handles ambience selection, text input, validation, and submission.
// Props:
//   onSuccess — called with the newly created entry after a successful submit
export function JournalForm({ onSuccess }) {
  const { user } = useUser();
  const { submitEntry, isSubmitting, error, clearError } = useJournal();

  const [ambience, setAmbience] = useState(null);
  const [text, setText] = useState('');
  const [localError, setLocalError] = useState(null);

  const displayError = localError || error;

  // Validates inputs client-side before hitting the API,
  // then delegates to the journal hook which calls the service.
  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!ambience) {
      setLocalError('Please select an ambience before submitting.');
      return;
    }
    if (!text.trim()) {
      setLocalError('Please write something before submitting.');
      return;
    }
    if (text.length > MAX_TEXT_LENGTH) {
      setLocalError(`Entry must be ${MAX_TEXT_LENGTH} characters or fewer.`);
      return;
    }

    try {
      const entry = await submitEntry({ username: user.username, ambience, text });
      setText('');
      setAmbience(null);
      onSuccess?.(entry);
    } catch (err) {
      // Map specific error types to user-friendly messages.
      // RateLimitError is surfaced here rather than in the hook because
      // the UI context (form submission) determines the right wording.
      if (err instanceof RateLimitError) {
        setLocalError(`You've reached the limit. Please wait ${15} minutes before submitting again.`);
      }
      // All other errors are already set in the hook's error state
    }
  }

  return (
    <form className="journal-form" onSubmit={handleSubmit} noValidate>

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

      {/* ── Error display ── */}
      <ErrorMessage message={displayError} />

      {/* ── Actions ── */}
      <div className="journal-form__actions">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!text.trim() || !ambience}
        >
          Save Entry
        </Button>
      </div>
    </form>
  );
}
