import './AmbienceSelector.css';
import { AMBIENCE_OPTIONS } from '@/constants/journal.constants';

// Controlled radio group for selecting a journal ambience (forest/ocean/mountain).
// Renders each option as a clickable card — no native radio UI shown.
// Props:
//   value     — the currently selected ambience string (or null)
//   onChange  — called with the new ambience string when a card is clicked
export function AmbienceSelector({ value, onChange }) {
  return (
    <fieldset className="ambience-selector">
      <legend className="ambience-selector__legend">Ambience</legend>

      {/* ── Option cards ── */}
      <div className="ambience-selector__options">
        {AMBIENCE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`ambience-option ${value === option.value ? 'ambience-option--selected' : ''}`}
          >
            <input
              type="radio"
              name="ambience"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="ambience-option__input"
            />
            <span className="ambience-option__icon" aria-hidden="true">{option.icon}</span>
            <span className="ambience-option__label">{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
