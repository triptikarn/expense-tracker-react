import { formatMoney } from '../utils/money';

/**
 * Horizontal bar chart of spending per category, drawn with plain
 * divs (no chart library). Widths are proportional to the largest
 * category in the summary's byCategory map.
 */
export default function CategoryChart({ byCategory = {}, currency }) {
  const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) {
    return <p className="empty">No spending recorded for this period.</p>;
  }
  const max = Math.max(...entries.map(([, v]) => v));

  return (
    <div className="bar-chart" role="img" aria-label="Spending by category">
      {entries.map(([category, amount]) => (
        <div key={category} className="bar-row">
          <span className="bar-label">{category}</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${Math.max(2, (amount / max) * 100)}%` }}
            />
          </div>
          <span className="bar-value">{formatMoney(amount, currency)}</span>
        </div>
      ))}
    </div>
  );
}
