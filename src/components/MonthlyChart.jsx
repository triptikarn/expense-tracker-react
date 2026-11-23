import { formatMoney, monthLabel } from '../utils/money';

/**
 * Grouped vertical bar chart of income vs expenses per month, from
 * the API's /monthly report ({ "2026-11": { income, expense, balance } }).
 * Hand-rolled with divs - heights are proportional to the biggest bar.
 */
export default function MonthlyChart({ monthly = {}, currency }) {
  const keys = Object.keys(monthly).sort();
  if (keys.length === 0) {
    return <p className="empty">No monthly data yet.</p>;
  }
  const max = Math.max(
    1,
    ...keys.flatMap((k) => [monthly[k].income, monthly[k].expense])
  );

  return (
    <div>
      <div className="vchart" role="img" aria-label="Income versus expenses by month">
        {keys.map((key) => (
          <div key={key} className="vchart-group">
            <div className="vchart-bars">
              <div
                className="vbar income"
                style={{ height: `${(monthly[key].income / max) * 100}%` }}
                title={`Income: ${formatMoney(monthly[key].income, currency)}`}
              />
              <div
                className="vbar expense"
                style={{ height: `${(monthly[key].expense / max) * 100}%` }}
                title={`Expenses: ${formatMoney(monthly[key].expense, currency)}`}
              />
            </div>
            <span className="vchart-label">{monthLabel(key)}</span>
          </div>
        ))}
      </div>
      <p className="legend">
        <span className="dot income" /> Income <span className="dot expense" /> Expenses
      </p>
    </div>
  );
}
