import { Badge } from '@/components/ui/Badge';
import { capitalize } from '@/utils/format';
import './InsightsSummary.css';

// Renders the three aggregate stats returned by GET /api/journal/insights/:userId:
//   totalEntries, topEmotion, mostUsedAmbience
// Each stat is displayed in its own card.
// Props:
//   insights — { totalEntries, topEmotion, mostUsedAmbience, recentKeywords }
export function InsightsSummary({ insights }) {
  return (
    <div className="insights-summary">

      {/* ── Total entries ── */}
      <div className="insights-card">
        <p className="insights-card__label">Total Entries</p>
        <p className="insights-card__value">{insights.totalEntries}</p>
      </div>

      {/* ── Top emotion ── */}
      <div className="insights-card">
        <p className="insights-card__label">Top Emotion</p>
        <div className="insights-card__value">
          {insights.topEmotion
            ? <Badge emotion={insights.topEmotion} />
            : <span className="insights-card__empty">—</span>
          }
        </div>
      </div>

      {/* ── Most used ambience ── */}
      <div className="insights-card">
        <p className="insights-card__label">Favourite Ambience</p>
        <p className="insights-card__value insights-card__value--accent">
          {insights.mostUsedAmbience
            ? capitalize(insights.mostUsedAmbience)
            : <span className="insights-card__empty">—</span>
          }
        </p>
      </div>

    </div>
  );
}
