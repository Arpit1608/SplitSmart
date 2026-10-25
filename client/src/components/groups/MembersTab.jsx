import { useState } from 'react';
import { groupsApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Avatar from '../ui/Avatar';

export default function MembersTab({ group }) {
  const { user } = useAuth();
  const { refresh } = useData();
  const toast = useToast();
  const [username, setUsername] = useState('');

  const addMember = async (e) => {
    e.preventDefault();
    try {
      await groupsApi.addMember(group.id, username);
      setUsername('');
      await refresh();
      toast('Member added to group.');
    } catch (err) {
      toast(err.message, true);
    }
  };

  return (
    <>
      <form className="search-row" onSubmit={addMember}>
        <input
          className="search-input"
          placeholder="Add by exact username (e.g. @riya)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Add member
        </button>
      </form>
      <div className="muted tiny" style={{ marginBottom: 12 }}>
        Only existing SplitSmart accounts can be added. The app will warn you if a username doesn't exist.
      </div>
      {group.members.map((u) => (
        <div className="person-row" key={u.id}>
          <Avatar name={u.name} />
          <div className="person-info">
            <strong>
              {u.name} {u.id === group.createdBy && <span className="tag">CREATOR</span>}
            </strong>
            <span>@{u.username}</span>
          </div>
          {u.id === user.id && <span className="tag">YOU</span>}
        </div>
      ))}
    </>
  );
}
