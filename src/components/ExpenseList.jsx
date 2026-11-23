import { formatDate, formatMoney } from '../utils/money';

/** The entries table for the selected month, with edit/delete actions. */
export default function ExpenseList({ expenses, currency, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return <p className="empty">No entries for this month yet.</p>;
  }

  return (
    <table className="entries">
      <thead>
        <tr>
          <th>Date</th>
          <th>Note</th>
          <th>Category</th>
          <th>Type</th>
          <th className="num">Amount</th>
          <th aria-label="Actions" />
        </tr>
      </thead>
      <tbody>
        {expenses.map((entry) => (
          <tr key={entry._id}>
            <td>{formatDate(entry.date)}</td>
            <td>{entry.note || '-'}</td>
            <td>
              <span className="badge">{entry.category}</span>
            </td>
            <td>{entry.type}</td>
            <td className={`num ${entry.type === 'income' ? 'income' : 'expense'}`}>
              {entry.type === 'income' ? '+' : '-'}
              {formatMoney(entry.amount, currency)}
            </td>
            <td className="row-actions">
              <button type="button" className="btn btn-small" onClick={() => onEdit(entry)}>
                Edit
              </button>
              <button
                type="button"
                className="btn btn-small btn-danger"
                onClick={() => onDelete(entry)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
