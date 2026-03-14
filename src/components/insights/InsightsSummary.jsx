import { Badge } from "@/components/ui/Badge";
import { capitalize } from "@/utils/format";

// Renders the three aggregate stats: totalEntries, topEmotion, mostUsedAmbience.
// Props:
//   insights — { totalEntries, topEmotion, mostUsedAmbience, recentKeywords }
export function InsightsSummary({ insights }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "14px",
      }}
    >
      {/* ── Total entries ── */}
      <div className="stat-card">
        <p className="stat-label">Total Entries</p>
        <p className="stat-value">{insights.totalEntries}</p>
      </div>

      {/* ── Top emotion ── */}
      <div className="stat-card">
        <p className="stat-label">Top Emotion</p>
        <div className="stat-value" style={{ fontSize: "20px" }}>
          {insights.topEmotion ? (
            <Badge emotion={insights.topEmotion} />
          ) : (
            <span
              style={{
                color: "var(--text)",
                fontWeight: 400,
                fontSize: "18px",
              }}
            >
              —
            </span>
          )}
        </div>
      </div>

      {/* ── Most used ambience ── */}
      <div className="stat-card">
        <p className="stat-label">Favourite Ambience</p>
        <p className="stat-value" style={{ color: "var(--accent)" }}>
          {insights.mostUsedAmbience ? (
            capitalize(insights.mostUsedAmbience)
          ) : (
            <span
              style={{
                color: "var(--text)",
                fontWeight: 400,
                fontSize: "18px",
              }}
            >
              —
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
