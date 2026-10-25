import { personalApi } from '../api';
import { useData } from '../context/DataContext';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';
import { dateText, fmt } from '../utils/format';
import { downloadPersonalCsv } from '../utils/csv';
import EmptyState from '../components/ui/EmptyState';
import StatCard from '../components/ui/StatCard';

export default function PersonalExpensesPage() {
  const { personal, month, refresh } = useData();
  const { openModal } = useModal();
  const toast = useToast();

  const total = personal.reduce((s, e) => s + e.amount, 0);
  const thisMonth = personal.filter((e) => e.date.startsWith(month)).reduce((s, e) => s + e.amount, 0);

  const remove = async (id) => {
    if (!window.confirm('Delete this personal expense?')) return;
    try {
      await personalApi.remove(id);
      await refresh();
      toast('Expense deleted.');
    } catch (e) {
      toast(e.message, true);
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Personal expenses</h1>
          <p>Keep track of the things you spend on your own, no splitting required.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal('personal')}>
          ＋ Add personal expense
        </button>
      </div>

      <div className="grid stats">
        <StatCard label="All-time personal spend" icon="↗" value={fmt(total)} foot={`${personal.length} expenses tracked`} />
        <StatCard label="This month" icon="▦" value={fmt(thisMonth)} foot="Personal-only spending" />
        <StatCard
          label="Categories"
          icon="◉"
          value={new Set(personal.map((e) => e.category)).size}
          foot="Different expense categories"
        />
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2>Your entries</h2>
          <button className="btn btn-outline" onClick={() => downloadPersonalCsv(personal)}>
            Export CSV ↓
          </button>
        </div>
        {personal.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Expense</th>
                <th>Category</th>
                <th>Date</th>
                <th className="right">Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {personal.map((e) => (
                <tr key={e.id}>
                  <td>
                    <strong>{e.description}</strong>
                  </td>
                  <td>
                    <span className="tag">{e.category}</span>
                  </td>
                  <td>{dateText(e.date)}</td>
                  <td className="right">
                    <strong>{fmt(e.amount)}</strong>
                  </td>
                  <td className="right">
                    <button className="link-btn" style={{ color: 'var(--red)' }} onClick={() => remove(e.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState icon="↗" title="No personal expenses yet">
            Add your own spending here without involving your group.
          </EmptyState>
        )}
      </section>
    </>
  );
}
