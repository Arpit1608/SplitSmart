import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dateText, fmt } from '../../utils/format';
import Avatar from '../ui/Avatar';

const AVATAR_COLORS = ['', 'orange', 'purple'];
const groupSymbol = (name) => {
  const n = name.toLowerCase();
  return n.includes('trip') ? '✈' : n.includes('home') ? '⌂' : '✳';
};

export default function GroupCard({ group }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const net = group.balances[user.id] || 0;

  return (
    <article className="group-card" onClick={() => navigate(`/groups/${group.id}`)}>
      <div className="group-top">
        <div className="group-symbol">{groupSymbol(group.name)}</div>
        <span className="pill">{group.members.length} MEMBERS</span>
      </div>
      <h3>{group.name}</h3>
      <p className="muted tiny">Created {dateText(group.createdAt)}</p>
      <div className="group-foot">
        <div className="member-stack">
          {group.members.slice(0, 4).map((u, i) => (
            <Avatar key={u.id} name={u.name} title={u.name} color={AVATAR_COLORS[i % 3]} />
          ))}
        </div>
        <div className={net > 0 ? 'balance-pos' : net < 0 ? 'balance-neg' : ''}>
          {net > 0 ? 'gets ' + fmt(net) : net < 0 ? 'owes ' + fmt(-net) : 'all settled'}
        </div>
      </div>
    </article>
  );
}
