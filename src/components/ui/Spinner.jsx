import './Spinner.css';

// Animated loading indicator.
// Props:
//   size — 'sm' | 'md' (default) | 'lg'
export default function Spinner({ size = 'md' }) {
  return (
    <span
      className={`spinner spinner--${size}`}
      role="status"
      aria-label="Loading"
    />
  );
}
