import { useModal } from '../../context/ModalContext';
import EmptyState from '../ui/EmptyState';
import ExpenseRow from './ExpenseRow';

export default function ExpensesTab({ group }) {
  const { openModal } = useModal();
  if (!group.expenses.length) {
    return (
      <EmptyState
        icon="↗"
        title="No expenses in this group yet"
        action={
          <button className="btn btn-primary" onClick={() => openModal('expense', { groupId: group.id })}>
            Add an expense
          </button>
        }
      >
        Add the first expense and choose exactly who shares it.
      </EmptyState>
    );
  }
  return (
    <div className="activity">
      {group.expenses.map((e) => (
        <ExpenseRow key={e.id} expense={e} groupName={group.name} />
      ))}
    </div>
  );
}
