import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupsApi, usersApi } from '../../api';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useForm } from '../../hooks/useForm';
import Field from '../ui/Field';
import Modal from '../ui/Modal';

export default function GroupModal({ onClose }) {
  const { refresh } = useData();
  const toast = useToast();
  const navigate = useNavigate();
  const { values, field } = useForm({ name: '', usernames: '' });
  const [hints, setHints] = useState('');

  // As you type the last username, suggest matching users (debounced 250ms).
  useEffect(() => {
    const q = values.usernames.split(',').pop().trim().replace(/^@/, '');
    if (!q) {
      setHints('');
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const { users } = await usersApi.search(q);
        setHints(users.length ? 'Matching users: ' + users.map((u) => '@' + u.username).join(' · ') : 'No matching users yet. Check the username.');
      } catch {
        /* hints are optional */
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [values.usernames]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const usernames = values.usernames.split(',').map((x) => x.trim()).filter(Boolean);
      const { group } = await groupsApi.create({ name: values.name, usernames });
      onClose();
      await refresh();
      navigate(`/groups/${group.id}`);
      toast('Group created! Invite more friends any time.');
    } catch (err) {
      toast(err.message, true);
    }
  };

  return (
    <Modal title="Create a group" onClose={onClose}>
      <form onSubmit={submit}>
        <Field label="Group name">
          <input {...field('name')} required />
        </Field>
        <Field
          label="Invite friends by username"
          hint="Only existing users can be invited. If a username is wrong, the group will not be created and you'll see which one failed."
        >
          <input {...field('usernames')} placeholder="e.g. riya, aman (comma separated)" />
        </Field>
        <div className="tiny muted">{hints}</div>
        <div className="modal-actions">
          <button className="btn btn-outline" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary">Create group</button>
        </div>
      </form>
    </Modal>
  );
}
