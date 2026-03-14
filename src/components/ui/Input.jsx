// Labeled input/textarea with optional character counter and error slot.
// Props:
//   label       — visible label text
//   error       — error message string; renders below the field when set
//   multiline   — renders a <textarea> instead of <input>
//   maxLength   — enables character counter display when set
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
  const fieldClass = `field${hasError ? ' error' : ''}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }} className={className}>

      {/* ── Label row ── */}
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-h)' }} htmlFor={fieldId}>
            {label}
          </label>
          {maxLength && (
            <span style={{
              fontSize: '12px',
              color: currentLength > maxLength ? '#ef4444' : 'var(--text)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      )}

      {/* ── Field ── */}
      {multiline ? (
        <textarea
          id={fieldId}
          className={fieldClass}
          maxLength={maxLength}
          style={{ resize: 'vertical', minHeight: '140px', lineHeight: '1.65' }}
          {...rest}
        />
      ) : (
        <input
          id={fieldId}
          className={fieldClass}
          maxLength={maxLength}
          {...rest}
        />
      )}

      {/* ── Inline error ── */}
      {hasError && (
        <p style={{ fontSize: '13px', color: '#ef4444', margin: 0 }} role="alert">{error}</p>
      )}
    </div>
  );
}
