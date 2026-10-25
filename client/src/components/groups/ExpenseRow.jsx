import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { categoryIcon } from '../../utils/constants';
import { dateText, fmt } from '../../utils/format';

export default function ExpenseRow({ expense, groupName }) {
  const { user } = useAuth();
  const { userById } = useData();
  const payer = userById(expense.paidBy);
  const myShare = expense.splits?.find((s) => s.userId === user.id)?.amount || 0;

  return (
    <div className="activity-row">
      <div className="activity-icon">{categoryIcon(expense.category)}</div>
      <div className="activity-copy">
        <strong>{expense.description}</strong>
        <span>
          {groupName || 'Personal'} · {payer.name} paid · {dateText(expense.createdAt || expense.date)}
        </span>
      </div>
      <div className="activity-amount">
        {fmt(expense.amount)}
        <div className="tiny muted" style={{ fontWeight: 500 }}>
          your share {fmt(myShare)}
        </div>
      </div>
    </div>
  );
}
