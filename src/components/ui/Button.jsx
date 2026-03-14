'use client';

import { Spinner } from './Spinner';

// General-purpose button. Variants map to CSS classes defined in globals.css.
// Props:
//   variant   — 'primary' (default) | 'secondary' | 'ghost'
//   size      — 'md' (default) | 'sm' | 'lg'
//   loading   — shows inline spinner and disables the button
//   disabled  — disables without showing spinner

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
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const cls = `btn btn-${variant} ${sizeClass} ${className}`.trim();

  return (
    <button
      type={type}
      className={cls}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      <span style={{ opacity: loading ? 0.7 : 1 }}>{children}</span>
    </button>
  );
}
