import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useModal } from '../context/ModalContext';
import { fmt } from '../utils/format';
import BalancesTab from '../components/groups/BalancesTab';
import ChatTab from '../components/groups/ChatTab';
import ExpensesTab from '../components/groups/ExpensesTab';
import MembersTab from '../components/groups/MembersTab';
import StatCard from '../components/ui/StatCard';

const TABS = [
  ['expenses', 'Expenses'],
  ['balances', 'Balances & settle'],
  ['members', 'Members'],
  ['chat', 'Group chat'],
];

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const { groups, loaded } = useData();
  const { openModal } = useModal();
  const navigate = useNavigate();
  const [tab, setTab] = useState('expenses');

  const group = groups.find((g) => g.id === groupId);
  if (!loaded) return null;
  if (!group) return <Navigate to="/groups" replace />;

  const net = group.balances[user.id] || 0;
  const netColor = net > 0 ? 'var(--green)' : net < 0 ? 'var(--red)' : 'inherit';

  return (
    <>
      <div className="group-header">
        <button className="back-btn" onClick={() => navigate('/groups')} aria-label="Back to groups">
          ←
        </button>
        <div className="group-symbol">✳</div>
        <div style={{ flex: 1 }}>
          <h1>{group.name}</h1>
          <p className="muted tiny" style={{ margin: 0 }}>
            {group.members.length} members · {group.expenses.length} expenses
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal('expense', { groupId: group.id })}>
          ＋ Add expense
        </button>
      </div>

      <div className="grid stats">
        <StatCard
          label="Group spending"
          icon="↗"
          value={fmt(group.expenses.reduce((s, e) => s + e.amount, 0))}
          foot="Total recorded expenses"
        />
        <StatCard
          label="Your balance"
          icon="⇄"
          value={fmt(net)}
          valueStyle={{ color: netColor }}
          foot={net > 0 ? 'You are owed money' : net < 0 ? 'You owe the group' : 'All settled up'}
        />
        <StatCard label="Members" icon="♧" value={group.members.length} foot="People in this group" />
      </div>

      <div className="tabs">
        {TABS.map(([key, label]) => (
          <button key={key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      <section className="panel">
        {tab === 'expenses' && <ExpensesTab group={group} />}
        {tab === 'balances' && <BalancesTab group={group} />}
        {tab === 'members' && <MembersTab group={group} />}
        {tab === 'chat' && <ChatTab group={group} />}
      </section>
    </>
  );
}
