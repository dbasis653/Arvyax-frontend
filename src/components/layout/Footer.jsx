import './Footer.css';

// App-wide footer. Displayed on all pages below the main content.
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__copy">© {year} Arvyax. All rights reserved.</p>
        <p className="footer__tagline">AI-Assisted Journal System</p>
      </div>
    </footer>
  );
}
