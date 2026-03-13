import './Button.css';
import Spinner from './Spinner';

// General-purpose button. Renders a native <button> with variant-based styling.
// Props:
//   variant   — 'primary' (default) | 'secondary' | 'ghost'
//   size      — 'md' (default) | 'sm' | 'lg'
//   loading   — shows inline spinner and disables the button
//   disabled  — disables without showing spinner
//   type      — passed through to <button> (default: 'button')
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${className}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {/* ── Loading spinner ── */}
      {loading && <Spinner size="sm" />}

      {/* ── Label ── */}
      <span className={loading ? 'btn__label btn__label--loading' : 'btn__label'}>
        {children}
      </span>
    </button>
  );
}
