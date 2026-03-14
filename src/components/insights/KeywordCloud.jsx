// Displays the recentKeywords array from the insights endpoint.
// Props:
//   keywords — string[] from insights.recentKeywords
export function KeywordCloud({ keywords }) {
  if (!keywords || keywords.length === 0) {
    return (
      <p style={{ fontSize: '14px', color: 'var(--text)', fontStyle: 'italic', margin: 0 }}>
        No keywords yet — write a few entries to see your recurring themes.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {keywords.map((keyword) => (
        <span key={keyword} className="keyword-tag">{keyword}</span>
      ))}
    </div>
  );
}
