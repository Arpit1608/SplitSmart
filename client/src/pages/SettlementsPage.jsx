import { settlementsApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { dateText, fmt } from '../utils/format';
import EmptyState from '../components/ui/EmptyState';
import StatCard from '../components/ui/StatCard';

const METHOD_ICONS = { cash: '₹', upi: '⌁', bank: '⇄' };

export default function SettlementsPage() {
  const { user } = useAuth();
  const { settlements: list, refresh } = useData();
  const toast = useToast();

  const respond = async (action, id, message) => {
    try {
      await settlementsApi[action](id);
      await refresh();
      toast(message);
    } catch (e) {
      toast(e.message, true);
    }
  };

  const count = (pred) => list.filter(pred).length;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Settlements</h1>
          <p>Record cash, UPI, or bank payments. The recipient confirms it before balances change.</p>
        </div>
      </div>

      <div className="grid stats">
        <StatCard
          label="Awaiting your confirmation"
          icon="⌛"
          value={count((s) => s.status === 'pending' && s.toUser === user.id)}
          foot="You received these payment claims"
        />
        <StatCard
          label="Awaiting others"
          icon="⇢"
          value={count((s) => s.status === 'pending' && s.fromUser === user.id)}
          foot="You registered these payments"
        />
        <StatCard
          label="Confirmed payments"
          icon="✓"
          value={count((s) => s.status === 'confirmed')}
          foot="Verified by the recipient"
        />
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2>Payment history</h2>
        </div>
        {list.length ? (
          <div className="activity">
            {list.map((s) => (
              <div className="activity-row" key={s.id}>
                <div className="activity-icon">{METHOD_ICONS[s.method] || '⇄'}</div>
                <div className="activity-copy">
                  <strong>
                    {s.from?.name || 'Someone'} → {s.to?.name || 'Someone'}
                  </strong>
                  <span>
                    {s.group || 'Group'} · {s.method.toUpperCase()} · {dateText(s.createdAt)}
                    {s.note ? ' · ' + s.note : ''}
                  </span>
                </div>
                <div className="activity-amount">
                  {fmt(s.amount)}
                  <div style={{ marginTop: 5 }}>
                    <span className={`tag ${s.status}`}>{s.status.toUpperCase()}</span>
                  </div>
                </div>
                {s.status === 'pending' && s.toUser === user.id && (
                  <div style={{ display: 'grid', gap: 5 }}>
                    <button
                      className="btn btn-soft"
                      onClick={() => respond('confirm', s.id, 'Payment confirmed. Balances updated.')}
                    >
                      Confirm
                    </button>
                    <button className="btn btn-outline" onClick={() => respond('reject', s.id, 'Settlement rejected.')}>
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="⇄" title="No settlements yet">
            When you pay someone, register the payment from a group's balance tab.
          </EmptyState>
        )}
      </section>

      <div className="notice" style={{ marginTop: 18 }}>
        SplitSmart does not move money or verify bank transactions. A payment stays pending until the recipient confirms
        it; only confirmed settlements update balances.
      </div>
    </>
  );
}
