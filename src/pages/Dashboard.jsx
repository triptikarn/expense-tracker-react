import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import CategoryChart from '../components/CategoryChart';
import MonthlyChart from '../components/MonthlyChart';
import { CATEGORIES, formatMoney, monthKey, monthLabel } from '../utils/money';

/**
 * Dashboard: summary cards + charts for the selected month, the
 * add/edit form, and the entries list. Data comes from three API
 * calls - GET /api/expenses?month=, /api/expenses/summary?month= and
 * /api/expenses/monthly - refreshed together after every mutation.
 */
export default function Dashboard() {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';

  const [month, setMonth] = useState(monthKey());
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [list, sum, mon] = await Promise.all([
        api.listExpenses({ month, category: categoryFilter }),
        api.getSummary(month),
        api.getMonthly(),
      ]);
      setExpenses(list.expenses);
      setSummary(sum.summary);
      setMonthly(mon.monthly);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [month, categoryFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(payload) {
    setBusy(true);
    try {
      await api.createExpense(payload);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(payload) {
    setBusy(true);
    try {
      await api.updateExpense(editing._id, payload);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(entry) {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await api.deleteExpense(entry._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-head">
          <h1>{monthLabel(month)} at a glance</h1>
          <div className="page-head-actions">
            <label className="filter">
              Month
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value || monthKey())}
              />
            </label>
            <label className="filter">
              Category
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        {summary && (
          <section className="cards">
            <div className="card">
              <span className="card-label">Income</span>
              <strong className="income">{formatMoney(summary.totalIncome, currency)}</strong>
            </div>
            <div className="card">
              <span className="card-label">Expenses</span>
              <strong className="expense">{formatMoney(summary.totalExpense, currency)}</strong>
            </div>
            <div className="card">
              <span className="card-label">Balance</span>
              <strong>{formatMoney(summary.balance, currency)}</strong>
            </div>
            <div className="card">
              <span className="card-label">Entries</span>
              <strong>{summary.count}</strong>
            </div>
          </section>
        )}

        <section className="panel">
          <h2>{editing ? 'Edit entry' : 'Add an entry'}</h2>
          <ExpenseForm
            key={editing ? editing._id : 'new'}
            entry={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={editing ? () => setEditing(null) : undefined}
            busy={busy}
          />
        </section>

        <div className="grid-2">
          <section className="panel">
            <h2>Spending by category</h2>
            <CategoryChart byCategory={summary?.byCategory} currency={currency} />
          </section>
          <section className="panel">
            <h2>Monthly totals</h2>
            <MonthlyChart monthly={monthly} currency={currency} />
          </section>
        </div>

        <section className="panel">
          <h2>Entries</h2>
          {loading ? (
            <p>Loading entries...</p>
          ) : (
            <ExpenseList
              expenses={expenses}
              currency={currency}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </>
  );
}
