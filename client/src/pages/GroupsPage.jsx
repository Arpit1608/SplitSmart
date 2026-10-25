import { useData } from '../context/DataContext';
import { useModal } from '../context/ModalContext';
import GroupCard from '../components/groups/GroupCard';

export default function GroupsPage() {
  const { groups } = useData();
  const { openModal } = useModal();
  const create = () => openModal('group');

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Your groups</h1>
          <p>Trips, flatmates, dinner plans — keep every split in one place.</p>
        </div>
        <button className="btn btn-primary" onClick={create}>
          ＋ Create group
        </button>
      </div>

      {groups.length ? (
        <div className="grid group-grid">
          {groups.map((g) => (
            <GroupCard key={g.id} group={g} />
          ))}
        </div>
      ) : (
        <div className="panel empty">
          <div className="empty-icon">◫</div>
          <h2>Your people are one group away</h2>
          <p>Create a group and invite them with their unique username.</p>
          <button className="btn btn-primary" onClick={create}>
            Create a group
          </button>
        </div>
      )}
    </>
  );
}
