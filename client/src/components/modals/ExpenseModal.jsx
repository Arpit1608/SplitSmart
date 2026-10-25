import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupsApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useForm } from '../../hooks/useForm';
import { CATEGORIES } from '../../utils/constants';
import Field from '../ui/Field';
import Modal from '../ui/Modal';

export default function ExpenseModal({ groupId: initialGroupId, onClose }) {
  const { user } = useAuth();
  const { groups, refresh } = useData();
  const toast = useToast();
  const navigate = useNavigate();

  const [groupId, setGroupId] = useState(groups.some((g) => g.id === initialGroupId) ? initialGroupId : groups[0].id);
  const group = groups.find((g) => g.id === groupId);
  const { values, field } = useForm({ description: '', amount: '', category: CATEGORIES[0] });
  const [paidBy, setPaidBy] = useState(user.id);
  const [splitWith, setSplitWith] = useState(group.members.map((m) => m.id));

  const changeGroup = (id) => {
    const g = groups.find((x) => x.id === id);
    setGroupId(id);
    setPaidBy(user.id);
    setSplitWith(g.members.map((m) => m.id)); // everyone selected by default
  };

  const toggle = (id) => setSplitWith((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const submit = async (e) => {
    e.preventDefault();
    if (!splitWith.length) return toast('Select at least one person to split with.', true);
    try {
      await groupsApi.addExpense(groupId, { ...values, paidBy, splitWith });
      onClose();
      await refresh();
      navigate(`/groups/${groupId}`);
      toast('Expense saved and balances recalculated.');
    } catch (err) {
      toast(err.message, true);
    }
  };

  return (
    <Modal title="Add a shared expense" onClose={onClose}>
      <form onSubmit={submit}>
        <Field label="Group">
          <select value={groupId} onChange={(e) => changeGroup(e.target.value)}>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="What was it for?">
          <input {...field('description')} required />
        </Field>
        <Field label="Total amount (₹)">
          <input {...field('amount')} type="number" min="0.01" step="0.01" required />
        </Field>
        <div className="grid two-col" style={{ gap: 10 }}>
          <Field label="Category">
            <select {...field('category')}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Paid by">
            <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
              {group.members.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Split between">
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button
              type="button"
              className="btn btn-soft"
              style={{ padding: '7px 10px', fontSize: 11 }}
              onClick={() => setSplitWith(group.members.map((m) => m.id))}
            >
              Select all
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: '7px 10px', fontSize: 11 }}
              onClick={() => setSplitWith([user.id])}
            >
              Only me
            </button>
          </div>
          <div className="checks">
            {group.members.map((u) => (
              <label className="check-row" key={u.id}>
                <input type="checkbox" checked={splitWith.includes(u.id)} onChange={() => toggle(u.id)} />
                <span>
                  {u.name} {u.id === user.id ? '(you)' : ''}
                </span>
              </label>
            ))}
          </div>
        </Field>
        <div className="modal-actions">
          <button className="btn btn-outline" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary">Save expense</button>
        </div>
      </form>
    </Modal>
  );
}
