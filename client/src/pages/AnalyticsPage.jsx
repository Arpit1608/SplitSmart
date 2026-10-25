import { useData } from '../context/DataContext';
import { fmt } from '../utils/format';
import EmptyState from '../components/ui/EmptyState';
import StatCard from '../components/ui/StatCard';

const EMPTY = { categories: [], daily: [], personalTotal: 0, paidSharedTotal: 0 };

export default function AnalyticsPage() {
  const { analytics, month, setMonth } = useData();
  const a = analytics || EMPTY;
  const max = Math.max(1, ...a.daily.map((d) => d.amount));
  const catMax = Math.max(1, ...a.categories.map((c) => c.amount));

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Spending insights</h1>
          <p>Understand where your money goes, month by month.</p>
        </div>
        <input
          type="month"
          className="month-input"
          value={month}
          onChange={(e) => e.target.value && setMonth(e.target.value)}
        />
      </div>

      <div className="grid stats">
        <StatCard label="Personal spending" icon="↗" value={fmt(a.personalTotal)} foot="Expenses just for you" />
        <StatCard
          label="Shared expenses paid"
          icon="⇄"
          value={fmt(a.paidSharedTotal)}
          foot="Full amount paid by you in groups"
        />
        <StatCard
          label="Tracked total"
          icon="▥"
          value={fmt(a.personalTotal + a.paidSharedTotal)}
          foot="Before reimbursements and settlements"
        />
      </div>

      <div className="grid two-col">
        <section className="panel">
          <div className="panel-head">
            <h2>Daily spending</h2>
            <span className="pill">{month}</span>
          </div>
          <div className="chart-wrap">
            {a.daily.map((d) => (
              <div className="chart-col" key={d.day} title={`${d.day}: ${fmt(d.amount)}`}>
                <div className="chart-bar" style={{ height: Math.max(d.amount ? 4 : 0, (d.amount / max) * 175) }} />
                <span>{d.day % 5 === 1 ? d.day : ''}</span>
              </div>
            ))}
          </div>
          <p className="tiny muted" style={{ margin: '15px 0 0' }}>
            Bars show recorded expenses you paid on each day. Hover over a bar for the amount.
          </p>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>By category</h2>
            <span className="pill">TOP SPENDS</span>
          </div>
          {a.categories.length ? (
            <div className="bar-list">
              {a.categories.map((c) => (
                <div key={c.category}>
                  <div className="bar-label">
                    <span>{c.category}</span>
                    <strong>{fmt(c.amount)}</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(c.amount / catMax) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="◉" title="No spending to chart yet">
              Add personal or group expenses to see your insights.
            </EmptyState>
          )}
        </section>
      </div>

      <div className="notice" style={{ marginTop: 18 }}>
        Analytics include your personal expenses and the full amount of shared expenses you paid. They are a spending
        view, not a statement of your final share after settlements.
      </div>
    </>
  );
}
