import { useLocation, useNavigate, matchPath } from 'react-router-dom';
import { NAV_ITEMS } from '../../utils/constants';

export default function MobileNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <nav className="mobile-nav">
      {NAV_ITEMS.map((item) => {
        const active = !!matchPath({ path: item.to, end: !!item.end }, pathname);
        return (
          <button key={item.to} className={active ? 'active' : ''} onClick={() => navigate(item.to)}>
            <span className="ico">{item.icon}</span>
            {item.short}
          </button>
        );
      })}
    </nav>
  );
}
