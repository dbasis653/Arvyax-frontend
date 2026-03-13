import './ErrorMessage.css';

// Displays a user-friendly error message block.
// Never renders raw error objects — only the message string.
// Props:
//   message — the error string to display; renders nothing if falsy
export function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="error-message" role="alert">
      <span className="error-message__icon" aria-hidden="true">!</span>
      <p className="error-message__text">{message}</p>
    </div>
  );
}
