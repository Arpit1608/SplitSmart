import { useMatch, useNavigate } from 'react-router-dom';

// One sidebar (or mobile bottom-bar) button. Highlights itself when its route is active.
export default function NavButton({ to, end, icon, label }) {
  const navigate = useNavigate();
  const active = !!useMatch({ path: to, end: !!end });
  return (
    <button className={active ? 'active' : ''} onClick={() => navigate(to)}>
      <span className="ico">{icon}</span>
      <span className="nav-text">{label}</span>
    </button>
  );
}
