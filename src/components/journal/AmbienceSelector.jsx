import { AMBIENCE_OPTIONS } from '@/constants/journal.constants';

// Controlled radio group for selecting a journal ambience.
// Props:
//   value     — currently selected ambience string (or null)
//   onChange  — called with the new ambience string when a card is clicked
export function AmbienceSelector({ value, onChange }) {
  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
      <legend style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-h)', marginBottom: '10px' }}>
        Ambience
      </legend>
      <div style={{ display: 'flex', gap: '10px' }}>
        {AMBIENCE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`ambience-card${value === option.value ? ' selected' : ''}`}
          >
            {/* Hidden native radio */}
            <input
              type="radio"
              name="ambience"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
            />
            <span className="ambience-icon" aria-hidden="true">{option.icon}</span>
            <span className="ambience-label">{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
