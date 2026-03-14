// App-wide footer.
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1120px',
        margin: '0 auto',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}>
        <p style={{ fontSize: '13px', color: 'var(--text)', margin: 0 }}>
          © {year} <span style={{ fontWeight: 600, color: 'var(--accent)' }}>Arvyax</span>. All rights reserved.
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text)', margin: 0, opacity: 0.7 }}>
          AI-Assisted Journal System
        </p>
      </div>
    </footer>
  );
}
