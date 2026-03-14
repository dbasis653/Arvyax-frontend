// Displays a user-friendly error message block.
// Props:
//   message — the error string to display; renders nothing if falsy
export function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="error-block" role="alert">
      <span className="error-icon" aria-hidden="true">!</span>
      <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>{message}</p>
    </div>
  );
}
