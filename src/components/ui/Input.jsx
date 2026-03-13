import './Input.css';

// Labeled input/textarea with optional character counter and error slot.
// Props:
//   label       — visible label text
//   error       — error message string; renders below the field when set
//   multiline   — renders a <textarea> instead of <input>
//   maxLength   — enables character counter display when set
//   All other props are forwarded to the underlying <input> or <textarea>.
export function Input({
  label,
  error,
  multiline = false,
  maxLength,
  className = '',
  id,
  ...rest
}) {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const currentLength = rest.value?.length ?? 0;
  const hasError = Boolean(error);

  return (
    <div className={`input-wrapper ${className}`.trim()}>

      {/* ── Label row ── */}
      {label && (
        <div className="input-label-row">
          <label className="input-label" htmlFor={fieldId}>{label}</label>
          {maxLength && (
            <span className={`input-counter ${currentLength > maxLength ? 'input-counter--over' : ''}`}>
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      )}

      {/* ── Field ── */}
      {multiline ? (
        <textarea
          id={fieldId}
          className={`input-field input-field--textarea ${hasError ? 'input-field--error' : ''}`}
          maxLength={maxLength}
          {...rest}
        />
      ) : (
        <input
          id={fieldId}
          className={`input-field ${hasError ? 'input-field--error' : ''}`}
          maxLength={maxLength}
          {...rest}
        />
      )}

      {/* ── Error message ── */}
      {hasError && (
        <p className="input-error" role="alert">{error}</p>
      )}
    </div>
  );
}
