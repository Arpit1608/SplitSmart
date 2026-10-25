import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS, SETTINGS_ITEM } from '../../utils/constants';
import Avatar from '../ui/Avatar';
import NavButton from './NavButton';

export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="sidebar">
      <div className="brand">
        SplitSmart<span>.</span>
        <small>money, minus the awkward</small>
      </div>
      <div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <NavButton key={item.to} {...item} />
          ))}
        </nav>
      </div>
      <div className="sidebar-bottom">
        <div className="nav-label">ACCOUNT</div>
        <nav className="nav">
          <NavButton {...SETTINGS_ITEM} />
          <button onClick={logout}>
            <span className="ico">↪</span>
            <span className="nav-text">Log out</span>
          </button>
        </nav>
        <div className="profile-mini">
          <Avatar name={user.name} />
          <div className="profile-text">
            <strong>{user.name}</strong>
            <span>@{user.username}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
