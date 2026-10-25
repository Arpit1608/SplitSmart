import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useModal } from '../context/ModalContext';
import { totalOwed } from '../utils/balances';
import { fmt } from '../utils/format';
import ExpenseRow from '../components/groups/ExpenseRow';
import GroupCard from '../components/groups/GroupCard';
import EmptyState from '../components/ui/EmptyState';
import StatCard from '../components/ui/StatCard';

const miniTile = (bg) => ({ padding: 15, borderRadius: 12, background: bg });
const miniValue = { fontSize: 23 };

export default function DashboardPage() {
  const { user } = useAuth();
  const { groups, settlements, analytics } = useData();
  const { openModal } = useModal();
  const navigate = useNavigate();
  const { owed, gets } = totalOwed(groups, user.id);

  const recent = groups
    .flatMap((g) => g.expenses.map((e) => ({ ...e, groupName: g.name })))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const openGroup = () => openModal('group');
  const pendingForMe = settlements.filter((s) => s.status === 'pending' && s.toUser === user.id).length;
  const pendingFromMe = settlements.filter((s) => s.status === 'pending' && s.fromUser === user.id).length;
  const monthTotal = (analytics?.personalTotal || 0) + (analytics?.paidSharedTotal || 0);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 9 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <h1>
            Hey, {user.name.split(' ')[0]} <span style={{ fontSize: 24 }}>✦</span>
          </h1>
          <p>Here's the latest on your shared money.</p>
        </div>
        <div className="actions">
          <button className="btn btn-outline" onClick={openGroup}>
            ＋ New group
          </button>
          <button
            className="btn btn-primary"
            onClick={() => (groups.length ? openModal('expense') : (navigate('/groups'), openGroup()))}
          >
            ＋ Add expense
          </button>
        </div>
      </div>

      <div className="grid stats">
        <StatCard label="You owe" icon="↗" value={fmt(owed)} foot="Across all your groups" />
        <StatCard label="You're owed" icon="↙" value={fmt(gets)} foot="Money friends owe you" />
        <StatCard
          label="Your groups"
          icon="◫"
          value={groups.length}
          foot={`${groups.reduce((s, g) => s + g.expenses.length, 0)} shared expenses tracked`}
        />
      </div>

      <div className="grid two-col">
        <section className="panel">
          <div className="panel-head">
            <h2>Your groups</h2>
            <button className="link-btn" onClick={() => navigate('/groups')}>
              View all →
            </button>
          </div>
          {groups.length ? (
            <div className="grid group-grid">
              {groups.slice(0, 4).map((g) => (
                <GroupCard key={g.id} group={g} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="◫"
              title="No groups yet"
              action={
                <button className="btn btn-primary" onClick={openGroup}>
                  Create your first group
                </button>
              }
            >
              Create a group and invite friends by username.
            </EmptyState>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Recent activity</h2>
            <span className="pill">LATEST</span>
          </div>
          {recent.length ? (
            <div className="activity">
              {recent.map((e) => (
                <ExpenseRow key={e.id} expense={e} groupName={e.groupName} />
              ))}
            </div>
          ) : (
            <EmptyState icon="✳" title="It's quiet in here">
              Your group's expenses will show up here.
            </EmptyState>
          )}
        </section>
      </div>

      <section className="panel section-gap">
        <div className="panel-head">
          <h2>Settle up, simply</h2>
          <button className="link-btn" onClick={() => navigate('/settlements')}>
            See settlements →
          </button>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 12 }}>
          <div style={miniTile('#f0f8f3')}>
            <div className="tiny muted">PENDING CONFIRMATION</div>
            <div className="stat-value" style={miniValue}>{pendingForMe}</div>
            <div className="tiny">Payments waiting for you</div>
          </div>
          <div style={miniTile('#f8f5ee')}>
            <div className="tiny muted">YOUR OUTSTANDING</div>
            <div className="stat-value" style={miniValue}>{pendingFromMe}</div>
            <div className="tiny">Payments you've registered</div>
          </div>
          <div style={miniTile('#f4f1fb')}>
            <div className="tiny muted">THIS MONTH</div>
            <div className="stat-value" style={miniValue}>{fmt(monthTotal)}</div>
            <div className="tiny">Tracked spending so far</div>
          </div>
        </div>
      </section>
    </>
  );
}
