import './KeywordCloud.css';

// Displays the recentKeywords array returned by the insights endpoint.
// Keywords come from the 10 most recent entries (deduplicated by the backend).
// Props:
//   keywords — string[] from insights.recentKeywords
export function KeywordCloud({ keywords }) {
  if (!keywords || keywords.length === 0) {
    return (
      <p className="keyword-cloud__empty">
        No keywords yet — write a few entries to see your recurring themes.
      </p>
    );
  }

  return (
    <div className="keyword-cloud">
      {keywords.map((keyword) => (
        <span key={keyword} className="keyword-cloud__tag">
          {keyword}
        </span>
      ))}
    </div>
  );
}
