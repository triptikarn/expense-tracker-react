import { useState } from 'react';
import { CATEGORIES, toDateInputValue } from '../utils/money';

const EMPTY = {
  type: 'expense',
  amount: '',
  category: 'food',
  note: '',
  date: () => new Date().toISOString().slice(0, 10),
};

/**
 * Add/edit form for an income or expense entry. Pass an existing
 * `entry` to edit it, or nothing to create a new one. The amount is
 * sent as a number, matching the backend's Mongoose schema.
 */
export default function ExpenseForm({ entry, onSubmit, onCancel, busy }) {
  const [form, setForm] = useState(
    entry
      ? {
          type: entry.type,
          amount: String(entry.amount),
          category: entry.category || 'other',
          note: entry.note || '',
          date: toDateInputValue(entry.date) || EMPTY.date(),
        }
      : { ...EMPTY, date: EMPTY.date() }
  );

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      type: form.type,
      amount: Number(form.amount),
      category: form.category,
      note: form.note.trim(),
      date: form.date || undefined,
    });
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Type
          <select value={form.type} onChange={update('type')}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
        <label>
          Amount
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={update('amount')}
            placeholder="0.00"
          />
        </label>
        <label>
          Category
          <select value={form.category} onChange={update('category')}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input type="date" value={form.date} onChange={update('date')} />
        </label>
      </div>
      <label>
        Note
        <input
          maxLength={300}
          value={form.note}
          onChange={update('note')}
          placeholder="What was this for?"
        />
      </label>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {entry ? 'Save changes' : 'Add entry'}
        </button>
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
