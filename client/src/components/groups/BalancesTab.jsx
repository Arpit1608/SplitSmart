import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useModal } from '../../context/ModalContext';
import { fmt } from '../../utils/format';
import Avatar from '../ui/Avatar';

export default function BalancesTab({ group }) {
  const { user } = useAuth();
  const { userById } = useData();
  const { openModal } = useModal();

  return (
    <div className="grid two-col">
      <div>
        <h3>Group balances</h3>
        {group.members.map((u) => {
          const bal = group.balances[u.id] || 0;
          return (
            <div className="person-row" key={u.id}>
              <Avatar name={u.name} />
              <div className="person-info">
                <strong>
                  {u.name} {u.id === user.id ? '(you)' : ''}
                </strong>
                <span>@{u.username}</span>
              </div>
              <div className={bal > 0 ? 'balance-pos' : bal < 0 ? 'balance-neg' : ''}>
                {bal > 0 ? '+' : ''}
                {fmt(bal)}
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <h3>Suggested payments</h3>
        {group.debts.length ? (
          group.debts.map((d) => (
            <div className="person-row" key={d.fromUser + d.toUser}>
              <div className="person-info">
                <strong>
                  {userById(d.fromUser).name} → {userById(d.toUser).name}
                </strong>
                <span>To settle the group's balance</span>
              </div>
              <strong>{fmt(d.amount)}</strong>
              {d.fromUser === user.id && (
                <button
                  className="btn btn-soft"
                  onClick={() => openModal('settlement', { groupId: group.id, toUser: d.toUser, amount: d.amount })}
                >
                  Pay
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="empty">Everyone is settled up ✨</div>
        )}
      </div>
    </div>
  );
}
