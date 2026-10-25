import { useNavigate } from 'react-router-dom';
import { groupsApi } from '../../api';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useForm } from '../../hooks/useForm';
import { fmt } from '../../utils/format';
import Field from '../ui/Field';
import Modal from '../ui/Modal';

const METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI paid outside SplitSmart' },
  { value: 'bank', label: 'Bank transfer' },
];

// `amount` is the suggested maximum, in paise.
export default function SettlementModal({ groupId, toUser, amount, onClose }) {
  const { userById, refresh } = useData();
  const toast = useToast();
  const navigate = useNavigate();
  const { values, field } = useForm({ amount: (amount / 100).toFixed(2), method: 'cash', note: '' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await groupsApi.addSettlement(groupId, { ...values, toUser });
      onClose();
      await refresh();
      navigate('/settlements');
      toast('Payment registered. Waiting for recipient confirmation.');
    } catch (err) {
      toast(err.message, true);
    }
  };

  return (
    <Modal title="Register a payment" onClose={onClose}>
      <p className="muted">
        You're recording a payment to <strong>{userById(toUser).name}</strong>. They must confirm it before group
        balances update.
      </p>
      <form onSubmit={submit}>
        <Field label="Amount (₹)" hint={`Maximum suggested settlement: ${fmt(amount)}`}>
          <input {...field('amount')} type="number" min="0.01" step="0.01" max={(amount / 100).toFixed(2)} required />
        </Field>
        <Field label="Payment method">
          <select {...field('method')}>
            {METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Note (optional)">
          <input {...field('note')} placeholder="e.g. Paid after dinner" />
        </Field>
        <div className="notice">
          This only records a payment claim. No money is moved by SplitSmart. The recipient confirms or rejects it.
        </div>
        <div className="modal-actions">
          <button className="btn btn-outline" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary">Register payment</button>
        </div>
      </form>
    </Modal>
  );
}
