import { useNavigate } from 'react-router-dom';
import { personalApi } from '../../api';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useForm } from '../../hooks/useForm';
import { CATEGORIES } from '../../utils/constants';
import { todayISO } from '../../utils/format';
import Field from '../ui/Field';
import Modal from '../ui/Modal';

export default function PersonalExpenseModal({ onClose }) {
  const { refresh } = useData();
  const toast = useToast();
  const navigate = useNavigate();
  const { values, field } = useForm({ description: '', amount: '', category: CATEGORIES[0], date: todayISO() });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await personalApi.create(values);
      onClose();
      await refresh();
      navigate('/expenses');
      toast('Personal expense saved.');
    } catch (err) {
      toast(err.message, true);
    }
  };

  return (
    <Modal title="Add personal expense" onClose={onClose}>
      <form onSubmit={submit}>
        <Field label="What did you spend on?">
          <input {...field('description')} required />
        </Field>
        <Field label="Amount (₹)">
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
          <Field label="Date">
            <input {...field('date')} type="date" required />
          </Field>
        </div>
        <p className="tiny muted">This expense is private to your account and will not affect group balances.</p>
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
